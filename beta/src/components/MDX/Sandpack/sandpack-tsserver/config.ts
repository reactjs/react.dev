/**
 * Turn features on and off to change the UX.
 * @todo Inline the policy decisions once we're happy with the UX.
 */
export const CONFIG = {
  showTypes: false,
  showDocTags: false,
  /** Convert @see URLs to beta URLs */
  showBetaDocsLinks: true,
  /** Eg, "this variable is unused, delete it?" */
  showSuggestionDiagnostics: false,
  /**
   * Only show semantic diagnostics related to imports:
   * Many existing examples don't infer types correctly.
   */
  semanticDiagnosticsAllowList: new Set([
    // Module '{0}' has no exported member '{1}'."
    2305,
    // File '{0}' is not a module.
    2306,
    // Cannot find module '{0}' or its corresponding type declarations.
    2307,
  ]),
  /**
   * Show the Typescript diagnostic number when rendering diagnostics.
   * Intended primarily for debugging use.
   */
  showDiagnosticCodeNumber: false,
  /**
   * Show JSON of each completion
   */
  showCompletionDebugDetails: false,
  /** Show random declared globals? Nah. */
  showAmbientDeclareCompletions: false,
} as const;
