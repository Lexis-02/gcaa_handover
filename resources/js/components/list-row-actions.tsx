import { Link, router } from '@inertiajs/react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { confirmDelete } from '@/lib/sweetalert';
import { cn } from '@/lib/utils';

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

    const iconBtn =
        'inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';

    return (
        <div className={cn('flex items-center justify-end gap-0.5', className)}>
            <Link href={viewHref} className={iconBtn} title="View">
                <Eye className="size-4" />
            </Link>
            {showEdit && editHref && (
                <Link href={editHref} className={iconBtn} title="Edit">
                    <Pencil className="size-4" />
                </Link>
            )}
            {showDelete && deleteUrl && (
                <button
                    type="button"
                    className={cn(
                        iconBtn,
                        'hover:bg-destructive/10 hover:text-destructive',
                    )}
                    title="Delete"
                    onClick={handleDelete}
                >
                    <Trash2 className="size-4" />
                </button>
            )}
        </div>
    );
}
