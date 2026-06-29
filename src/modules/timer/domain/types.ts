export type TimerMode = "focus" | "shortBreak" | "longBreak";

export type TimerStatus = "idle" | "running" | "paused" | "completed";

export type TimerSettings = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  autoStartNext: boolean;
};

export type TodayStats = {
  date: string;
  completedFocusSessions: number;
  focusedSeconds: number;
};

export type TimerState = {
  mode: TimerMode;
  status: TimerStatus;
  remainingSeconds: number;
  totalSeconds: number;
  completedFocusSessionsToday: number;
  cycleCount: number;
};

export type CompletedSession = {
  mode: TimerMode;
  nextMode: TimerMode;
};
