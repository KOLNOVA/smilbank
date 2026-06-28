import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, getAccessTokenFromHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const payload = await verifyAccessToken(accessToken);
  if (!payload || payload.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const [totalUsers, totalContracts, totalBalance, recentUsers] = await Promise.all([
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.contract.count(),
    prisma.portfolio.aggregate({ _sum: { balance: true } }),
    prisma.user.findMany({ where: { role: "CLIENT" }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, email: true, firstName: true, lastName: true, status: true, createdAt: true, portfolios: { select: { balance: true } } } }),
  ]);

  return NextResponse.json({
    totalUsers, totalContracts,
    totalUnderManagement: totalBalance._sum.balance || 0,
    recentUsers: recentUsers.map(u => ({ ...u, portfolio: u.portfolios[0]?.balance || 0, portfolios: undefined })),
  });
}
