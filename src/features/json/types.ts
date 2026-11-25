export type Indentation = 2 | 4;

export type JsonStatus = 'idle' | 'valid' | 'invalid';

export interface ParseResult {
  ok: boolean;
  data: unknown;
  error: string | null;
  line: number | null;
  column: number | null;
}

export interface TransformResult {
  ok: boolean;
  output: string;
  error: string | null;
}

export interface EditorState {
  input: string;
  output: string;
  status: JsonStatus;
  message: string;
  indentation: Indentation;
  line: number | null;
  column: number | null;
}
