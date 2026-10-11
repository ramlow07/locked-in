let audioContext: AudioContext | null = null;

export function unlockSessionCompleteSound() {
  const context = getAudioContext();
  if (context?.state === "suspended") {
    void context.resume().catch(() => undefined);
  }
}

export function playSessionCompleteSound() {
  const context = getAudioContext();
  if (!context) return;

  if (context.state === "suspended") {
    void context.resume().then(() => playChime(context)).catch(() => undefined);
    return;
  }

  playChime(context);
}

function getAudioContext() {
  if (typeof window === "undefined" || typeof window.AudioContext === "undefined") return null;

  try {
    audioContext ??= new window.AudioContext();
    return audioContext;
  } catch {
    return null;
  }
}

function playChime(context: AudioContext) {
  const notes = [659.25, 880];
  const startAt = context.currentTime;

  notes.forEach((frequency, index) => {
    const noteStartsAt = startAt + index * 0.14;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, noteStartsAt);
    envelope.gain.setValueAtTime(0.0001, noteStartsAt);
    envelope.gain.exponentialRampToValueAtTime(0.18, noteStartsAt + 0.025);
    envelope.gain.exponentialRampToValueAtTime(0.0001, noteStartsAt + 0.38);

    oscillator.connect(envelope);
    envelope.connect(context.destination);
    oscillator.start(noteStartsAt);
    oscillator.stop(noteStartsAt + 0.4);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
  });
}
