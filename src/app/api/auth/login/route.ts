import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "@/lib/auth";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json({ error: "Compte inactif ou suspendu" }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    // Générer les tokens
    const accessToken = await generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = await generateRefreshToken(user.id);
    const refreshHash = await bcrypt.hash(refreshToken, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lastLoginAt: new Date(), refreshTokenHash: refreshHash },
    });

    const response = NextResponse.json({
      accessToken,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    });

    await setRefreshTokenCookie(response, refreshToken);
    return response;
  } catch (error: any) {
    console.error("LOGIN ERROR:", error?.message || error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
