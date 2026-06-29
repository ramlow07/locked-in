import { useEffect, useState } from "react";
import type { TimerSettings } from "../../timer/domain/types";

type SettingsPanelProps = {
  isOpen: boolean;
  settings: TimerSettings;
  onClose: () => void;
  onSave: (settings: TimerSettings) => void;
};

export function SettingsPanel({ isOpen, settings, onClose, onSave }: SettingsPanelProps) {
  const [draft, setDraft] = useState(settings);

  useEffect(() => {
    if (isOpen) setDraft(settings);
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const updateNumber = (key: keyof TimerSettings, value: string) => {
    setDraft((current) => ({ ...current, [key]: Number(value) }));
  };

  const updateBoolean = (key: keyof TimerSettings, value: boolean) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  return (
    <aside className="settings-drawer" aria-label="Timer settings">
      <div className="drawer-header">
        <div>
          <p className="eyebrow">Settings</p>
          <h2>Session profile</h2>
        </div>
        <button className="icon-control" aria-label="Close settings" onClick={onClose} type="button">
          x
        </button>
      </div>

      <div className="settings-fields">
        <NumberField label="Focus" value={draft.focusMinutes} onChange={(value) => updateNumber("focusMinutes", value)} />
        <NumberField
          label="Short break"
          value={draft.shortBreakMinutes}
          onChange={(value) => updateNumber("shortBreakMinutes", value)}
        />
        <NumberField
          label="Long break"
          value={draft.longBreakMinutes}
          onChange={(value) => updateNumber("longBreakMinutes", value)}
        />
        <NumberField
          label="Long interval"
          max={12}
          value={draft.longBreakInterval}
          onChange={(value) => updateNumber("longBreakInterval", value)}
        />

        <ToggleField
          checked={draft.notificationsEnabled}
          label="Notifications"
          onChange={(value) => updateBoolean("notificationsEnabled", value)}
        />
        <ToggleField checked={draft.soundEnabled} label="Sound" onChange={(value) => updateBoolean("soundEnabled", value)} />
        <ToggleField
          checked={draft.autoStartNext}
          label="Auto-start next"
          onChange={(value) => updateBoolean("autoStartNext", value)}
        />
      </div>

      <div className="drawer-actions">
        <button className="ghost-control" onClick={onClose} type="button">
          Cancel
        </button>
        <button
          className="primary-control"
          onClick={() => {
            onSave(draft);
            onClose();
          }}
          type="button"
        >
          Save
        </button>
      </div>
    </aside>
  );
}

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: string) => void;
  max?: number;
};

function NumberField({ label, value, onChange, max = 180 }: NumberFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input min="1" max={max} type="number" value={value} onChange={(event) => onChange(event.currentTarget.value)} />
    </label>
  );
}

type ToggleFieldProps = {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
};

function ToggleField({ checked, label, onChange }: ToggleFieldProps) {
  return (
    <label className="toggle-field">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.currentTarget.checked)} />
    </label>
  );
}
