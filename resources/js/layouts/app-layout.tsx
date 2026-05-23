import { FlashAlerts } from '@/components/flash-alerts';
import { HandoverNotificationListener } from '@/components/handover-notification-listener';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    title,
    breadcrumbs = [],
    children,
}: {
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const pageTitle =
        title ?? breadcrumbs[breadcrumbs.length - 1]?.title ?? '';

    return (
        <AppLayoutTemplate pageTitle={pageTitle}>
            <HandoverNotificationListener />
            <FlashAlerts />
            {children}
        </AppLayoutTemplate>
    );
}
