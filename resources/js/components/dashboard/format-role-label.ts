const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    ict_admin: 'ICT Admin',
    stores_officer: 'Stores Officer',
    director: 'Director',
    end_user: 'End User',
    auditor: 'Auditor',
};

export function formatRoleLabel(role: string): string {
    return roleLabels[role] ?? role.replace(/_/g, ' ');
}
