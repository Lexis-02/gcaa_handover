export type User = {
    id: number;
    name: string;
    username: string;
    department_id?: number | null;
    is_active?: boolean;
    roles: string[];
    permissions: string[];
    primary_role: string;
    avatar?: string;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
};

export type Auth = {
    user: User | null;
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */
