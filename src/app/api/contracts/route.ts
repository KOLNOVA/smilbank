import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, getAccessTokenFromHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const payload = await verifyAccessToken(accessToken);
  if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  try {
    const contracts = await prisma.contract.findMany({
      where: { userId: payload.sub },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(contracts);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
