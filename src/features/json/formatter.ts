import type { Indentation, TransformResult } from './types';
import { parseJson } from './parser';

export function formatJson(raw: string, indentation: Indentation = 2): TransformResult {
  if (typeof raw !== 'string') {
    return { ok: false, output: '', error: 'Input must be a string.' };
  }

  if (raw.trim() === '') {
    return { ok: false, output: raw, error: 'Input is empty.' };
  }

  const parsed = parseJson(raw);
  if (!parsed.ok) {
    return { ok: false, output: raw, error: parsed.error ?? 'Invalid JSON.' };
  }

  try {
    return { ok: true, output: JSON.stringify(parsed.data, null, indentation), error: null };
  } catch {
    return { ok: false, output: raw, error: 'Failed to format JSON.' };
  }
}
