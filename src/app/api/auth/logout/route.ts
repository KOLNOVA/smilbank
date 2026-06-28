import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, getAccessTokenFromHeader } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const accessToken = getAccessTokenFromHeader(req);
    
    if (accessToken) {
      const payload = await verifyAccessToken(accessToken);
      
      if (payload) {
        // Supprimer le refresh token hash
        await prisma.user.update({
          where: { id: payload.sub },
          data: { refreshTokenHash: null },
        });
        
        // Supprimer toutes les sessions
        await prisma.session.deleteMany({
          where: { userId: payload.sub },
        });
        
        // Logger la déconnexion
        await prisma.auditLog.create({
          data: {
            userId: payload.sub,
            action: "LOGOUT",
            entity: "User",
            entityId: payload.sub,
            ipAddress: req.headers.get("x-forwarded-for") || "unknown",
          },
        });
      }
    }

    // Supprimer le cookie refreshToken
    const response = NextResponse.json({ message: "Déconnexion réussie" });
    response.headers.set(
      "Set-Cookie",
      "refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict"
    );

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
