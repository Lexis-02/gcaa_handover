import type { Transition, Variants } from 'framer-motion';

export const easeOut: Transition['ease'] = [0.4, 0, 0.2, 1];

export const springSnappy: Transition = {
    type: 'spring',
    stiffness: 420,
    damping: 34,
    mass: 0.8,
};

export const springSoft: Transition = {
    type: 'spring',
    stiffness: 280,
    damping: 28,
};

export const pageEnter: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: easeOut },
    },
};

export const pageStagger: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.04 },
    },
};

export const pageItem: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.38, ease: easeOut },
    },
};

export const sidebarList: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.08 },
    },
};

export const sidebarItem: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.32, ease: easeOut },
    },
};

export const dropdownPanel: Variants = {
    closed: {
        height: 0,
        opacity: 0,
        transition: { duration: 0.22, ease: easeOut },
    },
    open: {
        height: 'auto',
        opacity: 1,
        transition: springSoft,
    },
};

export const dropdownChild: Variants = {
    closed: { opacity: 0, x: -8, scale: 0.98 },
    open: (i: number) => ({
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            delay: i * 0.05,
            duration: 0.28,
            ease: easeOut,
        },
    }),
};
