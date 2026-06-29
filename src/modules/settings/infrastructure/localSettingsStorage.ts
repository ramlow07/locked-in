import type { TimerSettings, TodayStats } from "../../timer/domain/types";
import { defaultSettings, validateSettings, validateTodayStats } from "../../timer/domain/timer";

const settingsKey = "locked-in.settings";
const todayStatsKey = "locked-in.today-stats";

export function loadSettings(): TimerSettings {
  return readJson(settingsKey, defaultSettings, validateSettings);
}

export function saveSettings(settings: TimerSettings) {
  window.localStorage.setItem(settingsKey, JSON.stringify(settings));
}

export function loadTodayStats(): TodayStats {
  return readJson(todayStatsKey, null, validateTodayStats);
}

export function saveTodayStats(stats: TodayStats) {
  window.localStorage.setItem(todayStatsKey, JSON.stringify(stats));
}

function readJson<T>(key: string, fallback: unknown, validate: (value: unknown) => T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return validate(raw ? JSON.parse(raw) : fallback);
  } catch {
    return validate(fallback);
  }
}
