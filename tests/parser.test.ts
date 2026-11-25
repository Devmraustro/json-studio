import { describe, it, expect } from 'vitest';
import { parseJson, isValidJson } from '../src/features/json/parser';

describe('parseJson', () => {
  it('parses a valid object', () => {
    const r = parseJson('{"name":"JSON Studio"}');
    expect(r.ok).toBe(true);
    expect(r.data).toEqual({ name: 'JSON Studio' });
    expect(r.error).toBeNull();
  });

  it('parses a valid array', () => {
    expect(parseJson('[1, 2, 3]').data).toEqual([1, 2, 3]);
  });

  it('parses a string primitive', () => {
    expect(parseJson('"hello world"').data).toBe('hello world');
  });

  it('parses a number primitive', () => {
    expect(parseJson('42.5').data).toBe(42.5);
  });

  it('parses boolean primitives', () => {
    expect(parseJson('true').data).toBe(true);
    expect(parseJson('false').data).toBe(false);
  });

  it('parses null', () => {
    const r = parseJson('null');
    expect(r.ok).toBe(true);
    expect(r.data).toBeNull();
  });

  it('rejects empty input', () => {
    expect(parseJson('').ok).toBe(false);
  });

  it('rejects whitespace-only input', () => {
    const r = parseJson('   \n\t  ');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/empty/i);
  });

  it('rejects a trailing comma', () => {
    expect(parseJson('{"a": 1, "b": 2,}').ok).toBe(false);
  });

  it('rejects single-quoted strings', () => {
    expect(parseJson("{'key': 'value'}").ok).toBe(false);
  });

  it('rejects comments', () => {
    expect(parseJson('{ /* comment */ "a": 1 }').ok).toBe(false);
  });

  it('rejects unquoted keys', () => {
    expect(parseJson('{ key: "value" }').ok).toBe(false);
  });

  it('parses deeply nested objects', () => {
    const r = parseJson('{"a":{"b":{"c":{"d":{"e":1}}}}}');
    expect(r.data).toEqual({ a: { b: { c: { d: { e: 1 } } } } });
  });

  it('preserves unicode', () => {
    const r = parseJson('{"name":"JSON استوديو","emoji":"✨"}');
    expect((r.data as { name: string }).name).toBe('JSON استوديو');
  });

  it('preserves escaped characters', () => {
    const r = parseJson('{"line":"a\\nb\\tc"}');
    expect((r.data as { line: string }).line).toBe('a\nb\tc');
  });

  it('tolerates surrounding whitespace', () => {
    expect(parseJson('\n  {"a": 1}  \n').ok).toBe(true);
  });

  it('returns an error message on invalid input', () => {
    const r = parseJson('{ malformed');
    expect(r.ok).toBe(false);
    expect(typeof r.error).toBe('string');
    expect(r.error!.length).toBeGreaterThan(0);
  });

  it('does not throw on non-string input', () => {
    const r = parseJson(null as unknown as string);
    expect(r.ok).toBe(false);
  });
});

describe('isValidJson', () => {
  it('returns true for valid JSON', () => {
    expect(isValidJson('{"a":1}')).toBe(true);
  });

  it('returns false for invalid JSON', () => {
    expect(isValidJson('{')).toBe(false);
  });
});
