import {
    Activity,
    BarChart3,
    BadgeCheck,
    Bell,
    BookOpen,
    Building2,
    CheckCircle,
    ClipboardCheck,
    Circle,
    ClipboardPlus,
    Eye,
    FileText,
    GitBranch,
    Laptop,
    LayoutGrid,
    LifeBuoy,
    Link2,
    Monitor,
    Package,
    Pencil,
    Percent,
    Plus,
    RotateCcw,
    Search,
    ShieldCheck,
    Stamp,
    UserCheck,
    Users,
    type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    'layout-grid': LayoutGrid,
    package: Package,
    monitor: Monitor,
    'clipboard-check': ClipboardCheck,
    stamp: Stamp,
    'user-check': UserCheck,
    'bar-chart-3': BarChart3,
    'shield-check': ShieldCheck,
    users: Users,
    'life-buoy': LifeBuoy,
    'book-open': BookOpen,
    activity: Activity,
    'badge-check': BadgeCheck,
    'building-2': Building2,
    laptop: Laptop,
    bell: Bell,
    'check-circle': CheckCircle,
    'file-text': FileText,
    'git-branch': GitBranch,
    'rotate-ccw': RotateCcw,
    percent: Percent,
    'clipboard-plus': ClipboardPlus,
    search: Search,
    plus: Plus,
    eye: Eye,
    pencil: Pencil,
    circle: Circle,
    'link-2': Link2,
};

export function resolveNavIcon(name?: string): LucideIcon | null {
    if (!name) {
        return null;
    }

    return iconMap[name] ?? LayoutGrid;
}

export function resolveKpiIcon(name?: string): LucideIcon {
    return resolveNavIcon(name) ?? Activity;
}
