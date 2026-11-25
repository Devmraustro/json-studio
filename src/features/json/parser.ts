import type { ParseResult } from './types';

const LOC_MODERN = /\(line (?<line>\d+) column (?<column>\d+)\)/;
const LOC_LEGACY = /position (?<pos>\d+)(?: \(line (?<line>\d+) column (?<column>\d+)\))?/;

function fail(error: string): ParseResult {
  return { ok: false, data: null, error, line: null, column: null };
}

export function parseJson(raw: string): ParseResult {
  if (typeof raw !== 'string') {
    return fail('Input must be a string.');
  }

  const trimmed = raw.trim();
  if (trimmed === '') {
    return fail('Input is empty. Paste JSON to validate.');
  }

  try {
    return { ok: true, data: JSON.parse(trimmed), error: null, line: null, column: null };
  } catch (err) {
    if (!(err instanceof SyntaxError)) {
      return fail('Unexpected error while parsing JSON.');
    }
    return locate(err.message || 'Invalid JSON.', trimmed);
  }
}

function locate(message: string, input: string): ParseResult {
  let line: number | null = null;
  let column: number | null = null;

  const modern = LOC_MODERN.exec(message);
  if (modern?.groups) {
    line = Number(modern.groups.line) || null;
    column = Number(modern.groups.column) || null;
  } else {
    const legacy = LOC_LEGACY.exec(message);
    if (legacy?.groups) {
      if (legacy.groups.line && legacy.groups.column) {
        line = Number(legacy.groups.line) || null;
        column = Number(legacy.groups.column) || null;
      } else if (legacy.groups.pos) {
        const pos = Number(legacy.groups.pos);
        const computed = lineColumn(input, pos);
        line = computed.line;
        column = computed.column;
      }
    }
  }

  return { ok: false, data: null, error: message, line, column };
}

function lineColumn(input: string, offset: number) {
  let line = 1;
  let column = 1;
  const end = Math.min(offset, input.length);
  for (let i = 0; i < end; i += 1) {
    if (input[i] === '\n') {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { line, column };
}

export function isValidJson(raw: string): boolean {
  return parseJson(raw).ok;
}
