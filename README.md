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

## Releases and updates

- The app checks for updates when it opens. Users can also check manually in Settings.
- Push a tag in the format `app-v<version>` to build and publish signed macOS update artifacts through GitHub Actions.
- Keep the Tauri updater private key in the repository secret `TAURI_SIGNING_PRIVATE_KEY` and in a secure local backup. Never commit the private key.
- The first release that contains the updater must be installed manually; later releases can be installed from the in-app update notice.

## Non-MVP

Menu bar mode, task tracking, full history, analytics, accounts, sync, mobile apps, AI features, and strict hardcore mode are intentionally out of scope for the first MVP.
