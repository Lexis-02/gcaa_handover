import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    pageTitle = '',
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <div className="print:hidden">
                <AppSidebar />
            </div>
            <AppContent variant="sidebar" className="print:m-0 print:w-full print:p-0">
                <div className="print:hidden">
                    <AppSidebarHeader pageTitle={pageTitle} />
                </div>
                <div scroll-region="true" className="custom-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto print:overflow-visible print:h-auto">
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
