import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, getAccessTokenFromHeader } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const payload = await verifyAccessToken(accessToken);
  if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  try {
    // Générer un code à 6 chiffres
    const code = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: payload.sub },
      data: { twoFactorCode: code, twoFactorExpires: expires },
    });

    // Simuler l'envoi d'email (dans la vraie vie, utiliser Resend, SendGrid, etc.)
    console.log(`📧 [2FA] Code envoyé à ${payload.email}: ${code}`);
    
    // Logger
    await prisma.auditLog.create({
      data: { userId: payload.sub, action: "2FA_CODE_SENT", entity: "User", entityId: payload.sub },
    });

    return NextResponse.json({ message: "Code envoyé par email", expiresIn: 600 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
