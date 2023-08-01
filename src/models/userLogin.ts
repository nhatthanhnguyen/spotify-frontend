export interface userLogin {
    account: {
        user_id: number;
        username: string;
        code: string;
        role: string;
        status: string;
    },
    error: string | null | undefined;
}