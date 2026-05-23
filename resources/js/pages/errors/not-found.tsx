import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, LayoutDashboard, SearchX } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { pageEnter } from '@/lib/motion';

type PageProps = {
    status?: number;
    message?: string;
};

function titleForStatus(status: number): string {
    switch (status) {
        case 403:
            return 'Access denied';
        case 500:
        case 503:
            return 'Server error';
        default:
            return 'Page not found';
    }
}

export default function NotFound({
    status = 404,
    message = 'The page you requested could not be found. It may have been moved, removed, or the address may be incorrect.',
}: PageProps) {
    const { auth } = usePage<{ auth: { user: unknown } | null }>().props;
    const isAuthenticated = Boolean(auth?.user);

    return (
        <>
            <Head title={titleForStatus(status)} />
            <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
                <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                        background:
                            'radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, var(--color-primary-400) 35%, transparent), transparent)',
                    }}
                />
                <div className="pointer-events-none absolute -right-24 top-1/3 size-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute -left-16 bottom-1/4 size-56 rounded-full bg-primary/5 blur-3xl" />

                <header className="relative z-10 border-b border-border/50 px-4 py-4 md:px-8">
                    <Link
                        href={isAuthenticated ? dashboard() : '/login'}
                        className="inline-flex max-w-xs items-center"
                    >
                        <AppLogo />
                    </Link>
                </header>

                <motion.main
                    className="relative z-10 mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16 text-center md:px-8"
                    variants={pageEnter}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                        className="mb-6 flex size-24 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-1 ring-primary/20"
                    >
                        <SearchX className="size-12" strokeWidth={1.5} />
                    </motion.div>

                    <p className="font-mono text-sm font-semibold tracking-widest text-primary uppercase">
                        Error {status}
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                        Page not found
                    </h1>
                    <p className="mt-4 max-w-md text-base text-muted-foreground">
                        {message}
                    </p>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="gap-2"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="size-4" />
                            Go back
                        </Button>
                        {isAuthenticated ? (
                            <Button asChild size="lg" className="gap-2">
                                <Link href={dashboard()}>
                                    <LayoutDashboard className="size-4" />
                                    Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild size="lg" className="gap-2">
                                <Link href="/login">
                                    <Home className="size-4" />
                                    Sign in
                                </Link>
                            </Button>
                        )}
                    </div>
                </motion.main>

                <footer className="relative z-10 border-t border-border/50 px-4 py-4 text-center text-xs text-muted-foreground">
                    Ghana Civil Aviation Authority — PC Handover System
                </footer>
            </div>
        </>
    );
}

NotFound.layout = null;
