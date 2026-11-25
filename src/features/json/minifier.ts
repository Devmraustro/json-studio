import type { TransformResult } from './types';
import { parseJson } from './parser';

export function minifyJson(raw: string): TransformResult {
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
    return { ok: true, output: JSON.stringify(parsed.data), error: null };
  } catch {
    return { ok: false, output: raw, error: 'Failed to minify JSON.' };
  }
}
