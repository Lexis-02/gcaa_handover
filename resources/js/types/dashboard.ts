export type DashboardKpi = {
    label: string;
    value: number;
    trend: number | null;
    trend_suffix?: string;
    icon: string;
};

export type PipelineSegment = {
    label: string;
    value: number;
    color: string;
};

export type RecentAsset = {
    id: string;
    name: string;
    status: string;
    department: string | null;
    assignee: string | null;
    updated_at: string | null;
};

export type DashboardStats = {
    role: string;
    kpis: DashboardKpi[];
    pipeline: PipelineSegment[];
    recent: RecentAsset[];
    summary: {
        total_pcs: number;
        complete: number;
        pending_stage_1: number;
        pending_stage_2: number;
        pending_stage_3: number;
        awaiting_return: number;
        completion_rate: number;
    };
};

export type DashboardMeta = {
    title: string;
    subtitle: string;
    greeting: string;
};

export type SharedNavChild = {
    title: string;
    href: string;
    icon: string;
    match?: 'exact' | 'edit';
};

export type SharedNavItem = {
    title: string;
    href: string;
    icon: string;
    badge?: string;
    children?: SharedNavChild[];
};
