import { router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef } from 'react';
import {
    playHandoverAlertSound,
    unlockHandoverAlertSound,
} from '@/lib/handover-alert-sound';

/** Fast poll so new sign-off alerts are detected within a few seconds. */
const POLL_MS = 3_000;
/** Re-alert while unread handover notifications remain (until sign-off / dismiss). */
const REMINDER_MS = 120_000;
const SOUND_ENABLED_KEY = 'gcaa-handover-alert-sound';
const PLAYED_IDS_KEY = 'gcaa-handover-alert-played';
const MAX_PLAYED_IDS = 100;

type NotificationsShared = {
    unread_count?: number;
    latest_id?: string | null;
};

type PollResponse = {
    unread_count: number;
    new: { id: string }[];
    latest_id: string | null;
};

export function isHandoverAlertSoundEnabled(): boolean {
    if (typeof window === 'undefined') {
        return true;
    }

    return localStorage.getItem(SOUND_ENABLED_KEY) !== 'off';
}

export function setHandoverAlertSoundEnabled(enabled: boolean): void {
    localStorage.setItem(SOUND_ENABLED_KEY, enabled ? 'on' : 'off');
}

function loadPlayedIds(userId: number): Set<string> {
    if (typeof window === 'undefined') {
        return new Set();
    }

    try {
        const raw = sessionStorage.getItem(`${PLAYED_IDS_KEY}:${userId}`);
        if (!raw) {
            return new Set();
        }

        const parsed = JSON.parse(raw) as string[];

        return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
        return new Set();
    }
}

function savePlayedIds(userId: number, ids: Set<string>): void {
    const trimmed = [...ids].slice(-MAX_PLAYED_IDS);
    sessionStorage.setItem(
        `${PLAYED_IDS_KEY}:${userId}`,
        JSON.stringify(trimmed),
    );
}

export function useHandoverNotificationAlerts(): void {
    const { auth, notifications } = usePage<{
        auth: { user: { id: number } | null };
        notifications: NotificationsShared | null;
    }>().props;

    const lastKnownId = useRef<string | null>(
        notifications?.latest_id ?? null,
    );
    const playedIds = useRef<Set<string>>(new Set());
    const lastReminderAt = useRef(0);
    const userId = auth.user?.id;

    useEffect(() => {
        if (notifications?.latest_id) {
            lastKnownId.current = notifications.latest_id;
        }
    }, [notifications?.latest_id]);

    const poll = useCallback(async () => {
        if (!userId) {
            return;
        }

        try {
            const params = new URLSearchParams();
            if (lastKnownId.current) {
                params.set('since', lastKnownId.current);
            }

            const response = await fetch(
                `/notifications/poll?${params.toString()}`,
                {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                },
            );

            if (!response.ok) {
                return;
            }

            const data = (await response.json()) as PollResponse;
            const soundOn = isHandoverAlertSoundEnabled();
            const unplayed = data.new.filter(
                (item) => !playedIds.current.has(item.id),
            );
            const now = Date.now();
            let played = false;

            if (unplayed.length > 0 && soundOn) {
                playHandoverAlertSound();
                unplayed.forEach((item) => {
                    playedIds.current.add(item.id);
                });
                savePlayedIds(userId, playedIds.current);
                lastReminderAt.current = now;
                played = true;
            } else if (
                !played &&
                soundOn &&
                data.unread_count > 0 &&
                now - lastReminderAt.current >= REMINDER_MS
            ) {
                playHandoverAlertSound();
                lastReminderAt.current = now;
            }

            if (data.latest_id) {
                lastKnownId.current = data.latest_id;
            }

            if (data.new.length > 0) {
                router.reload({ only: ['notifications'] });
            }
        } catch {
            // Ignore network errors during background poll
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) {
            return;
        }

        playedIds.current = loadPlayedIds(userId);

        const unlock = () => unlockHandoverAlertSound();
        document.addEventListener('click', unlock, { once: true });
        document.addEventListener('keydown', unlock, { once: true });

        const onVisible = () => {
            if (document.visibilityState === 'visible') {
                void poll();
            }
        };

        document.addEventListener('visibilitychange', onVisible);

        void poll();
        const interval = window.setInterval(() => {
            void poll();
        }, POLL_MS);

        return () => {
            document.removeEventListener('click', unlock);
            document.removeEventListener('visibilitychange', onVisible);
            window.clearInterval(interval);
        };
    }, [userId, poll]);

    /** Poll immediately when shared notification props change (e.g. after navigation). */
    useEffect(() => {
        if (!userId) {
            return;
        }

        void poll();
    }, [userId, poll, notifications?.latest_id, notifications?.unread_count]);
}
