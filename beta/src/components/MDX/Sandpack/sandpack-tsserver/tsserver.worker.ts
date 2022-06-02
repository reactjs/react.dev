import type {VirtualTypeScriptEnvironment} from '@typescript/vfs';
import type {CompilerOptions} from 'typescript';
import {DEBUG_EDITOR_WORKER} from './debug';
import {ChannelServer} from './ChannelBridge';
import TS from 'typescript';

declare const importScripts: (url: string) => void;
importScripts('https://unpkg.com/@typescript/vfs@1.3.5/dist/vfs.globals.js');
importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/typescript/4.4.3/typescript.min.js'
);

type TS = typeof import('typescript');
export type VFS = typeof import('@typescript/vfs');
export type Diagnostic = import('@codemirror/lint').Diagnostic;

interface SerializedAction {
  name: string;
  data: TS.CodeFixAction;
}

export interface SerializedDiagnostic extends Diagnostic {
  serializedActions: SerializedAction[];
}

const getGlobalImport = <Type>(key: string): Type => (globalThis as any)[key];
const {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} = getGlobalImport<VFS>('tsvfs');
const ts = getGlobalImport<TS>('ts');

// TODO: can we remove this?
// globalThis.localStorage = globalThis.localStorage ?? ({} as Storage);

const BUCKET_URL = 'https://prod-packager-packages.codesandbox.io/v1/typings';
const TYPES_REGISTRY = 'https://unpkg.com/types-registry@latest/index.json';

const wrappedPostMessage = DEBUG_EDITOR_WORKER.wrap('tx', postMessage);

/**
 * Fetch dependencies types from CodeSandbox CDN
 */
const fetchTypesFromCodeSandboxBucket = async ({
  name,
  version,
}: {
  name: string;
  version: string;
}): Promise<Record<string, {module: {code: string}}>> => {
  try {
    const url = `${BUCKET_URL}/${name}/${version}.json`;
    const {files} = await fetch(url).then((data) => data.json());
    DEBUG_EDITOR_WORKER('fetched types', name, version, files);

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
const getCompileOptions = DEBUG_EDITOR_WORKER.wrap(
  'getCompilerOptions',
  (tsconfigFile: Record<string, any>): CompilerOptions => {
    const defaultValue: CompilerOptions = {
      target: ts.ScriptTarget.ES2021,
      module: ts.ModuleKind.ES2020,
      lib: ['es2021', 'es2020', 'dom', 'webworker'],
      esModuleInterop: true,
      allowJs: true,
      checkJs: true,
      jsx: TS.JsxEmit.ReactJSXDev,
    };

    if (tsconfigFile.compilerOptions) {
      const blankSystem = createSystem(new Map());
      return ts.parseJsonConfigFileContent(tsconfigFile, blankSystem, '/')
        .options;
    }

    return defaultValue;
  }
);

const processTypescriptCacheFromStorage = (
  fsMapCached: Map<string, string>
): Map<string, string> => {
  const cache = new Map();
  const matchVersion = Array.from(fsMapCached.keys()).every((file) =>
    file.startsWith(`ts-lib-${ts.version}`)
  );

  if (!matchVersion) cache;

  fsMapCached.forEach((value, key) => {
    const cleanLibName = key.replace(`ts-lib-${ts.version}-`, '');
    cache.set(cleanLibName, value);
  });

  return cache;
};

const isValidTypeModule = (key: string, value?: {module: {code: string}}) =>
  key.endsWith('.d.ts') ||
  (key.endsWith('/package.json') && value?.module?.code);

class TSServerWorker {
  env: VirtualTypeScriptEnvironment | undefined;

  createTsSystem = async (
    files: Record<string, {code: string}>,
    entry: string,
    fsMapCached: Map<string, string>
  ) => {
    const tsFiles = new Map();
    const allFiles = new Map();
    const rootPaths = [];
    type PackageName = string;
    type Version = string;
    const dependenciesMap = new Map<PackageName, Version>();
    let tsconfig = null;
    let packageJson = null;
    let typeRegistryFetchPromise: Promise<Record<string, {latest: string}>>;

    /**
     * Collect files
     */
    for (const filePath in files) {
      const content = files[filePath].code;
      allFiles.set(filePath, content);
      DEBUG_EDITOR_WORKER('file', filePath, content);
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
    let fsMap = processTypescriptCacheFromStorage(fsMapCached);
    if (fsMap.size === 0) {
      fsMap = await createDefaultMapFromCDN(
        compilerOpts,
        ts.version,
        false,
        ts
      );
    }

    /**
     * Post CDN payload to cache in the browser storage
     */
    wrappedPostMessage({
      event: 'cache-typescript-fsmap',
      details: {fsMap, version: ts.version},
    });

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
     * Fetch dependencies types
     */
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
          Object.entries(files).forEach(([key, value]) => {
            if (isValidTypeModule(key, value)) {
              fsMap.set(`/node_modules${key}`, value.module.code);
            }
          });

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

          Object.entries(atTypeFiles).forEach(([key, value]) => {
            if (isValidTypeModule(key, value)) {
              fsMap.set(`/node_modules${key}`, value.module.code);
            }
          });
        }
      })
    );

    const system = createSystem(fsMap);

    this.env = createVirtualTypeScriptEnvironment(
      system,
      rootPaths,
      ts,
      compilerOpts
    );

    try {
      return this.lintSystem(entry);
    } catch (error) {
      // Not ready?
      console.error('todo', error);
    }
  };

  lintSystem = (filePath: string) => {
    const env = this.env;
    if (!env) return;

    const SyntacticDiagnostics =
      env.languageService.getSyntacticDiagnostics(filePath);
    const SemanticDiagnostic =
      env.languageService.getSemanticDiagnostics(filePath);
    const SuggestionDiagnostics =
      env.languageService.getSuggestionDiagnostics(filePath);
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
        acc.push({
          from,
          to,
          message,
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

  infoAtPosition = (pos: number, filePath: string) => {
    const result = this.env?.languageService.getQuickInfoAtPosition(
      filePath,
      pos
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

  autocompleteAtPosition = (pos: number, filePath: string) => {
    const completions = this.env?.languageService.getCompletionsAtPosition(
      filePath,
      pos,
      {
        includeCompletionsForImportStatements: true,
        includeCompletionsWithInsertText: true,
        includeCompletionsForModuleExports: true,
        includeAutomaticOptionalChainCompletions: true,
        includePackageJsonAutoImports: 'auto',
      }
    );

    if (!completions) {
      return;
    }

    return {
      ...completions,
      entries: completions.entries.map((entry) => ({
        ...entry,
        sourceDisplayString: ts.displayPartsToString(entry.sourceDisplay),
        details:
          entry.data &&
          this.env?.languageService.getCompletionEntryDetails(
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

  updateFile = (filePath: string, content: string) => {
    try {
      this.env?.updateFile(filePath, content);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Did not find a source file')
      ) {
        this.env?.createFile(filePath, content);
      } else {
        throw error;
      }
    }
  };

  applyCodeAction(action: TS.CodeActionCommand) {
    const env = this.env;
    if (!env) {
      return;
    }

    env.languageService.applyCodeActionCommand(action);
  }

  formatFile(filePath: string) {
    return this.env?.languageService.getFormattingEditsForDocument(
      filePath,
      FormatCodeSettings
    );
  }
}

const FormatCodeSettings: TS.FormatCodeSettings = {
  semicolons: TS.SemicolonPreference.Insert,
  trimTrailingWhitespace: true,
  indentSize: 2,
  tabSize: 2,
  convertTabsToSpaces: true,
  indentStyle: TS.IndentStyle.Smart,
  insertSpaceAfterCommaDelimiter: true,
  insertSpaceAfterKeywordsInControlFlowStatements: true,
  insertSpaceAfterSemicolonInForStatements: true,
  insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
  insertSpaceBeforeAndAfterBinaryOperators: true,
};

export type {TSServerWorker};

ChannelServer.create({
  expose: new TSServerWorker(),
  listenPort: globalThis,
  responsePort: {postMessage: wrappedPostMessage},
});
