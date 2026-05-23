import { cn } from '@/lib/utils';

type AppLogoProps = {
    className?: string;
    /** Larger variant for auth / marketing surfaces */
    variant?: 'sidebar' | 'auth';
};

export default function AppLogo({
    className,
    variant = 'sidebar',
}: AppLogoProps) {
    const isAuth = variant === 'auth';

    return (
        <div
            className={cn(
                'flex min-w-0 flex-1 items-center',
                isAuth ? 'gap-4' : 'gap-3.5',
                'group-data-[collapsible=icon]/sidebar-wrapper:justify-center group-data-[collapsible=icon]/sidebar-wrapper:gap-0',
                className,
            )}
        >
            <img
                src="/assets/logo.png"
                alt="GCAA"
                className={cn(
                    'shrink-0 object-contain',
                    isAuth
                        ? 'h-[4.5rem] w-[4.5rem]'
                        : 'size-[3.25rem] group-data-[collapsible=icon]/sidebar-wrapper:size-10',
                )}
            />
            <div
                className={cn(
                    'min-w-0 flex-1',
                    !isAuth &&
                        'group-data-[collapsible=icon]/sidebar-wrapper:hidden',
                )}
            >
                <span
                    className={cn(
                        'block truncate font-bold leading-tight tracking-tight',
                        isAuth
                            ? 'text-2xl text-slate-900 sm:text-[1.65rem] dark:text-white'
                            : 'text-xl text-sidebar-foreground',
                    )}
                >
                    PC Handover
                </span>
            </div>
        </div>
    );
}
