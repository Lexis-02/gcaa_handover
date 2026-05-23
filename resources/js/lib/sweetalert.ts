import Swal from 'sweetalert2';
import type { FlashToast } from '@/types/ui';

const base = Swal.mixin({
    buttonsStyling: false,
    customClass: {
        container: 'swal2-gcaa',
        popup: 'swal2-popup-gcaa rounded-xl border border-border bg-card shadow-xl',
        title: 'swal2-title-gcaa text-lg font-semibold text-foreground',
        htmlContainer: 'swal2-html-gcaa text-sm text-muted-foreground',
        actions: 'swal2-actions-gcaa',
        confirmButton: 'swal2-btn swal2-btn-confirm',
        cancelButton: 'swal2-btn swal2-btn-cancel',
        denyButton: 'swal2-btn swal2-btn-cancel',
    },
});

export function showToast({ type, message }: FlashToast): void {
    const icon =
        type === 'success'
            ? 'success'
            : type === 'error'
              ? 'error'
              : type === 'warning'
                ? 'warning'
                : 'info';

    base.fire({
        toast: true,
        position: 'top-end',
        icon,
        title: message,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
    });
}

async function showModal(
    icon: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
): Promise<void> {
    await base.fire({ icon, title, text: message });
}

export function showSuccess(message: string, title = 'Success'): Promise<void> {
    return showModal('success', title, message);
}

export function showError(message: string, title = 'Something went wrong'): Promise<void> {
    return showModal('error', title, message);
}

export function showWarning(message: string, title = 'Please note'): Promise<void> {
    return showModal('warning', title, message);
}

export function showInfo(message: string, title = 'Info'): Promise<void> {
    return showModal('info', title, message);
}

export async function confirmDelete(itemLabel: string): Promise<boolean> {
    return confirmAction({
        title: 'Delete this record?',
        text: `"${itemLabel}" will be permanently removed.`,
        confirmText: 'Yes, delete',
        icon: 'warning',
    });
}

export async function confirmLogout(): Promise<boolean> {
    return confirmAction({
        title: 'Log out?',
        text: 'You will need to sign in again to continue.',
        confirmText: 'Log out',
        icon: 'question',
    });
}

export async function confirmAction(options: {
    title: string;
    text?: string;
    confirmText?: string;
    cancelText?: string;
    icon?: 'warning' | 'question' | 'info';
}): Promise<boolean> {
    const result = await base.fire({
        icon: options.icon ?? 'question',
        title: options.title,
        text: options.text,
        showCancelButton: true,
        showDenyButton: false,
        showCloseButton: false,
        confirmButtonText: options.confirmText ?? 'Yes, continue',
        cancelButtonText: options.cancelText ?? 'Cancel',
        reverseButtons: true,
        focusCancel: true,
    });

    return result.isConfirmed;
}
