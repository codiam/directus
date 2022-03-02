export declare type Role = {
    id: string;
    name: string;
    description: string;
    enforce_2fa: null | boolean;
    external_id: null | string;
    ip_whitelist: string[];
    app_access: boolean;
    admin_access: boolean;
};
export declare type Avatar = {
    id: string;
};
export declare type User = {
    id: string;
    status: string;
    first_name: string;
    last_name: string;
    email: string;
    token: string;
    last_login: string;
    last_page: string;
    external_id: string;
    '2fa_secret': string;
    theme: 'auto' | 'dark' | 'light';
    role: Role;
    password_reset_token: string | null;
    timezone: string;
    language: string;
    avatar: null | Avatar;
    company: string | null;
    title: string | null;
    email_notifications: boolean;
};
//# sourceMappingURL=users.d.ts.map