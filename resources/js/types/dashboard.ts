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
    fill: string;
};

export type PipelineChartPoint = {
    label: string;
    count: number;
    fill: string;
};

export type WeeklyActivityPoint = {
    label: string;
    date: string;
    count: number;
};

export type RecentAsset = {
    id: string;
    name: string;
    status: string;
    department: string | null;
    assignee: string | null;
    updated_at: string | null;
};

export type DashboardInsight = {
    title: string;
    body: string;
    cta: string;
    href: string;
};

export type DashboardStats = {
    role: string;
    kpis: DashboardKpi[];
    pipeline: PipelineSegment[];
    pipeline_chart: PipelineChartPoint[];
    weekly_activity: WeeklyActivityPoint[];
    can_view_register: boolean;
    insight: DashboardInsight;
    summary: {
        total_pcs: number;
        complete: number;
        pending_stage_1: number;
        pending_stage_2: number;
        pending_stage_3: number;
        awaiting_return: number;
        completion_rate: number;
        sign_off_queue: number;
        unread_notifications: number;
    };
};

export type DashboardQuickLink = {
    title: string;
    description: string;
    icon: string;
    href: string;
    badge: number | null;
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
