import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie, verifyRefreshToken, getRefreshTokenFromCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Récupérer le refresh token depuis le cookie
    const refreshToken = getRefreshTokenFromCookie(req);
    
    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token manquant" }, { status: 401 });
    }

    // Vérifier le refresh token
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json({ error: "Refresh token invalide ou expiré" }, { status: 401 });
    }

    // Chercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        status: true,
        refreshTokenHash: true,
      },
    });

    if (!user || !user.refreshTokenHash) {
      return NextResponse.json({ error: "Utilisateur non trouvé ou session invalide" }, { status: 401 });
    }

    // Vérifier le statut
    if (user.status !== "ACTIVE") {
      return NextResponse.json({ error: "Compte inactif ou suspendu" }, { status: 403 });
    }

    // Vérifier que le refresh token correspond au hash stocké
    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      // Potentiel vol de token : supprimer tous les refresh tokens
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenHash: null },
      });
      await prisma.session.deleteMany({ where: { userId: user.id } });
      
      return NextResponse.json({ error: "Session invalide. Veuillez vous reconnecter." }, { status: 401 });
    }

    // Générer de nouveaux tokens
    const newAccessToken = await generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const newRefreshToken = await generateRefreshToken(user.id);

    // Hasher et stocker le nouveau refresh token
    const newRefreshHash = await bcrypt.hash(newRefreshToken, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: newRefreshHash },
    });

    // Créer une nouvelle session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: newRefreshHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || undefined,
      },
    });

    // Réponse
    const response = NextResponse.json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });

    await setRefreshTokenCookie(response, newRefreshToken);

    return response;
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
