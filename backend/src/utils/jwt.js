import jwt, {} from 'jsonwebtoken';
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is missing");
    }
    return secret;
}
const JWT_SECRET = getJwtSecret();
export function generateToken(userId) {
    const expiresIn = (process.env.JWT_EXPIRES_IN ?? '1d');
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn,
    });
}
//# sourceMappingURL=jwt.js.map