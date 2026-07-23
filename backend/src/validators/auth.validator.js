import { z } from 'zod';
export const loginSchema = z.object({
    email: z.string().trim().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});
//# sourceMappingURL=auth.validator.js.map