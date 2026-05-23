import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type LookupPageHeaderProps = {
    addHref: string;
    addLabel?: string;
};

export function LookupPageHeader({
    addHref,
    addLabel = 'Add',
}: LookupPageHeaderProps) {
    return (
        <div className="flex justify-end">
            <Button asChild size="sm">
                <Link href={addHref}>
                    <Plus className="size-4" />
                    {addLabel}
                </Link>
            </Button>
        </div>
    );
}
