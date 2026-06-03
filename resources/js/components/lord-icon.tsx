import React from 'react';

export type LordIconProps = {
    src: string;
    trigger?:
        | 'hover'
        | 'click'
        | 'loop'
        | 'loop-on-hover'
        | 'morph'
        | 'morph-two-way'
        | 'in';
    colors?: string;
    size?: number | string;
    className?: string;
    delay?: number;
    state?: string;
};

export function LordIcon({
    src,
    trigger = 'hover',
    colors = 'primary:#1990cf,secondary:#6b7280',
    size = 24,
    className,
    delay,
    state,
}: LordIconProps) {
    return React.createElement('lord-icon', {
        src,
        trigger,
        colors,
        style: { width: size, height: size },
        class: className,
        delay,
        state,
    });
}
