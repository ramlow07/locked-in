import { useEffect, useId, useRef, useState } from "react";
import type { TimerSettings } from "../../timer/domain/types";

type SettingsPanelProps = {
  isOpen: boolean;
  settings: TimerSettings;
  onClose: () => void;
  onSave: (settings: TimerSettings) => void;
};

export function SettingsPanel({ isOpen, settings, onClose, onSave }: SettingsPanelProps) {
  const [draft, setDraft] = useState(settings);
  const dialogRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  onCloseRef.current = onClose;

  useEffect(() => {
    if (isOpen) setDraft(settings);
  }, [isOpen, settings]);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const getFocusableElements = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled)") ?? []);

    getFocusableElements()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        dialog?.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const updateNumber = (
    key: "focusMinutes" | "shortBreakMinutes" | "longBreakMinutes" | "longBreakInterval",
    value: number,
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updateBoolean = (key: keyof TimerSettings, value: boolean) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="settings-layer">
      <button className="settings-backdrop" aria-label="Close settings" onClick={onClose} type="button" />
      <aside
        className="settings-drawer"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Settings</p>
            <h2 id={titleId}>Session profile</h2>
          </div>
          <button className="icon-control drawer-close" aria-label="Close settings" onClick={onClose} type="button">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path d="m6.75 6.75 10.5 10.5m0-10.5-10.5 10.5" />
            </svg>
          </button>
        </div>

        <div className="settings-fields">
          <NumberField
            label="Focus"
            unit="min"
            value={draft.focusMinutes}
            onChange={(value) => updateNumber("focusMinutes", value)}
          />
          <NumberField
            label="Short break"
            unit="min"
            value={draft.shortBreakMinutes}
            onChange={(value) => updateNumber("shortBreakMinutes", value)}
          />
          <NumberField
            label="Long break"
            unit="min"
            value={draft.longBreakMinutes}
            onChange={(value) => updateNumber("longBreakMinutes", value)}
          />
          <NumberField
            label="Long interval"
            unit="sessions"
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
    </div>
  );
}

type NumberFieldProps = {
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
};

function NumberField({ label, unit, value, onChange, max = 180 }: NumberFieldProps) {
  const inputId = useId();
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => setInputValue(String(value)), [value]);

  const commitValue = () => {
    const parsed = Number(inputValue);
    const next = inputValue.trim() && Number.isFinite(parsed)
      ? Math.min(max, Math.max(1, Math.round(parsed)))
      : value;
    setInputValue(String(next));
    onChange(next);
  };

  const adjustValue = (amount: number) => {
    const parsed = Number(inputValue);
    const current = inputValue.trim() && Number.isFinite(parsed) ? parsed : value;
    const next = Math.min(max, Math.max(1, Math.round(current) + amount));
    setInputValue(String(next));
    onChange(next);
  };

  return (
    <div className="field">
      <div className="field-copy">
        <label htmlFor={inputId}>{label}</label>
        <span className="field-unit">{unit}</span>
      </div>
      <div className="number-control">
        <input
          id={inputId}
          min="1"
          max={max}
          step="1"
          type="number"
          value={inputValue}
          onChange={(event) => {
            const nextValue = event.currentTarget.value;
            setInputValue(nextValue);
            if (nextValue.trim() && Number.isFinite(Number(nextValue))) onChange(Number(nextValue));
          }}
          onBlur={commitValue}
        />
        <div className="number-stepper" role="group" aria-label={`${label} adjustment`}>
          <button
            aria-label={`Increase ${label}`}
            disabled={value >= max}
            onClick={() => adjustValue(1)}
            type="button"
          >
            <span aria-hidden="true">⌃</span>
          </button>
          <button
            aria-label={`Decrease ${label}`}
            disabled={value <= 1}
            onClick={() => adjustValue(-1)}
            type="button"
          >
            <span aria-hidden="true">⌄</span>
          </button>
        </div>
      </div>
    </div>
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
      <input
        role="switch"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
    </label>
  );
}
