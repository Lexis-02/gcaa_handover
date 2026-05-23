import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import {
    playHandoverAlertSound,
    unlockHandoverAlertSound,
} from '@/lib/handover-alert-sound';

const POLL_MS = 20_000;
const SOUND_ENABLED_KEY = 'gcaa-handover-alert-sound';

type NotificationsShared = {
    unread_count?: number;
    latest_id?: string | null;
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

export function useHandoverNotificationAlerts(): void {
    const { auth, notifications } = usePage<{
        auth: { user: { id: number } | null };
        notifications: NotificationsShared | null;
    }>().props;

    const lastKnownId = useRef<string | null>(
        notifications?.latest_id ?? null,
    );
    const unreadRef = useRef(notifications?.unread_count ?? 0);

    useEffect(() => {
        unreadRef.current = notifications?.unread_count ?? 0;
        if (notifications?.latest_id) {
            lastKnownId.current = notifications.latest_id;
        }
    }, [notifications?.latest_id, notifications?.unread_count]);

    useEffect(() => {
        if (!auth.user) {
            return;
        }

        const unlock = () => unlockHandoverAlertSound();
        document.addEventListener('click', unlock, { once: true });
        document.addEventListener('keydown', unlock, { once: true });

        const poll = async () => {
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

                const data = (await response.json()) as {
                    unread_count: number;
                    new: { id: string }[];
                    latest_id: string | null;
                };

                const hasNew =
                    data.new.length > 0 ||
                    data.unread_count > unreadRef.current;

                if (hasNew && isHandoverAlertSoundEnabled()) {
                    playHandoverAlertSound();
                }

                unreadRef.current = data.unread_count;
                if (data.latest_id) {
                    lastKnownId.current = data.latest_id;
                }

                if (data.new.length > 0) {
                    router.reload({
                        only: ['notifications'],
                        preserveScroll: true,
                        preserveState: true,
                    });
                }
            } catch {
                // Ignore network errors during background poll
            }
        };

        const interval = window.setInterval(poll, POLL_MS);

        return () => {
            document.removeEventListener('click', unlock);
            document.removeEventListener('keydown', unlock);
            window.clearInterval(interval);
        };
    }, [auth.user]);
}
