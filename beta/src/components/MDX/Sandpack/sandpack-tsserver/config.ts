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
} as const;
