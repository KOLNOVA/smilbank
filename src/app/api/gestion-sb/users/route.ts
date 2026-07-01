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
    select: {
      id: true, email: true, firstName: true, lastName: true, role: true, status: true, createdAt: true,
      portfolios: { select: { balance: true, currency: true } },
      _count: { select: { contracts: true } },
    },
  });

  return NextResponse.json(
    users.map(u => ({
      ...u,
      portfolio: u.portfolios[0]?.balance || 0,
      currency: u.portfolios[0]?.currency || "EUR",
      contracts: u._count.contracts,
      portfolios: undefined,
    }))
  );
}

export async function POST(req: NextRequest) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const payload = await verifyAccessToken(accessToken);
  if (!payload || payload.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { email, password, firstName, lastName, currency, initialBalance } = await req.json();

  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: "CLIENT",
      status: "ACTIVE",
      isEmailVerified: true,
      isTwoFactorEnabled: false,
    },
  });

  // Créer un portefeuille initial si une devise est fournie
  if (currency) {
    await prisma.portfolio.create({
      data: {
        name: "Portefeuille Principal",
        balance: parseFloat(initialBalance) || 0,
        totalInvested: 0,
        performance: 0,
        currency: currency,
        userId: user.id,
      },
    });
  }

  return NextResponse.json(
    { message: "Client créé avec succès", user: { id: user.id, email: user.email } },
    { status: 201 }
  );
}
