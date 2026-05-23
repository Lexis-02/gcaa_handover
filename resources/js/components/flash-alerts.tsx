import { useFlashAlerts } from '@/hooks/use-flash-alerts';

/** Mount once at app root to show Inertia flash messages via SweetAlert2. */
export function FlashAlerts() {
    useFlashAlerts();

    return null;
}
