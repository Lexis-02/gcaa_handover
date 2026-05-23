import { router } from '@inertiajs/react';
import { PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { confirmAction } from '@/lib/sweetalert';
import { cn } from '@/lib/utils';

type SignOffAction = {
    stage: number;
    title: string;
    description: string;
    form_ref: string;
};

type SignOffButtonProps = {
    pcId: number;
    signOff: SignOffAction;
    redirect?: 'queue' | 'register';
    size?: 'default' | 'sm';
    className?: string;
};

export function SignOffButton({
    pcId,
    signOff,
    redirect = 'queue',
    size = 'default',
    className,
}: SignOffButtonProps) {
    const handleSignOff = async () => {
        const confirmed = await confirmAction({
            title: signOff.title,
            text: `${signOff.description} · ${signOff.form_ref}. This action cannot be undone.`,
            confirmText: 'Yes, sign off',
            icon: 'question',
        });

        if (!confirmed) {
            return;
        }

        router.post(`/pc-register/${pcId}/sign-off`, {
            redirect,
        });
    };

    return (
        <Button
            type="button"
            variant="success"
            size={size}
            className={cn(className)}
            onClick={handleSignOff}
        >
            <PenLine className="size-4" strokeWidth={2.25} />
            {signOff.title}
        </Button>
    );
}
