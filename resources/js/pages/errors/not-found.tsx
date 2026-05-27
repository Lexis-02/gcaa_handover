import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, LayoutDashboard } from 'lucide-react';
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
            <div className="flex min-h-svh bg-background">
                {/* Left Side - Content */}
                <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:flex-none lg:w-[48rem] lg:px-20 xl:px-24">
                    <motion.div 
                        className="mx-auto w-full max-w-md lg:max-w-xl"
                        variants={pageEnter}
                        initial="hidden"
                        animate="visible"
                    >
                        <header className="mb-16">
                            <Link
                                href={isAuthenticated ? dashboard() : '/login'}
                                className="inline-flex items-center cursor-pointer"
                            >
                                <AppLogo variant="auth" />
                            </Link>
                        </header>

                        <div>
                            <p className="font-mono text-sm font-semibold tracking-widest text-primary uppercase mb-3">
                                Error {status}
                            </p>
                            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                {titleForStatus(status)}
                            </h1>
                            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
                                {message}
                            </p>
                        </div>

                        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto gap-2 cursor-pointer"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="size-4" />
                                Go back
                            </Button>
                            {isAuthenticated ? (
                                <Button asChild size="lg" className="w-full sm:w-auto gap-2 cursor-pointer">
                                    <Link href={dashboard()}>
                                        <LayoutDashboard className="size-4" />
                                        Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <Button asChild size="lg" className="w-full sm:w-auto gap-2 cursor-pointer">
                                    <Link href="/login">
                                        <Home className="size-4" />
                                        Sign in
                                    </Link>
                                </Button>
                            )}
                        </div>

                        <footer className="mt-24 text-sm text-muted-foreground border-t border-border/50 pt-8">
                            &copy; {new Date().getFullYear()} Ghana Civil Aviation Authority — PC Handover System
                        </footer>
                    </motion.div>
                </div>

                {/* Right Side - Visual */}
                <div className="relative hidden w-0 flex-1 lg:block bg-muted/20 border-l border-border/50 overflow-hidden">
                    {/* Abstract grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[20rem] xl:text-[28rem] font-black tracking-tighter text-muted/30 select-none drop-shadow-sm">
                            {status}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

NotFound.layout = null;
