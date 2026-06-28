import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, firstName: true, lastName: true, role: true, status: true, loginAttempts: true, isTwoFactorEnabled: true },
    });

    if (!user) return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    if (user.status === "LOCKED") return NextResponse.json({ error: "Compte verrouillé" }, { status: 403 });
    if (user.status === "SUSPENDED") return NextResponse.json({ error: "Compte suspendu" }, { status: 403 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      await prisma.user.update({ where: { id: user.id }, data: { loginAttempts: { increment: 1 } } });
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    // Si 2FA désactivé → connexion directe
    if (!user.isTwoFactorEnabled) {
      const accessToken = await generateAccessToken({ sub: user.id, email: user.email, role: user.role });
      const refreshToken = await generateRefreshToken(user.id);
      const refreshHash = await bcrypt.hash(refreshToken, 10);

      await prisma.user.update({ where: { id: user.id }, data: { loginAttempts: 0, lastLoginAt: new Date(), lastLoginIp: req.headers.get("x-forwarded-for") || "unknown", refreshTokenHash: refreshHash } });
      await prisma.session.create({ data: { userId: user.id, token: refreshHash, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });

      const response = NextResponse.json({
        accessToken,
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      });

      await setRefreshTokenCookie(response, refreshToken);
      return response;
    }

    // Si 2FA activé → retourner un token temporaire
    const tempToken = await generateAccessToken({ sub: user.id, email: user.email, role: user.role });
    return NextResponse.json({ accessToken: tempToken, require2FA: true, message: "Code 2FA requis" });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
