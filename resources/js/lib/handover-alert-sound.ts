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

/**
 * Classic PC-style triple beep — alerts the signer that action is required.
 */
export async function playHandoverAlertSound(): Promise<void> {
    const ctx = getContext();
    if (!ctx) {
        return;
    }

    try {
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        if (ctx.state !== 'running') {
            return;
        }

        const now = ctx.currentTime;
        const beeps = [
            { start: 0, freq: 880 },
            { start: 0.18, freq: 988 },
            { start: 0.36, freq: 1175 },
        ];

        beeps.forEach(({ start, freq }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + start);

            const attack = now + start + 0.015;
            const release = now + start + BEEP_DURATION_S;

            gain.gain.setValueAtTime(0.0001, now + start);
            gain.gain.exponentialRampToValueAtTime(PEAK_GAIN, attack);
            gain.gain.exponentialRampToValueAtTime(0.0001, release);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + start);
            osc.stop(release + 0.02);
        });
    } catch {
        // Ignore playback errors (e.g. autoplay still blocked).
    }
}
