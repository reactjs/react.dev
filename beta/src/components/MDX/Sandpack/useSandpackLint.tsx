/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

// @ts-nocheck

import {useState} from 'react';
import {linter} from '@codemirror/lint';
import type {EditorView} from '@codemirror/view';

export type LintDiagnostic = {
  line: number;
  column: number;
  severity: 'warning' | 'error';
  message: string;
}[];

export const useSandpackLint = () => {
  const [lintErrors, setLintErrors] = useState<LintDiagnostic>([]);

  // TODO: ideally @codemirror/linter would be code-split too but I don't know how
  // because Sandpack seems to ignore updates to the "extensions" prop.
  const onLint = linter(async (props: EditorView) => {
    const {runESLint} = await import('./runESLint');
    const editorState = props.state.doc;
    let {errors, codeMirrorErrors} = runESLint(editorState);
    // Ignore parsing or internal linter errors.
    const isReactRuleError = (error: any) => error.ruleId != null;
    setLintErrors(errors.filter(isReactRuleError));
    return codeMirrorErrors.filter(isReactRuleError);
  });

  return {lintErrors, lintExtensions: [onLint]};
};
