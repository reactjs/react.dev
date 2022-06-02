import {
  autocompletion,
  completeFromList,
  Completion,
  CompletionContext,
  CompletionResult,
  pickedCompletion,
} from '@codemirror/autocomplete';
import * as hl from '@codemirror/highlight';
import {
  closeLintPanel,
  Diagnostic,
  forceLinting,
  linter,
  openLintPanel,
} from '@codemirror/lint';
import {EditorState} from '@codemirror/state';
import {hoverTooltip, Tooltip, tooltips} from '@codemirror/tooltip';
import {Command, EditorView, keymap, ViewUpdate} from '@codemirror/view';
import {SandpackFiles} from '@codesandbox/sandpack-react';
import {ReactElement, ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import type ts from 'typescript';
import {SymbolDisplayPart, SymbolDisplayPartKind} from 'typescript';
import {ChannelClient} from './ChannelBridge';
import {DEBUG_EDITOR_RENDER} from './debug';
import type {TSServerWorker} from './tsserver.worker';

export function codemirrorTypescriptExtensions(
  client: ChannelClient<TSServerWorker>,
  filePath: string | undefined
) {
  DEBUG_EDITOR_RENDER(
    'codemirrorTypescriptExtensions(filePath: "%s")',
    filePath
  );

  return [
    requiredExtensions(client, filePath),
    formatExtension(client, filePath),
    diagnosticExtension(client, filePath),
    autocompleteExtension(client, filePath),
    hoverTooltipExtension(client, filePath),
  ];
}

function requiredExtensions(
  client: ChannelClient<TSServerWorker>,
  filePath: string | undefined
) {
  let previousFileContent: string | undefined;
  return [
    EditorView.updateListener.of((update: ViewUpdate) => {
      if (filePath) {
        const newFileContent = update.state.doc.toJSON().join('\n');
        if (newFileContent !== previousFileContent) {
          previousFileContent = newFileContent;
          client.call(
            'updateFile',
            ensurePathStartsWithSlash(filePath),
            update.state.doc.toJSON().join('\n')
          );
        }
      }
    }),

    // position: absolute allows us to use percent-based max-width, but the tooltip
    // renders *under* the iframe.
    // tooltips({
    //   position: 'absolute',
    // }),

    EditorView.baseTheme({
      '.cm-tooltip': {
        // fighting .sp-code-editor .cm-tooltip here:
        maxWidth: 'min(60ch, 70vw) !important', // set to 200px by Sandpack
        border: '1px solid var(--sp-colors-fg-inactive) !important', // set to light colors always
        padding: '2px',
        borderRadius: '4px',
        background: 'var(--sp-colors-bg-default)',
      },
      '.cm-tooltip-autocomplete ul li[aria-selected]': {
        borderRadius: '2px',
      },
      '.cm-tooltip.cm-completionInfo': {
        margin: '0px 2px',
        maxWidth: '400px !important', // sins of !important :(
      },
      '.quickinfo-monospace': {
        // Respect dark color theme better
        color: 'var(--theme-plain)',
        // TODO: is there a better way to get the mono font stack?
        fontFamily:
          '"Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        // fontSize: '87%',
        // Some types are very long!
        overflowWrap: 'break-word',
      },
      '.quickinfo-truncate': {
        display: '-webkit-box',
        WebkitLineClamp: '1',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      },
      '.quickinfo-small': {
        fontSize: '90%',
      },
      '.cm-diagnostic .quickinfo-documentation:first-child': {
        paddingTop: 0,
      },
      '.quickinfo-documentation:first-child': {
        marginTop: 0,
        paddingTop: '3px',
      },
      '.quickinfo-documentation': {
        marginLeft: '-8px',
        paddingLeft: '8px',
        marginRight: '-6px',
        paddingRight: '6px',
        paddingTop: '6px',
        marginTop: '6px',
      },
      '.quickinfo-tsdoc-tag': {
        margin: '3px 0',
      },
      '.cm-diagnosticAction': {
        backgroundColor: 'transparent',
        padding: 0,
        margin: '4px 0',
        textDecoration: 'underline',
        cursor: 'pointer',
        color: 'inherit',
        display: 'block',
        textAlign: 'left',
      },
    }),
  ];
}

function formatExtension(
  client: ChannelClient<TSServerWorker>,
  filePath: string | undefined
) {
  const formatCode: Command = (target) => {
    if (!filePath) {
      return false;
    }
    void (async () => {
      const contents = target.state.doc.toJSON().join('\n');
      await client.call(
        'updateFile',
        ensurePathStartsWithSlash(filePath),
        contents
      );
      const changes = await client.call(
        'formatFile',
        ensurePathStartsWithSlash(filePath)
      );
      if (!changes) {
        return;
      }
      target.dispatch({
        changes: tsTextChangesToCodemirrorChanges(target.state, changes),
      });
    })();
    return true;
  };
  return [
    keymap.of([
      {
        key: 'Shift-Alt-f',
        run: formatCode,
      },
      {
        key: 'Mod-s',
        run: formatCode,
      },
    ]),
  ];
}

function diagnosticExtension(
  client: ChannelClient<TSServerWorker>,
  filePath: string | undefined
) {
  return [
    keymap.of([
      {
        key: 'Cmd-.',
        run: (editor) => openLintPanel(editor) || closeLintPanel(editor),
      },
    ]),

    linter(
      async (): Promise<Diagnostic[]> => {
        if (!filePath) {
          return [];
        }

        const diagnostics = await client.call(
          'lintSystem',
          ensurePathStartsWithSlash(filePath)
        );

        if (!diagnostics) {
          return [];
        }

        return diagnostics.map<Diagnostic>((diagnostic) => {
          const {serializedActions, ...valid} = diagnostic;
          return {
            ...valid,
            actions: serializedActions.map((action) => {
              let applied = false;
              return {
                name: action.name,
                apply: (editor) => {
                  if (applied) {
                    return;
                  }
                  applied = true;

                  const changes = tsFileTextChangesToCodemirrorChanges(
                    editor.state,
                    action.data.changes,
                    filePath
                  );

                  editor.dispatch({
                    changes,
                  });

                  if (action.data.commands) {
                    client.call('applyCodeAction', action.data.commands);
                  }

                  forceLinting(editor);
                },
              };
            }),
          };
        });
      },
      {delay: 400}
    ),
  ];
}

function autocompleteExtension(
  client: ChannelClient<TSServerWorker>,
  filePath: string | undefined
) {
  return autocompletion({
    activateOnTyping: true,
    override: [
      throttleAsync(
        150,
        async (ctx: CompletionContext): Promise<CompletionResult | null> => {
          const {pos} = ctx;

          try {
            const completions =
              filePath &&
              (await client.call(
                'autocompleteAtPosition',
                pos,
                ensurePathStartsWithSlash(filePath)
              ));

            if (!completions) {
              DEBUG_EDITOR_RENDER('Unable to get completions', {pos});
              return null;
            }

            return completeFromList(
              completions.entries.map((c, i) => {
                const details = c.details;
                const description = details?.codeActions?.at(0)?.description;
                const source =
                  details?.sourceDisplay?.map((token) => token.text).join('') ||
                  c.sourceDisplayString;
                const actions = details?.codeActions;

                const suggestions: Completion = {
                  type: c.kind,
                  label: c.name,
                  detail: source,
                  apply: actions
                    ? (view) => {
                        const codeActionChanges = actions.flatMap((action) =>
                          tsFileTextChangesToCodemirrorChanges(
                            view.state,
                            action.changes,
                            filePath
                          )
                        );

                        const apply = c.name;

                        // TODO: currently we re-implement codemirror/autocomplete's default behavior
                        // because we couldn't have both a custom action and do the default.
                        // Upstream added a helper, but upgrading autocomplete requires a bump in many
                        // codemirror-related packages.
                        // See https://github.com/codemirror/autocomplete/blob/main/CHANGELOG.md#0202-2022-05-24
                        const matchedPrefix =
                          ctx.matchBefore(/\w+/) ??
                          DEBUG_EDITOR_RENDER.tap('fallback', {
                            from: Math.min(
                              ctx.pos,
                              view.state.selection.main.from
                            ),
                            to: view.state.selection.main.to,
                          });
                        const baseLabelChange = {
                          from: matchedPrefix.from,
                          to: view.state.selection.main.to,
                          insert: apply,
                        };

                        view.dispatch({
                          // ...insertLabelChanges,
                          changes: [
                            // insertLabelChanges.changes,
                            baseLabelChange,
                            ...codeActionChanges,
                          ],
                          annotations: pickedCompletion.of(suggestions),
                        });
                      }
                    : undefined,
                  info:
                    details &&
                    function () {
                      const container = document.createElement('div');
                      renderIntoNode(
                        container,

                        <>
                          {description && (
                            <div className="quickinfo-documentation cm-tooltip-section">
                              {description}
                            </div>
                          )}
                          <QuickInfo
                            state={ctx.state}
                            info={details}
                            truncateDisplayParts={true}
                          />
                        </>
                      );
                      return container;
                    },
                  // TODO: double-check ranking makes sense.
                  boost: 1 / Number(c.sortText),
                };

                return suggestions;
              })
            )(ctx);
          } catch (e) {
            DEBUG_EDITOR_RENDER('Unable to get completions', {pos, error: e});
            return null;
          }
        }
      ),
    ],
  });
}

function hoverTooltipExtension(
  client: ChannelClient<TSServerWorker>,
  filePath: string | undefined
) {
  return hoverTooltip(
    async (_: EditorView, pos: number): Promise<Tooltip | null> => {
      const allInfo = filePath
        ? await client.call(
            'infoAtPosition',
            pos,
            ensurePathStartsWithSlash(filePath)
          )
        : undefined;

      if (!allInfo) {
        return null;
      }

      const quickInfo = allInfo.result;

      if (!quickInfo) return null;

      return {
        pos,
        create(view) {
          const dom = document.createElement('div');
          dom.setAttribute('class', 'cm-diagnostic cm-diagnostic-info');
          renderIntoNode(
            dom,
            <QuickInfo state={view.state} info={quickInfo} />
          );
          return {dom};
        },
      };
    },
    {hideOnChange: true}
  );
}

function tsFileTextChangesToCodemirrorChanges(
  state: EditorState,
  changes: ts.FileTextChanges[],
  filePath: string
) {
  return changes.flatMap((fileEdit) => {
    if (fileEdit.fileName !== ensurePathStartsWithSlash(filePath)) {
      console.warn('Unable to apply changes to other files', fileEdit);
      return [];
    }

    return tsTextChangesToCodemirrorChanges(state, fileEdit.textChanges);
  });
}

function tsTextChangesToCodemirrorChanges(
  state: EditorState,
  changes: readonly ts.TextChange[]
) {
  return changes.map((change) => {
    return state.changes({
      from: change.span.start,
      to: change.span.start + change.span.length,
      insert: change.newText,
    });
  });
}

const TS_SYMBOL_TAG_TO_CODEMIRROR_TAG: Record<
  keyof typeof SymbolDisplayPartKind,
  hl.Tag | undefined
> = {
  moduleName: hl.tags.namespace,
  localName: hl.tags.local(hl.tags.name),
  functionName: hl.tags.function(hl.tags.name),
  interfaceName: hl.tags.typeName,
  aliasName: hl.tags.typeName,
  parameterName: hl.tags.propertyName,
  className: hl.tags.typeName,
  enumName: hl.tags.typeName,
  fieldName: hl.tags.propertyName,
  keyword: hl.tags.keyword,
  lineBreak: undefined,
  numericLiteral: hl.tags.number,
  stringLiteral: hl.tags.string,
  methodName: hl.tags.function(hl.tags.name),
  operator: hl.tags.operator,
  propertyName: hl.tags.propertyName,
  punctuation: hl.tags.punctuation,
  space: undefined,
  text: undefined,
  typeParameterName: hl.tags.typeName,
  enumMemberName: hl.tags.propertyName,
  regularExpressionLiteral: hl.tags.regexp,
  link: hl.tags.link,
  linkName: hl.tags.name,
  linkText: hl.tags.link,
};

const BRACKETS = {
  '(': {tag: hl.tags.paren, type: 'open'},
  ')': {tag: hl.tags.paren, type: 'close'},
  '[': {tag: hl.tags.squareBracket, type: 'open'},
  ']': {tag: hl.tags.squareBracket, type: 'close'},
  '{': {tag: hl.tags.brace, type: 'open'},
  '}': {tag: hl.tags.brace, type: 'close'},
  '<': {tag: hl.tags.angleBracket, type: 'open'},
  '>': {tag: hl.tags.angleBracket, type: 'close'},
} as const;

const ZERO_WIDTH_SPACE = '​';

function highlightSymbolDisplayPart(sym: SymbolDisplayPart) {
  if (sym.kind in TS_SYMBOL_TAG_TO_CODEMIRROR_TAG) {
    const kind = sym.kind as keyof typeof TS_SYMBOL_TAG_TO_CODEMIRROR_TAG;

    if (kind === 'punctuation' && sym.text in BRACKETS) {
      return BRACKETS[sym.text as keyof typeof BRACKETS];
    }

    const tag =
      TS_SYMBOL_TAG_TO_CODEMIRROR_TAG[
        sym.kind as keyof typeof TS_SYMBOL_TAG_TO_CODEMIRROR_TAG
      ];

    if (tag) {
      return {tag, type: 'other'} as const;
    }
  }

  console.warn(`Unknown symbol kind: ${sym.kind} (in "${sym.text}")`);
  return undefined;
}

function CodeMirrorTag(props: {
  state: EditorState;
  tag: hl.Tag | undefined;
  children: ReactNode;
}) {
  const {state, tag, children} = props;
  const className = (tag && hl.HighlightStyle.get(state, tag)) ?? undefined;
  if (className) {
    return <span className={className}>{children}</span>;
  }
  return <>{children}</>;
}

function SymbolDisplayParts(props: {
  state: EditorState;
  parts: SymbolDisplayPart[];
}) {
  const {state, parts} = props;
  const items = parts.map<ReactNode>((sym, i) => {
    const symbolInfo = highlightSymbolDisplayPart(sym);
    return (
      <CodeMirrorTag state={state} tag={symbolInfo?.tag} key={i}>
        {/* Add zero width spaces before/after braces to assist in wrapping long symbols. */}
        {symbolInfo?.type === 'close' ? ZERO_WIDTH_SPACE : ''}
        {sym.text}
        {symbolInfo?.type === 'open' ? ZERO_WIDTH_SPACE : ''}
      </CodeMirrorTag>
    );
  });
  return <>{items}</>;
}

function QuickInfo(props: {
  state: EditorState;
  truncateDisplayParts?: boolean;
  info: Omit<ts.QuickInfo, 'textSpan'>;
}) {
  const {state, info, truncateDisplayParts} = props;
  const {displayParts, documentation, tags} = info;

  return (
    <>
      {displayParts && (
        <div
          className={`cm-tooltip-section quickinfo-documentation quickinfo-monospace  ${
            truncateDisplayParts ? 'quickinfo-truncate quickinfo-small' : ''
          }`}>
          <SymbolDisplayParts state={state} parts={displayParts} />
        </div>
      )}
      {(documentation?.length || tags?.length) && (
        <div className="quickinfo-documentation quickinfo-small cm-tooltip-section">
          {documentation && (
            <SymbolDisplayParts state={state} parts={documentation} />
          )}
          {tags?.map((tag, i) => (
            <div className="quickinfo-tsdoc-tag" key={i}>
              <CodeMirrorTag
                state={state}
                tag={hl.tags.definitionKeyword}
                key={i}>
                <span style={{fontWeight: 'bold'}}>@{tag.name}</span>
              </CodeMirrorTag>
              {tag.text && (
                <>
                  : <SymbolDisplayParts state={state} parts={tag.text} />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function renderIntoNode(node: Element, reactNode: ReactElement) {
  // Use renderToStaticMarkup + innerHTML because Codemirror doesn't give us a
  // hook to unmount a React root when the tooltip closes. I'm not sure if that
  // would leak memory.
  const html = renderToStaticMarkup(reactNode);
  node.innerHTML = html;
}

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}

function deferred<T>(): Deferred<T> {
  const deferred: Deferred<T> = {} as any;
  deferred.promise = new Promise<T>((_resolve, _reject) => {
    deferred.resolve = _resolve;
    deferred.reject = _reject;
  });
  return deferred;
}

function throttleAsync<Args extends any[], R>(
  wait: number,
  fn: (...args: Args) => Promise<R>
): (...args: Args) => Promise<R> {
  let timeout: number | undefined;
  let latestArguments: Args;
  let pending: Array<Deferred<R>> = [];

  const startTimeout = () => {
    if (timeout === undefined) {
      timeout = window.setTimeout(performFunctionCall, wait);
    }
  };

  const performFunctionCall = async () => {
    const toResolve = pending;
    pending = [];
    try {
      const result = await fn(...latestArguments);
      toResolve.forEach((p) => p.resolve(result));
    } catch (error) {
      toResolve.forEach((p) => p.reject(error));
    } finally {
      timeout = undefined;
      // Handle calls that were enqueued while we were waiting for our async
      // function.
      if (pending.length) {
        startTimeout();
      }
    }
  };

  return (...args: Args) => {
    latestArguments = args;
    const result = deferred<R>();
    pending.push(result);
    startTimeout();
    return result.promise;
  };
}

export function ensurePathStartsWithSlash(path: string): string;
export function ensurePathStartsWithSlash(path: undefined): undefined;
export function ensurePathStartsWithSlash(path: string | undefined) {
  if (path === undefined) {
    return path;
  }
  if (path[0] === '/') {
    return path;
  }
  return `/${path}`;
}

export function ensureAllPathsStartWithSlash(fs: SandpackFiles): SandpackFiles {
  return Object.fromEntries(
    Object.entries(fs).map(([key, value]) => [
      ensurePathStartsWithSlash(key),
      value,
    ])
  );
}
