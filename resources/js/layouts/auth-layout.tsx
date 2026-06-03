import AppLogo from '@/components/app-logo';
import { FlashAlerts } from '@/components/flash-alerts';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const SLIDE_IMAGES = [
    '/assets/computer.png',
    '/assets/slide1.jpg',
    '/assets/slide2.jpg',
    '/assets/slide3.jpg',
    '/assets/slide4.jpg',
    '/assets/login_bg_desk.png',
    '/assets/login_bg_server.png',
    '/assets/login_bg_laptop.png',
];

const SLIDE_INTERVAL = 6000;

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted ? resolvedAppearance === 'dark' : false;

    const [currentSlide, setCurrentSlide] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Auto-advance — simply changes the index, CSS handles everything else
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
        }, SLIDE_INTERVAL);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const handleDotClick = (index: number) => {
        if (index === currentSlide) return;
        setCurrentSlide(index);
        // Reset interval so it doesn't fire right after manual click
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
        }, SLIDE_INTERVAL);
    };

    return (
        <div
            className={`relative flex min-h-screen flex-col overflow-hidden font-sans transition-colors duration-300 md:flex-row ${
                isDark
                    ? 'bg-[#020617] text-slate-100'
                    : 'bg-slate-50 text-slate-800'
            }`}
        >
            <FlashAlerts />
            {/* ── LEFT PANEL: 65% — cinematic image slideshow ─────────────────── */}
            <div className="relative hidden shrink-0 overflow-hidden md:block md:w-[65%]">
                {/*
                    All slides are ALWAYS mounted. Only CSS opacity + transition
                    controls visibility — no mount/unmount = absolutely no flash.
                    Ken Burns runs continuously on every slide (infinite alternate).
                */}
                {SLIDE_IMAGES.map((src, index) => (
                    <div
                        key={src}
                        className="absolute inset-0"
                        style={{
                            opacity: index === currentSlide ? 1 : 0,
                            zIndex: index === currentSlide ? 1 : 0,
                            transition: 'opacity 2s ease-in-out',
                        }}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
                            style={{
                                backgroundImage: `url("${src}")`,
                                animation: `kb${index % 5} ${SLIDE_INTERVAL * 3}ms ease-in-out infinite alternate`,
                            }}
                        />
                    </div>
                ))}

                {/* Light overlay — visible diagonal light wash */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        zIndex: 2,
                        background: `
                            linear-gradient(
                                160deg,
                                rgba(255, 255, 255, 0.25) 0%,
                                rgba(255, 255, 255, 0.12) 25%,
                                transparent 55%
                            )
                        `,
                    }}
                />

                {/* Bottom / left edge darkening for contrast with panel */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        zIndex: 3,
                        background: `
                            linear-gradient(to top,  rgba(2,6,23,0.50) 0%, transparent 40%),
                            linear-gradient(to left, rgba(2,6,23,0.20) 0%, transparent 25%)
                        `,
                    }}
                />

                {/* Slide indicators */}
                <div
                    className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2.5"
                    style={{ zIndex: 5 }}
                >
                    {SLIDE_IMAGES.map((_, index) => {
                        const isActive = index === currentSlide;
                        return (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className="group relative h-1.5 cursor-pointer overflow-hidden rounded-full"
                                style={{
                                    width: isActive ? '32px' : '12px',
                                    backgroundColor: isActive
                                        ? 'rgba(255,255,255,0.9)'
                                        : 'rgba(255,255,255,0.35)',
                                    transition:
                                        'width 0.5s ease, background-color 0.5s ease',
                                }}
                                aria-label={`Go to slide ${index + 1}`}
                            >
                                {isActive && (
                                    <span
                                        key={`p-${currentSlide}`}
                                        className="absolute inset-y-0 left-0 rounded-full bg-white/60"
                                        style={{
                                            animation: `progressFill ${SLIDE_INTERVAL}ms linear forwards`,
                                        }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── RIGHT PANEL: 35% — auth form ───────────────────────────────── */}
            <div
                className={`flex min-h-screen flex-1 flex-col px-8 py-6 transition-colors duration-300 md:w-[35%] md:px-10 md:py-10 ${
                    isDark ? 'bg-[#020617]' : 'bg-slate-50'
                }`}
                style={{ zIndex: 20 }}
            >
                {/* Dark / light mode icon toggle */}
                <div className="flex justify-end">
                    <button
                        onClick={() =>
                            updateAppearance(isDark ? 'light' : 'dark')
                        }
                        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 ${
                            isDark
                                ? 'border-slate-700 bg-slate-800 text-amber-400 hover:border-slate-600 hover:bg-slate-700 hover:text-amber-300'
                                : 'border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-100 hover:text-slate-700'
                        }`}
                        title={
                            isDark
                                ? 'Switch to light mode'
                                : 'Switch to dark mode'
                        }
                    >
                        {isDark ? (
                            <Sun className="h-4 w-4 transition-transform duration-300 hover:rotate-45" />
                        ) : (
                            <Moon className="h-4 w-4 transition-transform duration-300 hover:-rotate-12" />
                        )}
                    </button>
                </div>

                {/* Auth form — centred vertically */}
                <div className="mx-auto flex w-full max-w-[380px] flex-1 flex-col justify-center py-8">
                    <div className="mb-8">
                        <AppLogo variant="auth" />
                    </div>

                    <div className="mb-7 space-y-2">
                        <h1
                            className={`text-xl leading-tight font-bold tracking-tight ${
                                isDark ? 'text-white' : 'text-slate-900'
                            }`}
                        >
                            {title}
                        </h1>
                        {description && (
                            <p
                                className={`text-sm leading-snug ${
                                    isDark ? 'text-slate-400' : 'text-slate-500'
                                }`}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {children}
                </div>

                {/* Footer */}
                <div
                    className={`text-center text-[10px] tracking-wider uppercase ${
                        isDark ? 'text-slate-600' : 'text-slate-400'
                    }`}
                >
                    &copy; {new Date().getFullYear()} Ghana Civil Aviation
                    Authority (GCAA). All rights reserved.
                </div>
            </div>

            {/* ── Global keyframes ────────────────────────────────────────────── */}
            <style>{`
                @keyframes kb0 {
                    0%   { transform: scale(1)    translate(0, 0); }
                    100% { transform: scale(1.15) translate(-2%, -1.5%); }
                }
                @keyframes kb1 {
                    0%   { transform: scale(1.04) translate(1%, 0); }
                    100% { transform: scale(1.18) translate(-1.5%, -2%); }
                }
                @keyframes kb2 {
                    0%   { transform: scale(1)    translate(-1%, 1%); }
                    100% { transform: scale(1.16) translate(1.5%, -1%); }
                }
                @keyframes kb3 {
                    0%   { transform: scale(1.06) translate(0, -1%); }
                    100% { transform: scale(1.20) translate(-2%, 1.5%); }
                }
                @keyframes kb4 {
                    0%   { transform: scale(1.02) translate(1%, 1%); }
                    100% { transform: scale(1.17) translate(-1%, -0.5%); }
                }
                @keyframes progressFill {
                    0%   { width: 0; }
                    100% { width: 100%; }
                }
            `}</style>
        </div>
    );
}
