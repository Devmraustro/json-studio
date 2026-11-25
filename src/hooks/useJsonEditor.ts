import { useCallback, useMemo, useState } from 'react';
import type { EditorState, Indentation, TransformResult } from '../features/json/types';
import { parseJson } from '../features/json/parser';
import { formatJson } from '../features/json/formatter';
import { minifyJson } from '../features/json/minifier';

export const SAMPLE_JSON = `{"name":"JSON Studio","version":"1.0.0","features":["format","validate","minify"],"author":{"name":"Mr Austro","role":"Open-source developer"},"stats":{"stars":0,"openSource":true},"tags":["developer-tools","json","react"]}`;

const INITIAL: EditorState = {
  input: '',
  output: '',
  status: 'idle',
  message: 'Paste JSON to begin.',
  indentation: 2,
  line: null,
  column: null,
};

export interface UseJsonEditor {
  state: EditorState;
  setInput: (input: string) => void;
  setIndentation: (indentation: Indentation) => void;
  format: () => void;
  minify: () => void;
  validate: () => void;
  loadSample: () => void;
  clear: () => void;
  reset: () => void;
}

function apply(prev: EditorState, result: TransformResult, successMsg: string): EditorState {
  if (result.ok) {
    return {
      ...prev,
      output: result.output,
      status: 'valid',
      message: successMsg,
      line: null,
      column: null,
    };
  }
  const parsed = parseJson(prev.input);
  return {
    ...prev,
    output: prev.input,
    status: 'invalid',
    message: result.error ?? 'Invalid JSON.',
    line: parsed.line,
    column: parsed.column,
  };
}

export function useJsonEditor(): UseJsonEditor {
  const [state, setState] = useState<EditorState>(INITIAL);

  const setInput = useCallback((input: string) => {
    setState((prev) => ({
      ...prev,
      input,
      status: 'idle',
      message: 'Click Format, Minify, or Validate to process.',
      line: null,
      column: null,
    }));
  }, []);

  const setIndentation = useCallback((indentation: Indentation) => {
    setState((prev) => ({ ...prev, indentation }));
  }, []);

  const format = useCallback(() => {
    setState((prev) => apply(prev, formatJson(prev.input, prev.indentation), 'Formatted successfully.'));
  }, []);

  const minify = useCallback(() => {
    setState((prev) => apply(prev, minifyJson(prev.input), 'Minified successfully.'));
  }, []);

  const validate = useCallback(() => {
    setState((prev) => {
      const parsed = parseJson(prev.input);
      if (parsed.ok) {
        return { ...prev, output: prev.input, status: 'valid', message: 'Valid JSON.', line: null, column: null };
      }
      return {
        ...prev,
        output: prev.input,
        status: 'invalid',
        message: parsed.error ?? 'Invalid JSON.',
        line: parsed.line,
        column: parsed.column,
      };
    });
  }, []);

  const loadSample = useCallback(() => {
    setState((prev) => ({
      ...prev,
      input: SAMPLE_JSON,
      output: '',
      status: 'idle',
      message: 'Sample loaded. Click Format to pretty-print.',
      line: null,
      column: null,
    }));
  }, []);

  const clear = useCallback(() => {
    setState((prev) => ({
      ...prev,
      input: '',
      output: '',
      status: 'idle',
      message: 'Editor cleared.',
      line: null,
      column: null,
    }));
  }, []);

  const reset = useCallback(() => setState(INITIAL), []);

  return useMemo(
    () => ({ state, setInput, setIndentation, format, minify, validate, loadSample, clear, reset }),
    [state, setInput, setIndentation, format, minify, validate, loadSample, clear, reset],
  );
}
