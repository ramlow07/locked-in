import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { SettingsPanel } from "../modules/settings/presentation/SettingsPanel";
import { useTimer } from "../modules/timer/presentation/useTimer";
import { notifySessionComplete } from "../modules/notifications/application/notifySessionComplete";
import {
  playSessionCompleteSound,
  unlockSessionCompleteSound,
} from "../modules/sound/application/sessionCompleteSound";
import type { TimerMode } from "../modules/timer/domain/types";
import { formatDuration, modeLabels } from "../modules/timer/domain/timer";
import "./app.css";

const modeOrder: TimerMode[] = ["focus", "shortBreak", "longBreak"];

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return ["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable;
}

export function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const timer = useTimer();
  const handledCompletion = useRef<typeof timer.completedSession>(null);
  const progress = timer.state.totalSeconds
    ? 1 - timer.state.remainingSeconds / timer.state.totalSeconds
    : 0;
  const nextLabel = modeLabels[timer.nextMode];
  const controlLabel = useMemo(() => {
    if (timer.state.status === "running") return "Pause";
    if (timer.state.status === "paused") return "Resume";
    return "Start";
  }, [timer.state.status]);

  const toggleTimer = () => {
    if (timer.settings.soundEnabled) unlockSessionCompleteSound();
    timer.toggle();
  };

  const saveSettings = (settings: typeof timer.settings) => {
    if (settings.soundEnabled) unlockSessionCompleteSound();
    timer.updateSettings(settings);
  };

  useEffect(() => {
    const completedSession = timer.completedSession;
    if (!completedSession || handledCompletion.current === completedSession) return;

    handledCompletion.current = completedSession;
    if (timer.settings.soundEnabled) playSessionCompleteSound();
    notifySessionComplete(completedSession, timer.settings.notificationsEnabled);
  }, [timer.completedSession, timer.settings.notificationsEnabled, timer.settings.soundEnabled]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();
      if (event.key === " ") {
        event.preventDefault();
        toggleTimer();
      }
      if (key === "r") timer.reset();
      if (key === "1") timer.switchMode("focus");
      if (key === "2") timer.switchMode("shortBreak");
      if (key === "3") timer.switchMode("longBreak");
      if ((event.metaKey || event.ctrlKey) && key === ",") {
        event.preventDefault();
        setSettingsOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [timer, toggleTimer]);

  return (
    <main className="shell">
      <section className="timer-workspace" aria-label="Locked In timer">
        <header className="status-strip">
          <div>
            <p className="eyebrow">LOCKED-IN</p>
            <h1>Focus cockpit</h1>
          </div>
          <div className={`status-pill status-${timer.state.status}`}>
            <span aria-hidden="true" />
            {timer.state.status}
          </div>
        </header>

        <section className="timer-panel" aria-label="Current session">
          <div className="mode-selector" role="group" aria-label="Timer mode selector">
            {modeOrder.map((mode) => (
              <button
                className={timer.state.mode === mode ? "mode active" : "mode"}
                key={mode}
                onClick={() => timer.switchMode(mode)}
                aria-pressed={timer.state.mode === mode}
                type="button"
              >
                {modeLabels[mode]}
              </button>
            ))}
          </div>

          <div className="timer-display">
            <div className="ring" style={{ "--progress": `${progress * 360}deg` } as CSSProperties}>
              <div
                className="time"
                role="timer"
                aria-label={`${formatDuration(timer.state.remainingSeconds)} remaining`}
                aria-live="off"
              >
                {formatDuration(timer.state.remainingSeconds)}
              </div>
              <div className="mode-name">{modeLabels[timer.state.mode]}</div>
            </div>
          </div>

          <div className="controls" aria-label="Timer controls">
            <button className="primary-control" onClick={toggleTimer} type="button">
              {controlLabel}
            </button>
            <button className="ghost-control" onClick={timer.reset} type="button">
              Reset
            </button>
            <button
              className="ghost-control"
              onClick={() => {
                if (timer.settings.soundEnabled) unlockSessionCompleteSound();
                timer.completeCurrentSession();
              }}
              type="button"
            >
              Complete
            </button>
            <button
              className="icon-control"
              aria-label="Open settings"
              aria-haspopup="dialog"
              aria-expanded={settingsOpen}
              onClick={() => setSettingsOpen(true)}
              type="button"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" />
                <path d="m19.4 15 .05.04a1.75 1.75 0 0 1-2.47 2.47l-.04-.05a1.74 1.74 0 0 0-2.96 1.23v.14a1.75 1.75 0 0 1-3.5 0v-.07a1.74 1.74 0 0 0-2.96-1.23l-.04.05a1.75 1.75 0 1 1-2.47-2.47l.05-.04a1.74 1.74 0 0 0-1.23-2.96h-.14a1.75 1.75 0 0 1 0-3.5h.07a1.74 1.74 0 0 0 1.23-2.96l-.05-.04a1.75 1.75 0 1 1 2.47-2.47l.04.05a1.74 1.74 0 0 0 2.96-1.23v-.14a1.75 1.75 0 0 1 3.5 0v.07a1.74 1.74 0 0 0 2.96 1.23l.04-.05a1.75 1.75 0 0 1 2.47 2.47l-.05.04a1.74 1.74 0 0 0 1.23 2.96h.14a1.75 1.75 0 0 1 0 3.5h-.07A1.74 1.74 0 0 0 19.4 15Z" />
              </svg>
            </button>
          </div>
        </section>

        <section className="summary-grid" aria-label="Today summary">
          <article>
            <span>Today</span>
            <strong>{timer.todayStats.completedFocusSessions}</strong>
            <small>focus sessions</small>
          </article>
          <article>
            <span>Focused</span>
            <strong>{Math.floor(timer.todayStats.focusedSeconds / 60)}m</strong>
            <small>tracked today</small>
          </article>
          <article>
            <span>Cycle</span>
            <strong>{timer.state.cycleCount}</strong>
            <small>next: {nextLabel}</small>
          </article>
        </section>
      </section>

      <SettingsPanel
        isOpen={settingsOpen}
        settings={timer.settings}
        onClose={() => setSettingsOpen(false)}
        onSave={saveSettings}
      />
    </main>
  );
}
