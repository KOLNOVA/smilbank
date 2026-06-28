import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, getAccessTokenFromHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const payload = await verifyAccessToken(accessToken);
  if (!payload || payload.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { firstName: true, lastName: true, email: true } } },
  });

  // Convertir les BigInt en Number pour la sérialisation JSON
  const serialized = documents.map(doc => ({
    ...doc,
    fileSize: doc.fileSize ? Number(doc.fileSize) : null,
  }));

  return NextResponse.json(serialized);
}

export async function POST(req: NextRequest) {
  const accessToken = getAccessTokenFromHeader(req);
  if (!accessToken) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const payload = await verifyAccessToken(accessToken);
  if (!payload || payload.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { userId, title, type, fileName } = await req.json();

  if (!userId || !title || !type || !fileName) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  const document = await prisma.document.create({
    data: {
      userId,
      title,
      type,
      fileName,
      filePath: `/documents/${userId}/${fileName}`,
      mimeType: "application/pdf",
      fileSize: 0,
      status: "PRIVATE",
    },
  });

  return NextResponse.json({ ...document, fileSize: Number(document.fileSize) }, { status: 201 });
}
