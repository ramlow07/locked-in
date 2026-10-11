import type { AppUpdateStatus } from "./useAppUpdater";

type UpdateNoticeProps = {
  status: AppUpdateStatus;
  onInstall: () => void;
  onDismiss: () => void;
};

export function UpdateNotice({ status, onInstall, onDismiss }: UpdateNoticeProps) {
  if (status.kind !== "available" && status.kind !== "installing") return null;

  const installing = status.kind === "installing";
  const progress = installing ? status.progress : null;

  return (
    <aside className="update-notice" aria-label="Software update" aria-live="polite">
      <div className="update-notice-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 18.5v1h14v-1" />
        </svg>
      </div>
      <div className="update-notice-content">
        <p className="eyebrow">Update available</p>
        <h2>{installing ? "Updating Locked In" : `Locked In ${status.version}`}</h2>
        <p className="update-notice-copy">
          {installing
            ? progress === null
              ? "Downloading and installing…"
              : `Downloading and installing… ${progress}%`
            : "A new version is ready. Install it now and restart Locked In."}
        </p>
        {installing && progress !== null && (
          <progress className="update-progress" max="100" value={progress} aria-label="Update progress" />
        )}
        <div className="update-notice-actions">
          <button className="primary-control" onClick={onInstall} disabled={installing} type="button">
            {installing ? "Installing…" : "Update and restart"}
          </button>
          {!installing && (
            <button className="ghost-control" onClick={onDismiss} type="button">
              Later
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
