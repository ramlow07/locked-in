# Locked In

Locked In is a macOS-first Pomodoro app for developers. It pairs a focused timer with a lightweight landing page, configurable focus and break sessions, local persistence, keyboard shortcuts, today stats, and session-complete notifications and sound.

## Stack

- Tauri v2
- React
- TypeScript
- Rust
- Vite

## Commands

```bash
pnpm install
pnpm dev
pnpm tauri dev
pnpm build
pnpm tauri build
```

## MVP Scope

- Focus, short break, and long break modes
- Start, pause, resume, reset, and manual completion
- Configurable durations and long-break interval
- Local settings and today stats persistence
- macOS notification on session completion
- Optional two-note sound on session completion
- Keyboard shortcuts: Space, R, 1, 2, 3, Cmd/Ctrl + comma

## Pages

- `/` is the public landing page
- `/app.html` is the timer; the Tauri window opens directly to this page

## Non-MVP

Menu bar mode, task tracking, full history, analytics, accounts, sync, mobile apps, AI features, and strict hardcore mode are intentionally out of scope for the first MVP.
