import { Link, router } from '@inertiajs/react';
import { LogOut, Settings, Sun, Moon, Monitor, Palette, Check } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useAppearance } from '@/hooks/use-appearance';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();
    const { appearance, updateAppearance } = useAppearance();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                        <Palette className="mr-2 text-muted-foreground" />
                        Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-36">
                        <DropdownMenuItem onClick={() => updateAppearance('light')} className="cursor-pointer flex items-center justify-between">
                            <span className="flex items-center">
                                <Sun className="mr-2 h-4 w-4" />
                                Light
                            </span>
                            {appearance === 'light' && <Check className="h-4 w-4 text-accent" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateAppearance('dark')} className="cursor-pointer flex items-center justify-between">
                            <span className="flex items-center">
                                <Moon className="mr-2 h-4 w-4" />
                                Dark
                            </span>
                            {appearance === 'dark' && <Check className="h-4 w-4 text-accent" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateAppearance('system')} className="cursor-pointer flex items-center justify-between">
                            <span className="flex items-center">
                                <Monitor className="mr-2 h-4 w-4" />
                                System
                            </span>
                            {appearance === 'system' && <Check className="h-4 w-4 text-accent" />}
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
