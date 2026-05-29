let audioContext: AudioContext | null = null;
let unlocked = false;

/** Peak volume for alert beeps (0–1). Raised for office environments. */
const PEAK_GAIN = 0.38;
const BEEP_DURATION_S = 0.2;

function getContext(): AudioContext | null {
    if (typeof window === 'undefined') {
        return null;
    }

    if (!audioContext) {
        const Ctx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext })
                .webkitAudioContext;

        if (!Ctx) {
            return null;
        }

        audioContext = new Ctx();
    }

    return audioContext;
}

/** Whether the browser has allowed audio after a user gesture. */
export function isHandoverAlertSoundUnlocked(): boolean {
    return unlocked;
}

/** Unlock audio after first user gesture (browser autoplay policy). */
export async function unlockHandoverAlertSound(): Promise<void> {
    const ctx = getContext();
    if (!ctx || unlocked) {
        return;
    }

    try {
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        // Silent buffer — required by some browsers to fully unlock Web Audio.
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);

        unlocked = true;
    } catch {
        // Browser blocked audio — alerts will retry after the next gesture.
    }
}

export async function playHandoverAlertSound(): Promise<void> {
    // Sound disabled per new update.
    return;
}
