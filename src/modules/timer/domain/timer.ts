import type { TimerMode, TimerSettings, TimerState, TodayStats } from "./types";

export const modeLabels: Record<TimerMode, string> = {
  focus: "Focus",
  shortBreak: "Short break",
  longBreak: "Long break",
};

export const defaultSettings: TimerSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  notificationsEnabled: true,
  soundEnabled: false,
  autoStartNext: false,
};

export function durationForMode(mode: TimerMode, settings: TimerSettings) {
  const minutes = {
    focus: settings.focusMinutes,
    shortBreak: settings.shortBreakMinutes,
    longBreak: settings.longBreakMinutes,
  }[mode];

  return minutes * 60;
}

export function createTodayStats(date = getLocalDateKey()): TodayStats {
  return {
    date,
    completedFocusSessions: 0,
    focusedSeconds: 0,
  };
}

export function createTimerState(settings: TimerSettings, stats = createTodayStats()): TimerState {
  return {
    mode: "focus",
    status: "idle",
    remainingSeconds: durationForMode("focus", settings),
    totalSeconds: durationForMode("focus", settings),
    completedFocusSessionsToday: stats.completedFocusSessions,
    cycleCount: stats.completedFocusSessions,
  };
}

export function getNextMode(mode: TimerMode, cycleCount: number, settings: TimerSettings): TimerMode {
  if (mode !== "focus") return "focus";
  return cycleCount > 0 && cycleCount % settings.longBreakInterval === 0 ? "longBreak" : "shortBreak";
}

export function withMode(state: TimerState, mode: TimerMode, settings: TimerSettings): TimerState {
  const duration = durationForMode(mode, settings);
  return {
    ...state,
    mode,
    status: "idle",
    remainingSeconds: duration,
    totalSeconds: duration,
  };
}

export function validateSettings(value: unknown): TimerSettings {
  const maybe = typeof value === "object" && value !== null ? (value as Partial<TimerSettings>) : {};
  return {
    focusMinutes: clampMinutes(maybe.focusMinutes, defaultSettings.focusMinutes),
    shortBreakMinutes: clampMinutes(maybe.shortBreakMinutes, defaultSettings.shortBreakMinutes),
    longBreakMinutes: clampMinutes(maybe.longBreakMinutes, defaultSettings.longBreakMinutes),
    longBreakInterval: clampInteger(maybe.longBreakInterval, 1, 12, defaultSettings.longBreakInterval),
    notificationsEnabled: typeof maybe.notificationsEnabled === "boolean" ? maybe.notificationsEnabled : true,
    soundEnabled: typeof maybe.soundEnabled === "boolean" ? maybe.soundEnabled : false,
    autoStartNext: typeof maybe.autoStartNext === "boolean" ? maybe.autoStartNext : false,
  };
}

export function validateTodayStats(value: unknown): TodayStats {
  const today = getLocalDateKey();
  if (typeof value !== "object" || value === null) return createTodayStats(today);

  const maybe = value as Partial<TodayStats>;
  if (maybe.date !== today) return createTodayStats(today);

  return {
    date: today,
    completedFocusSessions: nonNegativeInteger(maybe.completedFocusSessions),
    focusedSeconds: nonNegativeInteger(maybe.focusedSeconds),
  };
}

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(Math.max(0, totalSeconds) / 60);
  const seconds = Math.max(0, totalSeconds) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function clampMinutes(value: unknown, fallback: number) {
  return clampInteger(value, 1, 180, fallback);
}

function clampInteger(value: unknown, min: number, max: number, fallback: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function nonNegativeInteger(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}
