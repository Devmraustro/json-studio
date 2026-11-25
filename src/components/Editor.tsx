import { useEffect, useRef, useState } from 'react';
import type { JsonStatus } from '../features/json/types';
import { copyToClipboard, downloadJson } from '../utils/download';

interface EditorProps {
  input: string;
  output: string;
  status: JsonStatus;
  indentation: 2 | 4;
  onInputChange: (value: string) => void;
}

export function Editor({ input, output, status, onInputChange }: EditorProps) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(t);
  }, [copied]);

  const handleCopy = async () => {
    if (await copyToClipboard(output)) setCopied(true);
  };

  const handleDownload = () => {
    downloadJson(output || input, 'json-studio-output.json');
  };

  const inputClass = `editor__pane editor__pane--input${
    status === 'invalid' ? ' editor__pane--invalid' : ''
  }${status === 'valid' ? ' editor__pane--valid' : ''}`;

  return (
    <section className="editor" aria-label="JSON editor">
      <div className="editor__column">
        <div className="editor__header">
          <label htmlFor="json-input" className="editor__label">Input</label>
          <span className="editor__hint">Paste JSON here</span>
        </div>
        <textarea
          id="json-input"
          className={inputClass}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder='{"hello": "world"}'
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label="JSON input"
        />
      </div>

      <div className="editor__column">
        <div className="editor__header">
          <label htmlFor="json-output" className="editor__label">Output</label>
          <div className="editor__actions">
            <button
              type="button"
              className="editor__action"
              onClick={handleCopy}
              disabled={!output}
              aria-label={copied ? 'Output copied to clipboard' : 'Copy output to clipboard'}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              className="editor__action editor__action--primary"
              onClick={handleDownload}
              disabled={!output && !input}
              aria-label="Download output as JSON file"
            >
              Download
            </button>
          </div>
        </div>
        <textarea
          id="json-output"
          ref={ref}
          className="editor__pane editor__pane--output"
          value={output}
          readOnly
          placeholder="Formatted JSON will appear here."
          spellCheck={false}
          aria-label="JSON output"
        />
      </div>
    </section>
  );
}
