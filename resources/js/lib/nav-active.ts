import type { InertiaLinkProps } from '@inertiajs/react';
import { toUrl } from '@/lib/utils';
import type { NavChildItem } from '@/types';

export function isNavChildActive(
    child: NavChildItem,
    currentPath: string,
): boolean {
    const hrefPath = toUrl(child.href).replace(/\/$/, '') || '/';
    const path = currentPath.replace(/\/$/, '') || '/';
    const match = child.match ?? 'exact';

    if (match === 'edit') {
        return /^\/pc-register\/\d+\/edit$/.test(path);
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
    const hrefPath = toUrl(href).replace(/\/$/, '') || '/';
    const path = currentPath.replace(/\/$/, '') || '/';

    return exact
        ? path === hrefPath
        : path === hrefPath || path.startsWith(`${hrefPath}/`);
}
