import { describe, it, expect, vi } from 'vitest';
import { copyToClipboard, downloadJson } from '../src/utils/download';

describe('copyToClipboard', () => {
  it('returns false for empty input', async () => {
    expect(await copyToClipboard('')).toBe(false);
  });

  it('returns false for non-string input', async () => {
    expect(await copyToClipboard(null as unknown as string)).toBe(false);
  });

  it('uses navigator.clipboard when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const ok = await copyToClipboard('hello');
    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('falls back to execCommand when clipboard throws', async () => {
    Object.defineProperty(document, 'execCommand', {
      value: vi.fn().mockReturnValue(true),
      configurable: true,
      writable: true,
    });
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
      configurable: true,
    });
    const ok = await copyToClipboard('fallback');
    expect(ok).toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});

describe('downloadJson', () => {
  it('does nothing for empty content', () => {
    const spy = vi.spyOn(document, 'createElement');
    downloadJson('');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('creates an anchor, appends it, clicks it, and removes it', () => {
    const createObjectURL = vi.fn().mockReturnValue('blob:mock');
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, configurable: true, writable: true });
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, configurable: true, writable: true });

    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');

    downloadJson('{"a":1}', 'test.json');

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(appendSpy).toHaveBeenCalledOnce();
    expect(removeSpy).toHaveBeenCalledOnce();
    const anchor = appendSpy.mock.calls[0]![0] as HTMLAnchorElement;
    expect(anchor.tagName).toBe('A');
    expect(anchor.download).toBe('test.json');

    appendSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
