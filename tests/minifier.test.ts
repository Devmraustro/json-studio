import { describe, it, expect } from 'vitest';
import { minifyJson } from '../src/features/json/minifier';

describe('minifyJson', () => {
  it('removes indentation from an object', () => {
    expect(minifyJson('{\n  "a": 1,\n  "b": 2\n}').output).toBe('{"a":1,"b":2}');
  });

  it('removes whitespace from an array', () => {
    expect(minifyJson('[\n  1,\n  2,\n  3\n]').output).toBe('[1,2,3]');
  });

  it('minifies nested structures', () => {
    expect(minifyJson('{\n  "a": {\n    "b": [\n      1,\n      2\n    ]\n  }\n}').output).toBe('{"a":{"b":[1,2]}}');
  });

  it('preserves string contents with internal spaces', () => {
    expect(minifyJson('{\n  "greeting": "hello world"\n}').output).toBe('{"greeting":"hello world"}');
  });

  it('preserves unicode', () => {
    expect(minifyJson('{\n  "name": "استوديو"\n}').output).toContain('استوديو');
  });

  it('preserves escaped characters', () => {
    expect(minifyJson('{\n  "line": "a\\nb"\n}').output).toBe('{"line":"a\\nb"}');
  });

  it('fails for empty input', () => {
    expect(minifyJson('').ok).toBe(false);
  });

  it('fails for invalid JSON and echoes the input', () => {
    const input = '{ malformed';
    const r = minifyJson(input);
    expect(r.ok).toBe(false);
    expect(r.output).toBe(input);
  });

  it('keeps already-minified JSON minified', () => {
    expect(minifyJson('{"a":1,"b":2}').output).toBe('{"a":1,"b":2}');
  });

  it('minifies primitives', () => {
    expect(minifyJson('42').output).toBe('42');
    expect(minifyJson('true').output).toBe('true');
    expect(minifyJson('null').output).toBe('null');
  });

  it('produces re-parseable JSON', () => {
    const out = minifyJson('{\n  "a": [\n    1,\n    2\n  ]\n}').output;
    expect(() => JSON.parse(out)).not.toThrow();
  });
});
