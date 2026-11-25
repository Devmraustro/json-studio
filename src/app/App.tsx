import { Toolbar } from '../components/Toolbar';
import { Editor } from '../components/Editor';
import { StatusBar } from '../components/StatusBar';
import { Settings } from '../components/Settings';
import { useJsonEditor } from '../hooks/useJsonEditor';

export function App() {
  const editor = useJsonEditor();
  const disabled = editor.state.input.trim() === '';

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo" aria-hidden="true">{ }</span>
          <div>
            <h1 className="app__title">JSON Studio</h1>
            <p className="app__subtitle">A lightweight, privacy-focused JSON toolkit for developers.</p>
          </div>
        </div>
        <a
          className="app__repo"
          href="https://github.com/Devmraustro/json-studio"
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub
        </a>
      </header>

      <main className="app__main">
        <div className="app__controls">
          <Toolbar
            onFormat={editor.format}
            onMinify={editor.minify}
            onValidate={editor.validate}
            onLoadSample={editor.loadSample}
            onClear={editor.clear}
            disabled={disabled}
          />
          <Settings
            indentation={editor.state.indentation}
            onIndentationChange={editor.setIndentation}
          />
        </div>

        <Editor
          input={editor.state.input}
          output={editor.state.output}
          status={editor.state.status}
          indentation={editor.state.indentation}
          onInputChange={editor.setInput}
        />

        <StatusBar
          status={editor.state.status}
          message={editor.state.message}
          line={editor.state.line}
          column={editor.state.column}
          inputLength={editor.state.input.length}
          outputLength={editor.state.output.length}
        />
      </main>

      <footer className="app__footer">
        <span>Client-side only — your data never leaves the browser.</span>
        <span>MIT License · v1.0.0</span>
      </footer>
    </div>
  );
}
