import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    // Stocker le message dans les logs d'audit (en attendant un vrai système de tickets)
    await prisma.auditLog.create({
      data: {
        action: "CONTACT_FORM",
        entity: "Contact",
        details: { name, email, subject, message },
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      },
    });

    // Ici on pourrait envoyer un email à l'admin avec Resend ou autre

    return NextResponse.json({ message: "Message envoyé avec succès" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
