import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, getAccessTokenFromHeader } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const payload = await verifyAccessToken(accessToken);
  if (!payload || payload.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { userId, name, balance, totalInvested, performance } = await req.json();

  if (!userId || !name) {
    return NextResponse.json({ error: "userId et name requis" }, { status: 400 });
  }

  const portfolio = await prisma.portfolio.create({
    data: {
      name,
      balance: balance || 0,
      totalInvested: totalInvested || 0,
      performance: performance || 0,
      userId,
    },
  });

  await prisma.auditLog.create({
    data: { userId: payload.sub, action: "PORTFOLIO_CREATED", entity: "Portfolio", entityId: portfolio.id },
  });

  return NextResponse.json(portfolio, { status: 201 });
}
