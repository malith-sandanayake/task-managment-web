import jwt, { type SignOptions } from 'jsonwebtoken';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  return secret;
}

const JWT_SECRET: string = getJwtSecret();

export function generateToken(userId: number): string{
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? '1d') as NonNullable<SignOptions['expiresIn']>;

    return jwt.sign(
        { userId },
        JWT_SECRET,
        {
      expiresIn,
        },
    );
}