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
import {DEBUG_EDITOR_RENDER} from './debug';
import {ChannelClient} from './ChannelBridge';
import type {TSServerWorker} from './tsserver.worker';

export function normalizePath(path: string): string;
export function normalizePath(path: undefined): undefined;
export function normalizePath(path: string | undefined) {
  if (path === undefined) {
    return path;
  }
  if (path[0] === '/') {
    return path;
  }
  return `/${path}`;
}

export function normalizePaths(fs: SandpackFiles): SandpackFiles {
  return Object.fromEntries(
    Object.entries(fs).map(([key, value]) => [normalizePath(key), value])
  );
}

export const codemirrorTypescriptExtensions = (
  client: ChannelClient<TSServerWorker>,
  filePath: string | undefined,
  tooltipRef?: HTMLElement | null | undefined
) => {
  DEBUG_EDITOR_RENDER(
    'codemirrorTypescriptExtensions(filePath: "%s")',
    filePath
  );
  const formatCode: Command = (target) => {
    if (!filePath) {
      return false;
    }
    void (async () => {
      const contents = target.state.doc.toJSON().join('\n');
      await client.call('updateFile', normalizePath(filePath), contents);
      const changes = await client.call('formatFile', normalizePath(filePath));
      if (!changes) {
        return;
      }
      target.dispatch({
        changes: getCodemirrorChanges(target.state, changes),
      });
    })();
    return true;
  };

  let previousFileContent: string | undefined;

  return [
    tooltips({
      // Fixed mode doesn't work well if your document scrolls!
      position: 'absolute',
      // TODO: this doesn't seem to work!
      parent: DEBUG_EDITOR_RENDER.tap('tooltipRef', tooltipRef) ?? undefined,
    }),

    EditorView.updateListener.of((update: ViewUpdate) => {
      if (filePath) {
        const newFileContent = update.state.doc.toJSON().join('\n');
        if (newFileContent !== previousFileContent) {
          previousFileContent = newFileContent;
          client.call(
            'updateFile',
            normalizePath(filePath),
            update.state.doc.toJSON().join('\n')
          );
        }
      }
    }),

    autocompletion({
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
                  normalizePath(filePath)
                ));

              if (!completions) {
                console.log('Unable to get completions', {pos});
                return null;
              }

              return completeFromList(
                completions.entries.map((c, i) => {
                  if (c.name === 'useRef') {
                    console.log(`completion ${i}:`, c);
                  }

                  const details = c.details;
                  const description = details?.codeActions?.at(0)?.description;
                  const source =
                    details?.sourceDisplay
                      ?.map((token) => token.text)
                      .join('') || c.sourceDisplayString;
                  const actions = details?.codeActions;

                  const suggestions: Completion = {
                    type: c.kind,
                    label: c.name,
                    detail: source,
                    apply: actions
                      ? (view) => {
                          const codeActionChanges = actions.flatMap((action) =>
                            getCodemirrorFileChanges(
                              view.state,
                              action.changes,
                              filePath
                            )
                          );

                          const apply = c.name;

                          // TODO: this is messed yp
                          // debugger;
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

                          // Copied from here:
                          // https://github.com/codemirror/autocomplete/blob/97bf06555c5028ca9930576fb05e5f809a2d604f/src/completion.ts#L213-L229
                          // But, we don't have the things we need to use it.
                          // const insertLabelChanges = view.state.changeByRange(
                          //   (range) => {
                          //     if (range == view.state.selection.main)
                          //       return {
                          //         changes: {
                          //           from: baseLabelChange.from,
                          //           to: baseLabelChange.to,
                          //           insert: apply,
                          //         },
                          //         range: EditorSelection.cursor(
                          //           baseLabelChange.from + apply.length
                          //         ),
                          //       };
                          //     const len =
                          //       baseLabelChange.to - baseLabelChange.from;
                          //     if (
                          //       !range.empty ||
                          //       (len &&
                          //         view.state.sliceDoc(
                          //           range.from - len,
                          //           range.from
                          //         ) !=
                          //           view.state.sliceDoc(
                          //             baseLabelChange.from,
                          //             baseLabelChange.to
                          //           ))
                          //     )
                          //       return { range };
                          //     return {
                          //       changes: {
                          //         from: range.from - len,
                          //         to: range.from,
                          //         insert: apply,
                          //       },
                          //       range: EditorSelection.cursor(
                          //         range.from - len + apply.length
                          //       ),
                          //     };
                          //   }
                          // );

                          console.log(
                            'change',
                            baseLabelChange,
                            ctx.state.sliceDoc(
                              baseLabelChange.from,
                              baseLabelChange.to
                            )
                          );

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
                    // detail: c.
                    // TODO:: populate details and info
                    boost: 1 / Number(c.sortText),
                  };

                  return suggestions;
                })
              )(ctx);
            } catch (e) {
              console.log('Unable to get completions', {pos, error: e});
              return null;
            }
          }
        ),
      ],
    }),

    hoverTooltip(
      async (_: EditorView, pos: number): Promise<Tooltip | null> => {
        const allInfo = filePath
          ? await client.call('infoAtPosition', pos, normalizePath(filePath))
          : undefined;

        if (!allInfo) {
          return null;
        }

        const {result: quickInfo, tootltipText} = allInfo;

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
    ),

    keymap.of([
      {
        key: 'Cmd-.',
        run: (editor) => openLintPanel(editor) || closeLintPanel(editor),
      },
      {
        key: 'Shift-Alt-f',
        run: formatCode,
      },
      {
        key: 'Mod-s',
        run: formatCode,
      },
    ]),

    linter(
      async (): Promise<Diagnostic[]> => {
        if (!filePath) {
          return [];
        }

        const diagnostics = await client.call(
          'lintSystem',
          normalizePath(filePath)
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

                  const changes = getCodemirrorFileChanges(
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

    EditorView.baseTheme({
      // ".cm-diagnostic-info": {
      //   borderLeft: "5px solid var(--sp-colors-fg-default)",
      // },
      '.quickinfo-monospace': {
        fontFamily: `"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace`,
        fontSize: '87%',
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
};

function getCodemirrorFileChanges(
  state: EditorState,
  changes: ts.FileTextChanges[],
  filePath: string
) {
  return changes.flatMap((fileEdit) => {
    if (fileEdit.fileName !== normalizePath(filePath)) {
      console.warn('Unable to apply changes to other files', fileEdit);
      return [];
    }

    return getCodemirrorChanges(state, fileEdit.textChanges);
  });
}

function getCodemirrorChanges(
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

const BRACKET_TYPE = {
  '(': hl.tags.paren,
  ')': hl.tags.paren,
  '[': hl.tags.squareBracket,
  ']': hl.tags.squareBracket,
  '}': hl.tags.brace,
  '{': hl.tags.brace,
  '<': hl.tags.angleBracket,
  '>': hl.tags.angleBracket,
};

function highlightSymbolDisplayPart(sym: SymbolDisplayPart) {
  if (sym.kind in TS_SYMBOL_TAG_TO_CODEMIRROR_TAG) {
    const kind = sym.kind as keyof typeof TS_SYMBOL_TAG_TO_CODEMIRROR_TAG;

    if (kind === 'punctuation' && sym.text in BRACKET_TYPE) {
      return BRACKET_TYPE[sym.text as keyof typeof BRACKET_TYPE];
    }

    return TS_SYMBOL_TAG_TO_CODEMIRROR_TAG[
      sym.kind as keyof typeof TS_SYMBOL_TAG_TO_CODEMIRROR_TAG
    ];
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
    const tag = highlightSymbolDisplayPart(sym);
    return (
      <CodeMirrorTag state={state} tag={tag} key={i}>
        {sym.text}
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
          className={`cm-tooltip-section quickinfo-documentation  ${
            truncateDisplayParts ? 'quickinfo-truncate quickinfo-small' : ''
          }`}>
          <span className="quickinfo-monospace"></span>
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
