import { usePage } from '@inertiajs/react';
import { Bell, Search } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { HeaderSearch } from '@/components/header-search';
import { ThemeToggleIcon } from '@/components/theme-toggle-icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useInitials } from '@/hooks/use-initials';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const user = auth.user;

    const focusSearch = () => {
        document.querySelector<HTMLInputElement>('[data-header-search]')?.focus();
    };

    return (
        <div className="shrink-0 border-b border-border/60 bg-background">
            <header className="flex h-16 items-center gap-3 px-4 md:gap-4 md:px-6 group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                <div className="flex min-w-0 shrink-0 items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>

                <div className="hidden min-w-0 flex-1 lg:block">
                    <HeaderSearch />
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-lg text-muted-foreground lg:hidden"
                        onClick={focusSearch}
                        aria-label="Search"
                    >
                        <Search className="size-[18px]" />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="relative size-9 rounded-lg text-muted-foreground"
                        aria-label="Notifications"
                    >
                        <Bell className="size-[18px]" />
                        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />
                    </Button>

                    <ThemeToggleIcon />

                    {user && (
                        <div className="hidden items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 py-1.5 pr-3 pl-1.5 md:flex">
                            <Avatar className="size-8">
                                <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <p className="max-w-[160px] truncate text-sm leading-tight">
                                <span className="text-muted-foreground">
                                    Welcome,{' '}
                                </span>
                                <span className="font-semibold text-foreground">
                                    {user.name}
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            </header>

            <div className="border-t border-border/40 px-4 pb-3 lg:hidden">
                <HeaderSearch />
            </div>
        </div>
    );
}
