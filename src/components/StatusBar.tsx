import type { JsonStatus } from '../features/json/types';

interface StatusBarProps {
  status: JsonStatus;
  message: string;
  line: number | null;
  column: number | null;
  inputLength: number;
  outputLength: number;
}

export function StatusBar({ status, message, line, column, inputLength, outputLength }: StatusBarProps) {
  const location = line !== null && column !== null ? ` (line ${line}, column ${column})` : '';

  return (
    <footer className={`status status--${status}`} role="status" aria-live="polite">
      <span className={`status__dot status__dot--${status}`} aria-hidden="true" />
      <span className="status__message">
        {message}
        {location}
      </span>
      <span className="status__metrics">
        <span>in: {inputLength}</span>
        <span>out: {outputLength}</span>
      </span>
    </footer>
  );
}
