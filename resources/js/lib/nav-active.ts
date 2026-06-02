import type { InertiaLinkProps } from '@inertiajs/react';
import { toUrl } from '@/lib/utils';
import type { NavChildItem } from '@/types';

function getPathname(url: string): string {
    let path = url;
    if (path.startsWith('http')) {
        try {
            path = new URL(path).pathname;
        } catch {}
    }
    return path.replace(/\/$/, '') || '/';
}

export function isNavChildActive(
    child: NavChildItem,
    currentPath: string,
): boolean {
    const hrefPath = getPathname(toUrl(child.href));
    const path = getPathname(currentPath);
    const match = child.match ?? 'exact';

    if (match === 'edit') {
        if (hrefPath.startsWith('/pc-handover')) {
            return /^\/pc-handover\/\d+\/edit$/.test(path);
        }

        if (hrefPath.startsWith('/pc-register')) {
            return /^\/pc-register\/\d+\/edit$/.test(path);
        }

        return false;
    }

    if (match === 'exact') {
        return path === hrefPath;
    }

    return path === hrefPath || path.startsWith(`${hrefPath}/`);
}

export function isNavHrefActive(
    href: NonNullable<InertiaLinkProps['href']>,
    currentPath: string,
    exact = true,
): boolean {
    const hrefPath = getPathname(toUrl(href));
    const path = getPathname(currentPath);

    return exact
        ? path === hrefPath
        : path === hrefPath || path.startsWith(`${hrefPath}/`);
}
