use serde::Deserialize;
use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionCompletePayload {
    pub mode: String,
    pub next_mode: String,
    pub title: String,
    pub body: String,
}

#[tauri::command]
pub fn notify_session_complete(app: AppHandle, payload: SessionCompletePayload) -> Result<(), String> {
    app.notification()
        .builder()
        .title(payload.title)
        .body(payload.body)
        .show()
        .map_err(|error| error.to_string())
}
