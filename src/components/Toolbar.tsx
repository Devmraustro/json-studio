interface ToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onValidate: () => void;
  onLoadSample: () => void;
  onClear: () => void;
  disabled: boolean;
}

export function Toolbar({
  onFormat,
  onMinify,
  onValidate,
  onLoadSample,
  onClear,
  disabled,
}: ToolbarProps) {
  return (
    <nav className="toolbar" aria-label="JSON actions">
      <button type="button" className="toolbar__btn toolbar__btn--primary" onClick={onFormat} disabled={disabled}>
        Format
      </button>
      <button type="button" className="toolbar__btn" onClick={onMinify} disabled={disabled}>
        Minify
      </button>
      <button type="button" className="toolbar__btn" onClick={onValidate} disabled={disabled}>
        Validate
      </button>

      <span className="toolbar__divider" aria-hidden="true" />

      <button type="button" className="toolbar__btn toolbar__btn--ghost" onClick={onLoadSample}>
        Sample
      </button>
      <button type="button" className="toolbar__btn toolbar__btn--ghost" onClick={onClear} disabled={disabled}>
        Clear
      </button>
    </nav>
  );
}
