import jwt, {} from "jsonwebtoken";
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is missing");
    }
    return secret;
}
export function requireAuth(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        res.status(401).json({
            success: false,
            message: "Authentication token is required",
        });
        return;
    }
    const [scheme, token] = authorizationHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        res.status(401).json({
            success: false,
            message: "Invalid authorization header format",
        });
        return;
    }
    try {
        const decoded = jwt.verify(token, getJwtSecret());
        if (!decoded.userId) {
            res.status(401).json({
                success: false,
                message: "Invalid authentication token",
            });
            return;
        }
        req.user = {
            id: decoded.userId,
        };
        next();
    }
    catch {
        res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token",
        });
    }
}
//# sourceMappingURL=auth.middleware.js.map