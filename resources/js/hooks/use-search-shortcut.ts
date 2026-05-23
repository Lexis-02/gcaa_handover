import { useEffect, useRef } from 'react';

export function useSearchShortcut(onActivate: () => void) {
    const handlerRef = useRef(onActivate);
    handlerRef.current = onActivate;

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                handlerRef.current();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);
}
