import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Laptop,
    AlertCircle,
    Settings2,
    Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageEnter } from '@/lib/motion';
import { cn } from '@/lib/utils';

type HandoverRecord = {
    id: number;
    pc_asset_id: number;
    ref_no: string;
    end_user_name: string | null;
    department_name: string | null;
    old_asset_tag: string | null;
    old_make_model: string;
    old_serial_no: string;
    year_of_purchase: string | null;
    condition: string;
    reason_for_replacement: string;
    data_wiped: string;
    return_action: string;
    return_action_label: string;
    old_hostname?: string | null;
    given_to_fullname?: string | null;
    given_to_staff_number?: string | null;
    given_to_designation?: string | null;
    given_to_telephone?: string | null;
    given_to_department_name?: string | null;
    acc_power_adapter?: boolean;
    acc_carrying_bag?: boolean;
    acc_hdmi_vga?: boolean;
    acc_mouse?: boolean;
    acc_docking_station?: boolean;
    acc_headset?: boolean;
    acc_keyboard?: boolean;
    acc_monitor?: boolean;
    acc_other?: string | null;
    dbw_user_backed_up?: boolean;
    dbw_ict_wiped?: boolean;
    dbw_data_transferred?: boolean;
    dbw_no_wipe_required?: boolean;
    remarks?: string | null;
    created_at: string;
    updated_at: string;
};

type PageProps = {
    record: HandoverRecord;
    meta: {
        can_edit: boolean;
    };
};

function DetailCell({
    label,
    value,
    className,
}: {
    label: string;
    value: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'rounded-lg border border-border/50 bg-muted/15 px-4 py-3',
                className,
            )}
        >
            <dt className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                {label}
            </dt>
            <dd className="mt-1.5 text-sm leading-snug font-medium text-foreground">
                {value ?? '—'}
            </dd>
        </div>
    );
}

function SectionCard({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: any;
    children: React.ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="flex items-center gap-3 border-b border-border/50 bg-muted/25 px-5 py-3.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                </span>
                <h2 className="text-sm font-semibold tracking-tight">
                    {title}
                </h2>
            </div>
            <div className="p-5">{children}</div>
        </section>
    );
}

export default function PcHandoverShow({ record, meta }: PageProps) {
    return (
        <>
            <Head title={`Handover details for ${record.old_make_model}`} />
            <motion.div
                className="mx-auto flex w-full max-w-4xl flex-1 flex-col"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <header
                    className={cn(
                        'sticky top-0 z-20 -mx-4 border-b border-border/60 px-4 py-4 md:-mx-6 md:px-6',
                        'bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80',
                        'shadow-[0_1px_0_0_rgba(0,0,0,0.04)]',
                    )}
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 space-y-2">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="-ml-2 h-8 px-2 text-muted-foreground"
                            >
                                <Link href="/pc-handover">
                                    <ChevronLeft className="size-4" />
                                    Back to handovers
                                </Link>
                            </Button>
                            <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                {record.old_make_model}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Linked PC:{' '}
                                <Link
                                    href={`/pc-register/${record.pc_asset_id}`}
                                    className="text-primary hover:underline"
                                >
                                    {record.ref_no}
                                </Link>
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            {meta.can_edit && (
                                <Button
                                    asChild
                                    variant="default"
                                    size="default"
                                >
                                    <Link
                                        href={`/pc-handover/${record.id}/edit`}
                                    >
                                        <Pencil className="size-4" />
                                        Edit
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
                    <SectionCard title="Old PC Details" icon={Laptop}>
                        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <DetailCell
                                label="Asset tag"
                                value={record.old_asset_tag}
                            />
                            <DetailCell
                                label="Make / model"
                                value={record.old_make_model}
                            />
                            <DetailCell
                                label="Serial number"
                                value={record.old_serial_no}
                            />
                            <DetailCell
                                label="Hostname"
                                value={record.old_hostname}
                            />
                            <DetailCell
                                label="Year of purchase"
                                value={record.year_of_purchase}
                            />
                            <DetailCell
                                label="End user"
                                value={record.end_user_name}
                            />
                            <DetailCell
                                label="Department"
                                value={record.department_name}
                            />
                        </dl>
                    </SectionCard>

                    <SectionCard title="Status & Condition" icon={AlertCircle}>
                        <dl className="grid gap-3 sm:grid-cols-2">
                            <DetailCell
                                label="Condition"
                                value={record.condition}
                            />
                            <DetailCell
                                label="Reason for replacement"
                                value={record.reason_for_replacement}
                            />
                        </dl>
                    </SectionCard>

                    <SectionCard title="Action & Return" icon={Settings2}>
                        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <DetailCell
                                label="Action taken"
                                value={record.return_action_label}
                            />
                            {record.remarks && (
                                <DetailCell
                                    label="Remarks"
                                    value={record.remarks}
                                    className="sm:col-span-2"
                                />
                            )}
                        </dl>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg border border-border/50 bg-muted/15 px-4 py-3">
                                <dt className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    Accessories Returned
                                </dt>
                                <dd className="mt-1.5 text-sm leading-snug font-medium text-foreground">
                                    <ul className="list-inside list-disc">
                                        {record.acc_power_adapter && <li>Power Adapter / Charger</li>}
                                        {record.acc_carrying_bag && <li>Carrying Bag / Case</li>}
                                        {record.acc_hdmi_vga && <li>HDMI / VGA Cable</li>}
                                        {record.acc_mouse && <li>Mouse</li>}
                                        {record.acc_docking_station && <li>Docking Station</li>}
                                        {record.acc_headset && <li>Headset</li>}
                                        {record.acc_keyboard && <li>Keyboard</li>}
                                        {record.acc_monitor && <li>Monitor</li>}
                                        {record.acc_other && <li>Other: {record.acc_other}</li>}
                                        {!record.acc_power_adapter && !record.acc_carrying_bag && !record.acc_hdmi_vga && !record.acc_mouse && !record.acc_docking_station && !record.acc_headset && !record.acc_keyboard && !record.acc_monitor && !record.acc_other && (
                                            <span className="text-muted-foreground italic">None</span>
                                        )}
                                    </ul>
                                </dd>
                            </div>
                            <div className="rounded-lg border border-border/50 bg-muted/15 px-4 py-3">
                                <dt className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    Data Backup & Wipe Confirmation
                                </dt>
                                <dd className="mt-1.5 text-sm leading-snug font-medium text-foreground">
                                    <ul className="list-inside list-disc">
                                        {record.dbw_user_backed_up && <li>User data backed up by end-user</li>}
                                        {record.dbw_ict_wiped && <li>Old PC wiped / sanitized by ICT</li>}
                                        {record.dbw_data_transferred && <li>Data transferred to new PC</li>}
                                        {record.dbw_no_wipe_required && <li>No data wipe required</li>}
                                        {!record.dbw_user_backed_up && !record.dbw_ict_wiped && !record.dbw_data_transferred && !record.dbw_no_wipe_required && (
                                            <span className="text-muted-foreground italic">None</span>
                                        )}
                                    </ul>
                                </dd>
                            </div>
                        </div>
                    </SectionCard>

                    {record.return_action === 'given_to_user' && (
                        <SectionCard
                            title="Given to Another User Details"
                            icon={Laptop}
                        >
                            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <DetailCell
                                    label="Full Name"
                                    value={record.given_to_fullname}
                                />
                                <DetailCell
                                    label="Staff Number"
                                    value={record.given_to_staff_number}
                                />
                                <DetailCell
                                    label="Designation / Job Title"
                                    value={record.given_to_designation}
                                />
                                <DetailCell
                                    label="Department / Unit"
                                    value={record.given_to_department_name}
                                />
                                <DetailCell
                                    label="Telephone / Ext."
                                    value={record.given_to_telephone}
                                />
                            </dl>
                        </SectionCard>
                    )}
                </div>
            </motion.div>
        </>
    );
}

PcHandoverShow.layout = {
    title: 'View Handover',
};
