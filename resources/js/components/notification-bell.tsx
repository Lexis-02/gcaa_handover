import { Link, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NotificationBell({ className }: { className?: string }) {
    const { notifications } = usePage<{
        notifications: {
            unread_count: number;
            sign_off_queue: number;
        } | null;
    }>().props;

    const unread = notifications?.unread_count ?? 0;
    const queue = notifications?.sign_off_queue ?? 0;
    const showBadge = unread > 0 || queue > 0;
    const badgeCount = unread > 0 ? unread : queue;

    return (
        <Link
            href="/notifications"
            aria-label={`Notifications${showBadge ? `, ${badgeCount} unread` : ''}`}
            className={cn(
                'relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors',
                'hover:bg-muted/80 hover:text-foreground',
                'focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none',
                className,
            )}
        >
            <Bell className="size-[18px]" strokeWidth={1.75} />
            {showBadge && (
                <span className="absolute -top-0.5 -right-0.5 flex min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-card">
                    {badgeCount > 9 ? '9+' : badgeCount}
                </span>
            )}
        </Link>
    );
}
