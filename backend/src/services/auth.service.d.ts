export interface SafeUser {
    id: number;
    name: string;
    email: string;
}
export declare function loginUser(email: string, password: string): Promise<SafeUser | null>;
export declare function getUserById(userId: number): Promise<SafeUser | null>;
//# sourceMappingURL=auth.service.d.ts.map