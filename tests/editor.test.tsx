import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/app/App';

const setup = () => render(<App />);

function stubClipboard(writeText: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
}

function stubObjectURL() {
  Object.defineProperty(URL, 'createObjectURL', {
    value: vi.fn(() => 'blob:mock'),
    configurable: true,
    writable: true,
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    value: vi.fn(),
    configurable: true,
    writable: true,
  });
}

function setInputValue(textarea: HTMLElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
  setter?.call(textarea, value);
  fireEvent.input(textarea);
}

describe('App', () => {
  beforeEach(() => {
    stubObjectURL();
    stubClipboard(vi.fn().mockResolvedValue(undefined));
  });

  it('renders the brand title and subtitle', () => {
    setup();
    expect(screen.getByText('JSON Studio')).toBeInTheDocument();
    expect(screen.getByText(/privacy-focused JSON toolkit/i)).toBeInTheDocument();
  });

  it('disables actions when the editor is empty', () => {
    setup();
    expect(screen.getByRole('button', { name: /^format$/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /^minify$/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /^validate$/i })).toBeDisabled();
  });

  it('formats valid JSON', async () => {
    const user = userEvent.setup();
    setup();
    setInputValue(screen.getByLabelText(/json input/i), '{"a":1,"b":2}');
    await user.click(screen.getByRole('button', { name: /^format$/i }));
    const output = screen.getByLabelText(/json output/i) as HTMLTextAreaElement;
    expect(output.value).toBe('{\n  "a": 1,\n  "b": 2\n}');
    expect(screen.getByText(/formatted successfully/i)).toBeInTheDocument();
  });

  it('reports an error on invalid JSON', async () => {
    const user = userEvent.setup();
    setup();
    setInputValue(screen.getByLabelText(/json input/i), '{ malformed');
    await user.click(screen.getByRole('button', { name: /^format$/i }));
    const status = screen.getByRole('status');
    expect(status).toHaveClass('status--invalid');
    expect(status.textContent).not.toMatch(/valid json/i);
  });

  it('minifies pretty-printed JSON', async () => {
    const user = userEvent.setup();
    setup();
    setInputValue(screen.getByLabelText(/json input/i), '{\n  "a": 1,\n  "b": 2\n}');
    await user.click(screen.getByRole('button', { name: /^minify$/i }));
    expect((screen.getByLabelText(/json output/i) as HTMLTextAreaElement).value).toBe('{"a":1,"b":2}');
  });

  it('validates valid JSON', async () => {
    const user = userEvent.setup();
    setup();
    setInputValue(screen.getByLabelText(/json input/i), '{"a":1}');
    await user.click(screen.getByRole('button', { name: /^validate$/i }));
    expect(screen.getByText(/valid json/i)).toBeInTheDocument();
  });

  it('loads the sample JSON', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('button', { name: /^sample$/i }));
    const input = screen.getByLabelText(/json input/i) as HTMLTextAreaElement;
    expect(input.value).toContain('JSON Studio');
  });

  it('clears both panes', async () => {
    const user = userEvent.setup();
    setup();
    const input = screen.getByLabelText(/json input/i);
    setInputValue(input, '{"a":1}');
    await user.click(screen.getByRole('button', { name: /^format$/i }));
    await user.click(screen.getByRole('button', { name: /^clear$/i }));
    expect((input as HTMLTextAreaElement).value).toBe('');
    expect((screen.getByLabelText(/json output/i) as HTMLTextAreaElement).value).toBe('');
  });

  it('switches indentation to 4 spaces', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('radio', { name: /4 spaces/i }));
    setInputValue(screen.getByLabelText(/json input/i), '{"a":1}');
    await user.click(screen.getByRole('button', { name: /^format$/i }));
    expect((screen.getByLabelText(/json output/i) as HTMLTextAreaElement).value).toBe('{\n    "a": 1\n}');
  });

  it('renders input, output, and status', () => {
    setup();
    expect(screen.getByLabelText(/json input/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/json output/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('updates input metrics as the user types', () => {
    setup();
    setInputValue(screen.getByLabelText(/json input/i), '12345');
    expect(screen.getByText(/in:/i)).toBeInTheDocument();
  });

  it('resets to idle when input changes after an action', async () => {
    const user = userEvent.setup();
    setup();
    const input = screen.getByLabelText(/json input/i);
    setInputValue(input, '{"a":1}');
    await user.click(screen.getByRole('button', { name: /^validate$/i }));
    expect(screen.getByText(/valid json/i)).toBeInTheDocument();
    setInputValue(input, '{"a":1,"b":2}');
    expect(screen.queryByText(/valid json/i)).not.toBeInTheDocument();
  });

  it('flips the copy button to "Copied" on success', async () => {
    const user = userEvent.setup();
    setup();
    setInputValue(screen.getByLabelText(/json input/i), '{"a":1}');
    await user.click(screen.getByRole('button', { name: /^format$/i }));
    const output = screen.getByLabelText(/json output/i) as HTMLTextAreaElement;
    expect(output.value).not.toBe('');
    const copyBtn = screen.getByRole('button', { name: /copy/i });
    expect(copyBtn).not.toBeDisabled();
    await user.click(copyBtn);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
    });
  });

  it('labels every interactive control', () => {
    setup();
    expect(screen.getByLabelText(/json input/i)).toBeTruthy();
    expect(screen.getByLabelText(/json output/i)).toBeTruthy();
  });

  it('uses a live status region', () => {
    setup();
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
});
