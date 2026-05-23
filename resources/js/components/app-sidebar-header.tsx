import { usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { HeaderIconButton } from '@/components/header-icon-button';
import { HeaderSearch } from '@/components/header-search';
import { NotificationBell } from '@/components/notification-bell';
import { ThemeToggleIcon } from '@/components/theme-toggle-icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';

export function AppSidebarHeader({ pageTitle = '' }: { pageTitle?: string }) {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const user = auth.user;

    const focusSearch = () => {
        document.querySelector<HTMLInputElement>('[data-header-search]')?.focus();
    };

    return (
        <div className="z-40 shrink-0 border-b border-border/50 bg-card shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
            <header className="flex h-[4.25rem] items-center gap-3 px-4 md:gap-5 md:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-2.5">
                    <SidebarTrigger
                        className={cn(
                            'size-8 rounded-lg text-muted-foreground',
                            'hover:bg-muted/80 hover:text-foreground',
                        )}
                    />
                    <div className="hidden h-5 w-px bg-border/80 sm:block" />
                    {pageTitle ? (
                        <h1 className="truncate text-base font-semibold tracking-tight text-foreground md:text-lg">
                            {pageTitle}
                        </h1>
                    ) : null}
                </div>

                <div className="mx-auto hidden w-full max-w-xl min-w-0 flex-1 px-2 lg:block">
                    <HeaderSearch />
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-1">
                    <div className="flex items-center gap-0.5 rounded-lg border border-border/50 bg-muted/30 p-0.5">
                        <HeaderIconButton
                            icon={Search}
                            label="Search"
                            className="size-8 lg:hidden"
                            onClick={focusSearch}
                        />
                        <NotificationBell className="size-8" />
                        <ThemeToggleIcon className="size-8" />
                    </div>

                    {user && (
                        <>
                            <div className="mx-1 hidden h-8 w-px bg-border/70 md:block" />
                            <div className="hidden items-center gap-2.5 rounded-lg border border-border/50 bg-background py-1 pr-3 pl-1 shadow-sm md:flex">
                                <Avatar className="size-8 border border-border/40">
                                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <p className="max-w-[11rem] truncate text-sm leading-snug">
                                    <span className="text-muted-foreground">
                                        Welcome,{' '}
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {user.name}
                                    </span>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </header>

            <div className="border-t border-border/40 bg-muted/20 px-4 py-3 lg:hidden">
                <HeaderSearch className="max-w-none" />
            </div>
        </div>
    );
}
