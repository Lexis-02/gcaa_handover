let audioContext: AudioContext | null = null;
let unlocked = false;

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

/** Unlock audio after first user gesture (browser policy). */
export function unlockHandoverAlertSound(): void {
    const ctx = getContext();
    if (!ctx || unlocked) {
        return;
    }

    if (ctx.state === 'suspended') {
        void ctx.resume();
    }

    unlocked = true;
}

/**
 * Classic PC-style triple beep — alerts the signer that action is required.
 */
export function playHandoverAlertSound(): void {
    const ctx = getContext();
    if (!ctx) {
        return;
    }

    if (ctx.state === 'suspended') {
        void ctx.resume();
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

        gain.gain.setValueAtTime(0.0001, now + start);
        gain.gain.exponentialRampToValueAtTime(0.12, now + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + 0.14);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + 0.16);
    });
}
