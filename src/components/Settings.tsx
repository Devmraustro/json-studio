import type { Indentation } from '../features/json/types';

interface SettingsProps {
  indentation: Indentation;
  onIndentationChange: (value: Indentation) => void;
}

export function Settings({ indentation, onIndentationChange }: SettingsProps) {
  return (
    <div className="settings" role="group" aria-label="Editor settings">
      <span className="settings__label">Indentation</span>
      <div className="settings__segmented" role="radiogroup" aria-label="Indentation width">
        {[2, 4].map((value) => {
          const active = value === indentation;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              className={`settings__option${active ? ' settings__option--active' : ''}`}
              onClick={() => onIndentationChange(value as Indentation)}
            >
              {value} spaces
            </button>
          );
        })}
      </div>
    </div>
  );
}
