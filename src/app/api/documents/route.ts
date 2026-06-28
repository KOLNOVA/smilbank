import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, getAccessTokenFromHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const payload = await verifyAccessToken(accessToken);
  if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  try {
    const documents = await prisma.document.findMany({
      where: { userId: payload.sub },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        type: true,
        fileName: true,
        mimeType: true,
        fileSize: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Documents API error:", error);
    return NextResponse.json([], { status: 200 }); // tableau vide en cas d'erreur
  }
}
