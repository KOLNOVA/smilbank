import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, getAccessTokenFromHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const accessToken = getAccessTokenFromHeader(req);
    if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const payload = await verifyAccessToken(accessToken);
    if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    const userId = payload.sub;

    const portfolio = await prisma.portfolio.findFirst({
      where: { userId, isActive: true },
      orderBy: { createdAt: "desc" },
    });
    const activeContracts = await prisma.contract.count({
      where: { userId, status: "ACTIVE" },
    });
    const investments = await prisma.investment.findMany({
      where: { userId, status: "ACTIVE" },
      select: { id: true, name: true, type: true, amount: true, currentValue: true, returnRate: true, status: true },
    });

    const totalInvested = investments.reduce((acc: number, inv: { amount: any }) => acc + Number(inv.amount), 0);
    const totalCurrentValue = investments.reduce((acc: number, inv: { currentValue: any }) => acc + Number(inv.currentValue), 0);

    const recentOps = await prisma.operation.findMany({
      where: { userId }, orderBy: { createdAt: "desc" }, take: 5,
    });
    const upcomingContracts = await prisma.contract.findMany({
      where: { userId, status: "ACTIVE", endDate: { gte: new Date() } },
      orderBy: { endDate: "asc" }, take: 3,
    });

    return NextResponse.json({
      portfolio: portfolio ? { id: portfolio.id, name: portfolio.name, balance: Number(portfolio.balance), totalInvested: Number(portfolio.totalInvested), performance: Number(portfolio.performance), currency: portfolio.currency } : null,
      stats: { activeContracts, totalInvested, totalCurrentValue, investmentsCount: investments.length, overallReturn: totalInvested > 0 ? (((totalCurrentValue - totalInvested) / totalInvested) * 100).toFixed(2) : "0" },
      investments, recentOperations: recentOps, upcomingContracts,
    });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
