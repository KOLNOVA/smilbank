import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "SmilBankJWTSecret2024ChangeMeInProduction");
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || "SmilBankRefreshSecret2024ChangeMeInProduction");

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
}

// Générer un access token
export async function generateAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

// Générer un refresh token
export async function generateRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_REFRESH_SECRET);
}

// Vérifier un access token
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// Vérifier un refresh token
export async function verifyRefreshToken(token: string): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
    return payload as unknown as { sub: string };
  } catch {
    return null;
  }
}

// Définir le refresh token dans un cookie httpOnly
export async function setRefreshTokenCookie(response: Response, token: string) {
  response.headers.set(
    "Set-Cookie",
    `refreshToken=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`
  );
}

// Récupérer le refresh token depuis les cookies
export function getRefreshTokenFromCookie(req: NextRequest): string | undefined {
  return req.cookies.get("refreshToken")?.value;
}

// Récupérer l'access token depuis le header Authorization
export function getAccessTokenFromHeader(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
}
