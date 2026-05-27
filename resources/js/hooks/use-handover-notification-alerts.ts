import { router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef } from 'react';
import {
    playHandoverAlertSound,
    unlockHandoverAlertSound,
} from '@/lib/handover-alert-sound';

/** Poll interval for sign-off alerts (deferred after login to keep dashboard fast). */
const POLL_MS = 15_000;
const INITIAL_POLL_DELAY_MS = 10_000;
/** Re-alert while unread handover notifications remain (until sign-off / dismiss). */
const REMINDER_MS = 120_000;
const SOUND_ENABLED_KEY = 'gcaa-handover-alert-sound';
const PLAYED_IDS_KEY = 'gcaa-handover-alert-played';
const LOGIN_ALERT_KEY = 'gcaa-handover-login-alert-done';
const MAX_PLAYED_IDS = 100;

type NotificationsShared = {
    unread_count?: number;
    latest_id?: string | null;
};

type PollResponse = {
    unread_count: number;
    new: { id: string; notification_type?: string }[];
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
    const pendingLoginAlert = useRef(false);
    const previousUserId = useRef<number | null>(null);
    const skipNotificationPollOnMount = useRef(true);
    const userId = auth.user?.id;
    const unreadCount = notifications?.unread_count ?? 0;

    useEffect(() => {
        if (notifications?.latest_id) {
            lastKnownId.current = notifications.latest_id;
        }
    }, [notifications?.latest_id]);

    /** One beep per sign-in when unread sign-offs were already waiting. */
    useEffect(() => {
        if (!userId) {
            previousUserId.current = null;
            pendingLoginAlert.current = false;
            skipNotificationPollOnMount.current = true;

            return;
        }

        skipNotificationPollOnMount.current = true;

        const justSignedIn = previousUserId.current !== userId;
        previousUserId.current = userId;

        if (justSignedIn) {
            sessionStorage.removeItem(`${LOGIN_ALERT_KEY}:${userId}`);

            if (unreadCount > 0 && isHandoverAlertSoundEnabled()) {
                pendingLoginAlert.current = true;
            }
        }
    }, [userId, unreadCount]);

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
            // Only play sound for sign-off prompting notifications (action_required).
            // ICT admin completion notifications (stage_completed) are always silent.
            const unplayed = data.new.filter(
                (item) =>
                    !playedIds.current.has(item.id) &&
                    (item.notification_type === 'action_required' ||
                        !item.notification_type),
            );
            const now = Date.now();
            let played = false;

            if (unplayed.length > 0 && soundOn) {
                void playHandoverAlertSound();
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
                // Reminder only fires if there are unread action_required items.
                const hasActionRequired = data.new.some(
                    (item) =>
                        item.notification_type === 'action_required' ||
                        !item.notification_type,
                );
                if (hasActionRequired) {
                    void playHandoverAlertSound();
                    lastReminderAt.current = now;
                }
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

    const tryPlayLoginAlert = useCallback(async () => {
        if (!userId || !pendingLoginAlert.current || unreadCount <= 0) {
            return;
        }

        if (!isHandoverAlertSoundEnabled()) {
            pendingLoginAlert.current = false;
            return;
        }

        if (sessionStorage.getItem(`${LOGIN_ALERT_KEY}:${userId}`) === '1') {
            pendingLoginAlert.current = false;
            return;
        }

        await unlockHandoverAlertSound();
        await playHandoverAlertSound();

        sessionStorage.setItem(`${LOGIN_ALERT_KEY}:${userId}`, '1');
        pendingLoginAlert.current = false;
        lastReminderAt.current = Date.now();
    }, [userId, unreadCount]);

    useEffect(() => {
        if (!userId) {
            return;
        }

        playedIds.current = loadPlayedIds(userId);

        const onUserGesture = () => {
            void tryPlayLoginAlert();
        };
        document.addEventListener('click', onUserGesture, { once: true });
        document.addEventListener('keydown', onUserGesture, { once: true });

        const onVisible = () => {
            if (document.visibilityState === 'visible') {
                void poll();
            }
        };

        document.addEventListener('visibilitychange', onVisible);

        const initialPoll = window.setTimeout(() => {
            void poll();
        }, INITIAL_POLL_DELAY_MS);

        const interval = window.setInterval(() => {
            void poll();
        }, POLL_MS);

        return () => {
            document.removeEventListener('click', onUserGesture);
            document.removeEventListener('keydown', onUserGesture);
            document.removeEventListener('visibilitychange', onVisible);
            window.clearTimeout(initialPoll);
            window.clearInterval(interval);
        };
    }, [userId, poll, tryPlayLoginAlert]);

    /** Poll when notification props change after navigation (skip first mount — shared data is fresh). */
    useEffect(() => {
        if (!userId) {
            return;
        }

        if (skipNotificationPollOnMount.current) {
            skipNotificationPollOnMount.current = false;

            return;
        }

        void poll();
    }, [userId, poll, notifications?.latest_id, notifications?.unread_count]);
}
