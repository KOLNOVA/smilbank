import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, getAccessTokenFromHeader } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const payload = await verifyAccessToken(accessToken);
  if (!payload || payload.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, status: true, createdAt: true, portfolios: { select: { balance: true } }, _count: { select: { contracts: true } } },
  });
  return NextResponse.json(users.map(u => ({ ...u, portfolio: u.portfolios[0]?.balance || 0, contracts: u._count.contracts })));
}

export async function POST(req: NextRequest) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const payload = await verifyAccessToken(accessToken);
  if (!payload || payload.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { email, password, firstName, lastName } = await req.json();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
  const user = await prisma.user.create({ data: { email, password: await bcrypt.hash(password, 12), firstName, lastName, role: "CLIENT" } });
  return NextResponse.json({ message: "Client créé", user: { id: user.id, email: user.email } }, { status: 201 });
}
