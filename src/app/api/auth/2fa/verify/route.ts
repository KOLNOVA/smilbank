import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, getAccessTokenFromHeader, generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const payload = await verifyAccessToken(accessToken);
  if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  try {
    const { code } = await req.json();

    if (!code) return NextResponse.json({ error: "Code requis" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, firstName: true, lastName: true, twoFactorCode: true, twoFactorExpires: true },
    });

    if (!user) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    if (!user.twoFactorCode || !user.twoFactorExpires) return NextResponse.json({ error: "Aucun code en attente" }, { status: 400 });
    if (new Date() > user.twoFactorExpires) return NextResponse.json({ error: "Code expiré" }, { status: 400 });
    if (user.twoFactorCode !== code) return NextResponse.json({ error: "Code incorrect" }, { status: 400 });

    // Code valide → effacer le code et générer les vrais tokens
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorCode: null, twoFactorExpires: null, lastLoginAt: new Date() },
    });

    const newAccessToken = await generateAccessToken({ sub: user.id, email: user.email, role: user.role });
    const newRefreshToken = await generateRefreshToken(user.id);
    const refreshHash = await bcrypt.hash(newRefreshToken, 10);

    await prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash: refreshHash } });
    await prisma.session.create({ data: { userId: user.id, token: refreshHash, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });

    const response = NextResponse.json({
      accessToken: newAccessToken,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    });

    await setRefreshTokenCookie(response, newRefreshToken);
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
