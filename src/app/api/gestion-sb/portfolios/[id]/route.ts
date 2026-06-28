import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, getAccessTokenFromHeader } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const payload = await verifyAccessToken(accessToken);
  if (!payload || payload.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  
  console.log("📥 [PORTFOLIO UPDATE] body reçu:", body);

  const updateData: any = {};
  if (body.balance !== undefined) updateData.balance = Number(body.balance);
  if (body.totalInvested !== undefined) updateData.totalInvested = Number(body.totalInvested);
  if (body.performance !== undefined) updateData.performance = Number(body.performance);
  if (body.name) updateData.name = body.name;

  console.log("📤 [PORTFOLIO UPDATE] updateData:", updateData);

  const portfolio = await prisma.portfolio.update({
    where: { id },
    data: updateData,
  });

  console.log("✅ [PORTFOLIO UPDATE] réussi:", portfolio.id);

  await prisma.auditLog.create({
    data: {
      userId: payload.sub,
      action: "PORTFOLIO_UPDATED",
      entity: "Portfolio",
      entityId: id,
      details: { updatedFields: Object.keys(updateData), values: updateData },
    },
  });

  // Convertir les Decimal en Number pour la réponse JSON
  return NextResponse.json({
    ...portfolio,
    balance: Number(portfolio.balance),
    totalInvested: Number(portfolio.totalInvested),
    performance: Number(portfolio.performance),
  });
}
