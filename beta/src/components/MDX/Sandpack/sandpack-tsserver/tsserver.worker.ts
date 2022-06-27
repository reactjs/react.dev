import type {VirtualTypeScriptEnvironment} from '@typescript/vfs';
import type {CompilerOptions} from 'typescript';
import {ChannelClient, ChannelServer} from './ChannelBridge';
import ts from 'typescript';
import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from '@typescript/vfs';
import type {Diagnostic} from '@codemirror/lint';
import {
  CONFIG as CONFIG,
  DiagnosticFilter,
  getConfigForFilePath,
} from './config';
import type {TSServerRender} from './TypescriptServerProvider';
import {formatWithCursor} from 'prettier/standalone';
import babelParser from 'prettier/parser-babel';

const BUCKET_URL = 'https://prod-packager-packages.codesandbox.io/v1/typings';
const TYPES_REGISTRY = 'https://unpkg.com/types-registry@latest/index.json';
const wrappedPostMessage = (msg: any) => postMessage(msg);
if (CONFIG.debugBridge) {
  addEventListener('message', (e) => {
    console.log('render -> worker', e.data);
  });
}

interface SerializedAction {
  name: string;
  data: ts.CodeFixAction;
}

export interface SerializedDiagnostic extends Diagnostic {
  serializedActions: SerializedAction[];
}

type FetchedTypes = Record<string, {module: {code: string}}>;

/**
 * Fetch dependencies types from CodeSandbox CDN
 */
const fetchTypesFromCodeSandboxBucket = async ({
  name,
  version,
}: {
  name: string;
  version: string;
}): Promise<FetchedTypes> => {
  try {
    const url = `${BUCKET_URL}/${name}/${version}.json`;
    const {files} = await fetch(url).then((data) => data.json());
    return files;
  } catch (error) {
    console.warn(`Failed to fetch types: ${name}@${version}`, error);
    return {};
  }
};

interface TypeRegistryJson {
  entries: Record<
    string,
    {
      latest: string;
    }
  >;
}

/**
 * Pull the list of @types/... packages from the "types-registry" package.
 * @see https://www.npmjs.com/package/types-registry
 */
const getDefinitelyTypedPackageMapping = async () => {
  const request = await fetch(TYPES_REGISTRY);
  const json: TypeRegistryJson = await request.json();
  return json.entries;
};

/**
 * Process the TS compile options or default to
 */
const getCompileOptions = (
  tsconfigFile: Record<string, any>
): CompilerOptions => {
  const defaultValue: CompilerOptions = {
    target: ts.ScriptTarget.ES2021,
    module: ts.ModuleKind.ES2020,
    lib: ['es2021', 'es2020', 'dom', 'webworker'],
    esModuleInterop: true,
    allowJs: true,
    checkJs: true,
    jsx: ts.JsxEmit.ReactJSXDev,
  };

  if (tsconfigFile.compilerOptions) {
    const blankSystem = createSystem(new Map());
    return ts.parseJsonConfigFileContent(tsconfigFile, blankSystem, '/')
      .options;
  }

  return defaultValue;
};

/**
 * Fetch dependencies types from Sandpack's CDN.
 * If a package has no types, discover them from DefinitelyTyped.
 */
const fetchDependencyTypesFromCDN = async (
  dependenciesMap: Map<string, string>
): Promise<FetchedTypes> => {
  let typeRegistryFetchPromise: Promise<Record<string, {latest: string}>>;
  const requiredTypeFiles: FetchedTypes = {};
  const mergeValidTypes = (files: FetchedTypes) => {
    Object.entries(files).forEach(([key, value]) => {
      const isTypeModule =
        key.endsWith('.d.ts') ||
        (key.endsWith('/package.json') && value?.module?.code);
      if (isTypeModule) {
        const fileName = `/node_modules${key}`;
        requiredTypeFiles[fileName] = value;
      }
    });
  };
  await Promise.all(
    Array.from(dependenciesMap).map(async ([name, version]) => {
      // Try to fetch types of current version directly from the CDN.
      // This will work if the package contains .d.ts files.
      const files = await fetchTypesFromCodeSandboxBucket({name, version});
      const hasTypes = Object.keys(files).some(
        (key) => key.startsWith('/' + name) && key.endsWith('.d.ts')
      );

      // Types found at current version - add them to the filesystem.
      if (hasTypes) {
        mergeValidTypes(files);
        return;
      }

      // Pull the list of @types/... packages from the "types-registry" package.
      // https://www.npmjs.com/package/types-registry
      if (!typeRegistryFetchPromise) {
        typeRegistryFetchPromise = getDefinitelyTypedPackageMapping();
      }

      // If types are available in the registry, use them.
      const typingName = `@types/${name}`;
      const registryEntries = await typeRegistryFetchPromise;
      if (registryEntries[name]) {
        const atTypeFiles = await fetchTypesFromCodeSandboxBucket({
          name: typingName,
          version: registryEntries[name].latest,
        });
        mergeValidTypes(atTypeFiles);
      }
    })
  );

  console.debug('Loaded type files for dependencies', requiredTypeFiles);

  return requiredTypeFiles;
};

function isDiagnosticAllowed(
  diagnostic: ts.Diagnostic,
  filter: DiagnosticFilter
): boolean {
  const isFiltered = filter.codes.has(diagnostic.code);
  switch (filter.type) {
    case 'deny':
      return !isFiltered;
    case 'allow':
      return isFiltered;
  }
}

class TSServerWorker {
  envs = new Map<number, VirtualTypeScriptEnvironment>();

  renderer = ChannelClient.createAndListen<TSServerRender>({
    waitForReady: true,
    requestPort: {postMessage: wrappedPostMessage},
    listenPort: globalThis,
  })[0];

  createEnv = async (args: {
    envId: number;
    files: Record<string, {code: string}>;
    entry: string;
  }) => {
    const {envId, files, entry} = args;
    const tsFiles = new Map();
    const allFiles = new Map();
    const rootPaths = [];
    type PackageName = string;
    type Version = string;
    const dependenciesMap = new Map<PackageName, Version>();
    let tsconfig = null;
    let packageJson = null;

    /**
     * Collect files
     */
    for (const filePath in files) {
      const content = files[filePath].code;
      allFiles.set(filePath, content);
      if (filePath[0] !== '/') {
        throw new Error(`Paths must be absolute: ${filePath}`);
      }

      if (filePath === '/tsconfig.json') {
        tsconfig = content;
      } else if (filePath === '/package.json') {
        packageJson = content;
      } else if (/^[^.]+.(t|j)sx?$/.test(filePath)) {
        // Only ts files
        tsFiles.set(filePath, content);
        rootPaths.push(filePath);
      }
    }

    const compilerOpts = getCompileOptions(
      tsconfig ? JSON.parse(tsconfig) : {}
    );

    /**
     * Process cache or get a fresh one
     */
    let fsMap: Map<string, string> =
      (await this.renderer.call('loadTypescriptCache', ts.version)) ||
      new Map();
    if (fsMap.size === 0) {
      fsMap = await createDefaultMapFromCDN(
        compilerOpts,
        ts.version,
        false,
        ts
      );
      await this.renderer.call('saveTypescriptCache', ts.version, fsMap);
    }

    /**
     * Add local files to the file-system
     */
    allFiles.forEach((content, filePath) => {
      fsMap.set(filePath, content);
    });

    /**
     * Get dependencies from package.json
     */
    const {dependencies, devDependencies} = packageJson
      ? JSON.parse(packageJson)
      : {dependencies: {}, devDependencies: {}};
    for (const dep in devDependencies ?? {}) {
      dependenciesMap.set(dep, devDependencies[dep]);
    }

    for (const dep in dependencies ?? {}) {
      // Avoid redundant requests
      if (!dependenciesMap.has(`@types/${dep}`)) {
        dependenciesMap.set(dep, dependencies[dep]);
      }
    }

    /**
     * Fetch dependencies types. To avoid needless work, we pre-bundle required types into react-type-cache.json
     * to avoid needless round trips for end users. This file is up-to-date as of 2022-06-02.
     *
     * To rebuild:
     *
     * 1. Change `false` to `true` here.
     * 2. Go to a page with a Sandpack and open the console.
     * 3. Find the 'Loaded type files for dependencies' debug log. You may need to enable verbose logging.
     * 4. Right-click on the logged object and choose "copy".
     * 5. Paste the contents into react-type-cache.json. On mac, you can run `pbpaste > react-type-cache.json`
     *    in this directory.
     */
    const dependencyFiles = false
      ? await fetchDependencyTypesFromCDN(dependenciesMap)
      : (await import('./react-type-cache.json')).default;
    for (const [key, value] of Object.entries(dependencyFiles)) {
      fsMap.set(key, value.module.code);
    }

    const system = createSystem(fsMap);

    const env = createVirtualTypeScriptEnvironment(
      system,
      rootPaths,
      ts,
      compilerOpts
    );

    this.envs.set(envId, env);
    return this.lintSystem({
      envId,
      filePath: entry,
    });
  };

  deleteEnv(envId: number) {
    return this.envs.delete(envId);
  }

  getEnv(envId: number): VirtualTypeScriptEnvironment | undefined {
    if (!this.envs.has(envId)) {
      console.warn('unknown env', envId);
    }
    return this.envs.get(envId);
  }

  lintSystem = (args: {envId: number; filePath: string}) => {
    const {envId, filePath} = args;
    const config = getConfigForFilePath(filePath);
    const env = this.getEnv(envId);
    if (!env) {
      return undefined;
    }

    const SyntacticDiagnostics =
      env.languageService.getSyntacticDiagnostics(filePath);
    const SemanticDiagnostic = env.languageService
      .getSemanticDiagnostics(filePath)
      .filter((semantic) =>
        isDiagnosticAllowed(semantic, config.semanticDiagnosticFilter)
      );
    const SuggestionDiagnostics = config.showSuggestionDiagnostics
      ? env.languageService.getSuggestionDiagnostics(filePath)
      : [];
    type Diagnostics = typeof SyntacticDiagnostics &
      typeof SemanticDiagnostic &
      typeof SuggestionDiagnostics;
    const tsDiagnostics: Diagnostics = Array.prototype.concat(
      SyntacticDiagnostics,
      SemanticDiagnostic,
      SuggestionDiagnostics
    );
    return tsDiagnostics.reduce((acc, result) => {
      const from = result.start;
      const to = result.start + result.length;
      const codeActions = env.languageService.getCodeFixesAtPosition(
        filePath,
        from,
        to,
        [result.code],
        {},
        {}
      );

      type ErrorMessageObj = {
        messageText: string;
        next?: ErrorMessageObj[];
      };
      type ErrorMessage = ErrorMessageObj | string;

      const messagesErrors = (message: ErrorMessage): string[] => {
        if (typeof message === 'string') return [message];

        const messageList: string[] = [];
        const getMessage = (loop: ErrorMessageObj) => {
          messageList.push(loop.messageText);

          if (loop.next) {
            loop.next.forEach((item) => {
              getMessage(item);
            });
          }
        };

        getMessage(message);

        return messageList;
      };

      const severity: Diagnostic['severity'][] = [
        'warning',
        'error',
        'info',
        'info',
      ];

      messagesErrors(result.messageText).forEach((message) => {
        const finalMessage = config.showDiagnosticCodeNumber
          ? `${message} (${result.code})`
          : message;
        acc.push({
          from,
          to,
          message: finalMessage,
          source: result?.source,
          severity: severity[result.category],
          serializedActions: codeActions.map((action) => {
            return {
              name: action.description,
              data: action,
            };
          }),
        });
      });

      return acc;
    }, [] as SerializedDiagnostic[]);
  };

  infoAtPosition = (args: {envId: number; pos: number; filePath: string}) => {
    const env = this.getEnv(args.envId);
    if (!env) {
      return undefined;
    }
    const result = env.languageService.getQuickInfoAtPosition(
      args.filePath,
      args.pos
    );

    return result
      ? {
          result,
          tootltipText:
            ts.displayPartsToString(result.displayParts) +
            (result.documentation?.length
              ? '\n' + ts.displayPartsToString(result.documentation)
              : ''),
        }
      : {result, tooltipText: ''};
  };

  autocompleteAtPosition = (args: {
    envId: number;
    pos: number;
    explicit: boolean;
    filePath: string;
    charBefore?: string;
  }) => {
    const env = this.getEnv(args.envId);
    if (!env) {
      return undefined;
    }
    const config = getConfigForFilePath(args.filePath);

    const triggerCharacters = new Set<string | undefined>([
      '.',
      '"',
      "'",
      '`',
      '/',
      '@',
      '<',
      '#',
      ' ',
    ]);
    const {pos, explicit, filePath, charBefore} = args;
    const completions = env.languageService.getCompletionsAtPosition(
      filePath,
      pos,
      {
        includeCompletionsForImportStatements: true,
        includeCompletionsWithInsertText: true,
        // includeCompletionsWithSnippetText: true,
        includeCompletionsForModuleExports: true,
        includeAutomaticOptionalChainCompletions: true,
        includePackageJsonAutoImports: 'auto',
        triggerKind:
          explicit || !triggerCharacters.has(charBefore)
            ? ts.CompletionTriggerKind.Invoked
            : ts.CompletionTriggerKind.TriggerCharacter,
        triggerCharacter: triggerCharacters.has(charBefore)
          ? (charBefore as ts.CompletionsTriggerCharacter)
          : undefined,
      }
    );

    if (!completions) {
      return undefined;
    }

    return {
      ...completions,
      entries: completions.entries
        .filter((entry) => {
          if (entry.data) {
            return true;
          }

          if (config.showAmbientDeclareCompletions === false) {
            if (entry.kindModifiers?.includes('deprecated')) {
              return false;
            }

            if (
              entry.kindModifiers?.includes('declare') &&
              entry.kind === 'var'
            ) {
              return Boolean(entry.source);
            }
          }

          return true;
        })
        .map((entry) => ({
          ...entry,
          sourceDisplayString: ts.displayPartsToString(entry.sourceDisplay),
          details:
            entry.data &&
            env.languageService.getCompletionEntryDetails(
              filePath,
              pos,
              entry.name,
              FormatCodeSettings,
              entry.source,
              undefined,
              entry.data
            ),
        })),
    };
  };

  /**
   * When `content` is a string, update `filePath` to have that content. It
   * will be created if it doesn't exist.
   *
   * When content is undefined, delete the file.
   */
  updateFile = (
    envId: number,
    filePath: string,
    content: string | undefined
  ) => {
    const env = this.getEnv(envId);
    if (!env) {
      return;
    }

    if (content === undefined) {
      if (env.sys.fileExists(filePath)) {
        env.sys.deleteFile?.(filePath);
      }
      return;
    }

    try {
      env.updateFile(filePath, content);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Did not find a source file')
      ) {
        env.createFile(filePath, content);
      } else {
        throw error;
      }
    }
  };

  transpileFile(
    envId: number,
    filePath: string,
    content: string,
    formatOutput: 'prettier' | 'typescript'
  ) {
    const env = this.getEnv(envId);
    if (!env) {
      return;
    }

    this.updateFile(envId, filePath, content);
    const emitOutput = env.languageService.getEmitOutput(
      filePath,
      false,
      false
    );
    const emittedFile = emitOutput.outputFiles.at(0);

    if (!emittedFile) {
      return undefined;
    }

    // Format the emitted file before we return it, so it's as pretty as
    // possible before the user sees it.
    if (formatOutput === 'prettier') {
      return this.formatWithPrettier(emittedFile.text, 0).formatted;
    } else if (formatOutput === 'typescript') {
      const restoreContents = env.getSourceFile(emittedFile.name)?.getText();
      try {
        this.updateFile(envId, emittedFile.name, emittedFile.text);
        const edits = env.languageService
          .getFormattingEditsForDocument(emittedFile.name, FormatCodeSettings)
          .slice()
          .reverse();
        for (const edit of edits) {
          env.updateFile(emittedFile.name, edit.newText, edit.span);
        }
        return env.getSourceFile(emittedFile.name)?.getText();
      } finally {
        this.updateFile(envId, emittedFile.name, restoreContents);
      }
    } else {
      return emittedFile.text;
    }
  }

  applyCodeAction(envId: number, action: ts.CodeActionCommand) {
    const env = this.getEnv(envId);
    if (!env) {
      return;
    }
    env.languageService.applyCodeActionCommand(action);
  }

  formatFile(envId: number, filePath: string) {
    const env = this.getEnv(envId);
    if (!env) {
      return undefined;
    }
    return env.languageService.getFormattingEditsForDocument(
      filePath,
      FormatCodeSettings
    );
  }

  /**
   * Get formatting edits for a previous or future state of a document.
   */
  getFormattingEditsForSnapshot(args: {
    envId: number;
    filePath: string;
    fileContents: string;
  }) {
    const {envId, filePath, fileContents} = args;
    const env = this.getEnv(envId);
    if (!env) {
      return undefined;
    }

    const restoreContents = env.getSourceFile(filePath)?.getText();
    try {
      this.updateFile(args.envId, filePath, fileContents);
      const edits = env.languageService.getFormattingEditsForDocument(
        filePath,
        FormatCodeSettings
      );
      return edits;
    } finally {
      this.updateFile(args.envId, filePath, restoreContents);
    }
  }

  formatWithPrettier(fileContents: string, cursorOffset: number) {
    return formatWithCursor(fileContents, {
      cursorOffset,
      parser: 'babel-ts',
      plugins: [babelParser],
      printWidth: 40,
    });
  }
}

const FormatCodeSettings: ts.FormatCodeSettings = {
  semicolons: ts.SemicolonPreference.Insert,
  trimTrailingWhitespace: true,
  indentSize: 2,
  tabSize: 2,
  convertTabsToSpaces: true,
  indentStyle: ts.IndentStyle.Smart,
  insertSpaceAfterCommaDelimiter: true,
  insertSpaceAfterKeywordsInControlFlowStatements: true,
  insertSpaceAfterSemicolonInForStatements: true,
  insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
  insertSpaceBeforeAndAfterBinaryOperators: true,
};

export type {TSServerWorker};

ChannelServer.createAndListen({
  expose: new TSServerWorker(),
  listenPort: globalThis,
  responsePort: {postMessage: wrappedPostMessage},
});
