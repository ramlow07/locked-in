import { useCallback, useEffect, useRef, useState } from "react";
import { isTauri } from "@tauri-apps/api/core";
import { relaunch } from "@tauri-apps/plugin-process";
import { check, type Update } from "@tauri-apps/plugin-updater";

export type AppUpdateStatus =
  | { kind: "checking" }
  | { kind: "up-to-date" }
  | { kind: "available"; version: string }
  | { kind: "installing"; progress: number | null }
  | { kind: "error" }
  | { kind: "unsupported" };

export function useAppUpdater() {
  const desktopApp = isTauri();
  const updateRef = useRef<Update | null>(null);
  const checkingRef = useRef(false);
  const [status, setStatus] = useState<AppUpdateStatus>(() =>
    desktopApp ? { kind: "checking" } : { kind: "unsupported" },
  );
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  const checkForUpdates = useCallback(async () => {
    if (!desktopApp) {
      setStatus({ kind: "unsupported" });
      return;
    }
    if (checkingRef.current) return;

    checkingRef.current = true;
    setStatus({ kind: "checking" });

    try {
      const update = await check();
      updateRef.current = update;

      if (update) {
        setNoticeDismissed(false);
        setStatus({ kind: "available", version: update.version });
      } else {
        setStatus({ kind: "up-to-date" });
      }
    } catch {
      updateRef.current = null;
      setStatus({ kind: "error" });
    } finally {
      checkingRef.current = false;
    }
  }, [desktopApp]);

  const installUpdate = useCallback(async () => {
    const update = updateRef.current;
    if (!update) return;

    let contentLength = 0;
    let downloadedBytes = 0;
    setStatus({ kind: "installing", progress: null });

    try {
      await update.downloadAndInstall((event) => {
        if (event.event === "Started") {
          contentLength = event.data.contentLength ?? 0;
          setStatus({ kind: "installing", progress: contentLength ? 0 : null });
        } else if (event.event === "Progress") {
          downloadedBytes += event.data.chunkLength;
          const progress = contentLength
            ? Math.min(99, Math.floor((downloadedBytes / contentLength) * 100))
            : null;
          setStatus({ kind: "installing", progress });
        } else {
          setStatus({ kind: "installing", progress: 100 });
        }
      });

      await relaunch();
    } catch {
      setStatus({ kind: "error" });
    }
  }, []);

  useEffect(() => {
    if (desktopApp) {
      void checkForUpdates();
    } else {
      setStatus({ kind: "unsupported" });
    }
  }, [checkForUpdates, desktopApp]);

  const dismissNotice = useCallback(() => setNoticeDismissed(true), []);
  const noticeVisible =
    !noticeDismissed && (status.kind === "available" || status.kind === "installing");

  return {
    status,
    noticeVisible,
    checkForUpdates,
    installUpdate,
    dismissNotice,
  };
}
