import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import {
    showError,
    showInfo,
    showSuccess,
    showToast,
    showWarning,
} from '@/lib/sweetalert';
import type { FlashToast } from '@/types/ui';

type FlashPayload = {
    toast?: FlashToast;
    success?: string;
    error?: string;
};

function displayFlash(flash: FlashPayload | undefined): void {
    if (!flash) {
        return;
    }

    if (flash.toast) {
        const { type, message } = flash.toast;

        if (type === 'success') {
            void showSuccess(message);
            return;
        }

        if (type === 'error') {
            void showError(message);
            return;
        }

        if (type === 'warning') {
            void showWarning(message);
            return;
        }

        if (type === 'info') {
            void showInfo(message);
            return;
        }

        showToast(flash.toast);
        return;
    }

    if (flash.success) {
        void showSuccess(flash.success);
    } else if (flash.error) {
        void showError(flash.error);
    }
}

export function useFlashAlerts(): void {
    const { flash } = usePage<{ flash?: FlashPayload }>().props;
    const lastFlashKey = useRef<string | null>(null);

    useEffect(() => {
        const key = flash ? JSON.stringify(flash) : null;

        if (!key || key === lastFlashKey.current) {
            return;
        }

        lastFlashKey.current = key;
        displayFlash(flash);
    }, [flash]);

    useEffect(() => {
        return router.on('flash', (event) => {
            const detail = (event as CustomEvent).detail?.flash as
                | FlashPayload
                | undefined;

            displayFlash(detail);
        });
    }, []);
}
