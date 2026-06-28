import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, getAccessTokenFromHeader } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const payload = await verifyAccessToken(accessToken);
  if (!payload || payload.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, email: true, firstName: true, lastName: true, phone: true,
      role: true, status: true, isEmailVerified: true, createdAt: true,
      portfolios: { select: { id: true, name: true, balance: true, performance: true, totalInvested: true } },
      contracts: { select: { id: true, title: true, reference: true, status: true } },
      _count: { select: { investments: true } },
    },
  });

  if (!user) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const payload = await verifyAccessToken(accessToken);
  if (!payload || payload.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { id } = await params;
  const { firstName, lastName, email, phone, status, password } = await req.json();

  const updateData: any = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (email) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (status) updateData.status = status;
  if (password && password.length >= 8) {
    updateData.password = await bcrypt.hash(password, 12);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, email: true, firstName: true, lastName: true, status: true },
  });

  return NextResponse.json(user);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const payload = await verifyAccessToken(accessToken);
  if (!payload || payload.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { id } = await params;

  // Empêcher de supprimer son propre compte
  if (id === payload.sub) {
    return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte" }, { status: 400 });
  }

  // Supprimer toutes les données liées (Prisma s'en charge avec onDelete: Cascade)
  await prisma.user.delete({ where: { id } });

  await prisma.auditLog.create({
    data: { userId: payload.sub, action: "USER_DELETED", entity: "User", entityId: id },
  });

  return NextResponse.json({ message: "Utilisateur supprimé" });
}
