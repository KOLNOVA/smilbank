import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyAccessToken, getAccessTokenFromHeader } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // 🔒 VÉRIFICATION ADMIN UNIQUEMENT
    const accessToken = getAccessTokenFromHeader(req);
    if (!accessToken) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Accès réservé aux administrateurs" }, { status: 403 });
    }

    const { email, password, firstName, lastName, phone } = await req.json();

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Tous les champs obligatoires doivent être remplis" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères" }, { status: 400 });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        role: "CLIENT",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    // Logger la création
    await prisma.auditLog.create({
      data: {
        userId: payload.sub, // L'admin qui a créé le compte
        action: "USER_CREATED",
        entity: "User",
        entityId: user.id,
        details: { createdUser: user.email },
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      },
    });

    return NextResponse.json(
      { message: "Compte client créé avec succès", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
