import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, getAccessTokenFromHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const payload = await verifyAccessToken(accessToken);
  if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { userId: payload.sub },
      orderBy: { createdAt: "desc" },
    });

    const operations = await prisma.operation.findMany({
      where: { userId: payload.sub },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      portfolios: portfolios.map(p => ({
        ...p,
        balance: Number(p.balance),
        totalInvested: Number(p.totalInvested),
        performance: Number(p.performance),
      })),
      operations: operations.map(o => ({
        ...o,
        amount: Number(o.amount),
        balanceBefore: Number(o.balanceBefore),
        balanceAfter: Number(o.balanceAfter),
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
