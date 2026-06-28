import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, getAccessTokenFromHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const payload = await verifyAccessToken(accessToken);
  if (!payload || payload.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const contracts = await prisma.contract.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { firstName: true, lastName: true, email: true } } },
  });

  return NextResponse.json(contracts);
}

export async function POST(req: NextRequest) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const payload = await verifyAccessToken(accessToken);
  if (!payload || payload.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { userId, title, type, reference, description, startDate, endDate } = await req.json();

  if (!userId || !title || !type || !reference) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  const contract = await prisma.contract.create({
    data: {
      userId,
      title,
      type,
      reference,
      description: description || "",
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  await prisma.auditLog.create({
    data: { userId: payload.sub, action: "CONTRACT_CREATED", entity: "Contract", entityId: contract.id },
  });

  return NextResponse.json(contract, { status: 201 });
}
