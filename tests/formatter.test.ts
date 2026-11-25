import { describe, it, expect } from 'vitest';
import { formatJson } from '../src/features/json/formatter';

describe('formatJson', () => {
  it('formats with 2-space indentation by default', () => {
    expect(formatJson('{"a":1,"b":2}').output).toBe('{\n  "a": 1,\n  "b": 2\n}');
  });

  it('uses 4-space indentation when requested', () => {
    expect(formatJson('{"a":1}', 4).output).toBe('{\n    "a": 1\n}');
  });

  it('formats nested objects', () => {
    const out = formatJson('{"a":{"b":{"c":1}}}', 2).output;
    expect(out).toBe('{\n  "a": {\n    "b": {\n      "c": 1\n    }\n  }\n}');
  });

  it('formats arrays', () => {
    expect(formatJson('[1,2,3]', 2).output).toBe('[\n  1,\n  2,\n  3\n]');
  });

  it('preserves string values with spaces', () => {
    expect(formatJson('{"greeting":"hello world"}', 2).output).toContain('"hello world"');
  });

  it('preserves unicode', () => {
    expect(formatJson('{"name":"استوديو"}', 2).output).toContain('استوديو');
  });

  it('preserves escaped characters', () => {
    expect(formatJson('{"line":"a\\nb"}', 2).output).toContain('"a\\nb"');
  });

  it('fails for empty input', () => {
    const r = formatJson('');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/empty/i);
  });

  it('fails for invalid JSON and echoes the input', () => {
    const input = '{ malformed';
    const r = formatJson(input);
    expect(r.ok).toBe(false);
    expect(r.output).toBe(input);
    expect(r.error).toBeTruthy();
  });

  it('formats primitives', () => {
    expect(formatJson('42', 2).output).toBe('42');
    expect(formatJson('true', 2).output).toBe('true');
    expect(formatJson('null', 2).output).toBe('null');
    expect(formatJson('"text"', 2).output).toBe('"text"');
  });

  it('produces re-parseable JSON', () => {
    const out = formatJson('{"a":[1,2,{"b":true}]}', 2).output;
    expect(() => JSON.parse(out)).not.toThrow();
  });

  it('normalises whitespace without changing data', () => {
    const out = formatJson('{\n  "a" : 1 ,\n  "b" :    2\n}', 2).output;
    expect(JSON.parse(out)).toEqual({ a: 1, b: 2 });
  });
});
