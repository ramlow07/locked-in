import { invoke } from "@tauri-apps/api/core";
import type { CompletedSession } from "../../timer/domain/types";
import { modeLabels } from "../../timer/domain/timer";

export async function notifySessionComplete(session: CompletedSession, enabled: boolean) {
  if (!enabled) return;

  const title = session.mode === "focus" ? "Focus session complete" : "Break complete";
  const body = `Next up: ${modeLabels[session.nextMode]}`;

  try {
    await invoke("notify_session_complete", {
      payload: {
        mode: session.mode,
        nextMode: session.nextMode,
        title,
        body,
      },
    });
  } catch {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") new Notification(title, { body });
    }
  }
}
