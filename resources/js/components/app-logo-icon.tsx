import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="2" y="3" width="20" height="12" rx="2" />
            <line x1="12" y1="15" x2="12" y2="21" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <path d="M17 9l-4-4-4 4" />
            <path d="M13 5v8" />
        </svg>
    );
}
