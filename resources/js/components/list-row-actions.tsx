import { Link, router } from '@inertiajs/react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { confirmDelete } from '@/lib/sweetalert';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type ListRowActionsProps = {
    viewHref: string;
    editHref?: string;
    deleteUrl?: string;
    itemLabel?: string;
    showEdit?: boolean;
    showDelete?: boolean;
    className?: string;
};

export function ListRowActions({
    viewHref,
    editHref,
    deleteUrl,
    itemLabel = 'this record',
    showEdit = true,
    showDelete = true,
    className,
}: ListRowActionsProps) {
    const handleDelete = async () => {
        if (!deleteUrl) {
            return;
        }

        const confirmed = await confirmDelete(itemLabel);

        if (!confirmed) {
            return;
        }

        router.delete(deleteUrl, { preserveScroll: true });
    };

    return (
        <div className={cn('flex items-center justify-end gap-1', className)}>
            <Button asChild variant="ghost" size="icon" className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground" title="View">
                <Link href={viewHref}>
                    <Eye className="size-4" />
                </Link>
            </Button>
            {showEdit && editHref && (
                <Button asChild variant="ghost" size="icon" className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground" title="Edit">
                    <Link href={editHref}>
                        <Pencil className="size-4" />
                    </Link>
                </Button>
            )}
            {showDelete && deleteUrl && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Delete"
                    onClick={handleDelete}
                >
                    <Trash2 className="size-4" />
                </Button>
            )}
        </div>
    );
}
