/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

// @ts-nocheck

import {useState, useEffect} from 'react';
import {linter} from '@codemirror/lint';
import type {Diagnostic} from '@codemirror/lint';
import type {Text} from '@codemirror/text';
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
    let {errors, codeMirrorPayload} = runESLint(editorState);
    // Only show errors from rules, not parsing errors etc
    setLintErrors(errors.filter((e) => !e.fatal));
    return codeMirrorPayload;
  });

  return {lintErrors, lintExtensions: [onLint]};
};
