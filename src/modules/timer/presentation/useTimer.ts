import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createTimerState,
  durationForMode,
  getNextMode,
  validateSettings,
  withMode,
} from "../domain/timer";
import type { CompletedSession, TimerMode, TimerSettings, TimerState, TodayStats } from "../domain/types";
import {
  loadSettings,
  loadTodayStats,
  saveSettings,
  saveTodayStats,
} from "../../settings/infrastructure/localSettingsStorage";

export function useTimer() {
  const [settings, setSettings] = useState<TimerSettings>(() => loadSettings());
  const [todayStats, setTodayStats] = useState<TodayStats>(() => loadTodayStats());
  const [state, setState] = useState<TimerState>(() => createTimerState(loadSettings(), loadTodayStats()));
  const [completedSession, setCompletedSession] = useState<CompletedSession | null>(null);

  const nextMode = useMemo(
    () => getNextMode(state.mode, state.mode === "focus" ? state.cycleCount + 1 : state.cycleCount, settings),
    [settings, state.cycleCount, state.mode],
  );

  const completeCurrentSession = useCallback(() => {
    setCompletedSession(null);
    setState((current) => {
      const completedFocus = current.mode === "focus";
      const nextCycleCount = completedFocus ? current.cycleCount + 1 : current.cycleCount;
      const next = getNextMode(current.mode, nextCycleCount, settings);

      if (completedFocus) {
        setTodayStats((stats) => {
          const updated = {
            ...stats,
            completedFocusSessions: stats.completedFocusSessions + 1,
            focusedSeconds: stats.focusedSeconds + current.totalSeconds,
          };
          saveTodayStats(updated);
          return updated;
        });
      }

      setCompletedSession({ mode: current.mode, nextMode: next });

      const nextDuration = durationForMode(next, settings);
      return {
        ...current,
        mode: next,
        status: settings.autoStartNext ? "running" : "completed",
        remainingSeconds: nextDuration,
        totalSeconds: nextDuration,
        completedFocusSessionsToday: completedFocus
          ? current.completedFocusSessionsToday + 1
          : current.completedFocusSessionsToday,
        cycleCount: nextCycleCount,
      };
    });
  }, [settings]);

  useEffect(() => {
    if (state.status !== "running") return;

    const interval = window.setInterval(() => {
      setState((current) => {
        if (current.status !== "running") return current;
        if (current.remainingSeconds <= 1) return { ...current, remainingSeconds: 0 };
        return { ...current, remainingSeconds: current.remainingSeconds - 1 };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [state.status]);

  useEffect(() => {
    if (state.status === "running" && state.remainingSeconds === 0) {
      completeCurrentSession();
    }
  }, [completeCurrentSession, state.remainingSeconds, state.status]);

  const start = useCallback(() => {
    setCompletedSession(null);
    setState((current) => ({ ...current, status: "running" }));
  }, []);

  const pause = useCallback(() => {
    setState((current) => (current.status === "running" ? { ...current, status: "paused" } : current));
  }, []);

  const resume = useCallback(() => {
    setState((current) => (current.status === "paused" ? { ...current, status: "running" } : current));
  }, []);

  const toggle = useCallback(() => {
    setState((current) => {
      if (current.status === "running") return { ...current, status: "paused" };
      if (current.status === "paused" || current.status === "idle" || current.status === "completed") {
        setCompletedSession(null);
        return { ...current, status: "running" };
      }
      return current;
    });
  }, []);

  const reset = useCallback(() => {
    setCompletedSession(null);
    setState((current) => withMode(current, current.mode, settings));
  }, [settings]);

  const switchMode = useCallback(
    (mode: TimerMode) => {
      setCompletedSession(null);
      setState((current) => withMode(current, mode, settings));
    },
    [settings],
  );

  const updateSettings = useCallback((nextSettings: TimerSettings) => {
    const validated = validateSettings(nextSettings);
    setSettings(validated);
    saveSettings(validated);
    setState((current) => {
      if (current.status === "idle" || current.status === "completed") {
        return withMode(current, current.mode, validated);
      }
      return current;
    });
  }, []);

  return {
    settings,
    state,
    todayStats,
    completedSession,
    nextMode,
    start,
    pause,
    resume,
    toggle,
    reset,
    switchMode,
    completeCurrentSession,
    updateSettings,
  };
}
