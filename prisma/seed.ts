import { PrismaClient as PrismaClientType } from "@prisma/client";
import bcrypt from "bcryptjs";

// @ts-ignore - PrismaClient généré dynamiquement
const { PrismaClient } = require("@prisma/client") as { PrismaClient: typeof PrismaClientType };
const prisma = new PrismaClient();

async function main() {
  console.log("");
  console.log("🌱 SEED SMIL-BANK - Création des comptes");
  console.log("═══════════════════════════════════════");
  console.log("");

  const password = await bcrypt.hash("Test1234!", 12);

  console.log("👑 Création du SUPER ADMIN...");
  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@smilbank.fr",
      password,
      firstName: "Admin",
      lastName: "SmilBank",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      isEmailVerified: true,
      isTwoFactorEnabled: true,
    },
  });
  console.log(`   ✅ admin@smilbank.fr / Test1234!`);
  console.log("");

  console.log("👤 Création des clients...");
  const clientsData = [
    { email: "jean.dupont@email.com", firstName: "Jean", lastName: "Dupont" },
    { email: "sophie.laurent@email.com", firstName: "Sophie", lastName: "Laurent" },
    { email: "marc.dubois@email.com", firstName: "Marc", lastName: "Dubois" },
    { email: "claire.moreau@email.com", firstName: "Claire", lastName: "Moreau" },
    { email: "pierre.martin@email.com", firstName: "Pierre", lastName: "Martin" },
  ];

  const clients = [];
  for (const c of clientsData) {
    const client = await prisma.user.create({
      data: {
        email: c.email,
        password,
        firstName: c.firstName,
        lastName: c.lastName,
        role: "CLIENT",
        status: "ACTIVE",
        isEmailVerified: true,
        isTwoFactorEnabled: true,
      },
    });
    clients.push(client);
    console.log(`   ✅ ${c.email}`);
  }
  console.log("");

  console.log("💰 Création des portefeuilles...");
  await prisma.portfolio.createMany({
    data: [
      { name: "Principal", balance: 250000, totalInvested: 180000, performance: 4.2, userId: clients[0].id },
      { name: "Retraite", balance: 180000, totalInvested: 120000, performance: 3.8, userId: clients[1].id },
      { name: "Dynastie", balance: 420000, totalInvested: 350000, performance: 5.2, userId: clients[2].id },
      { name: "Débutant", balance: 95000, totalInvested: 60000, performance: 2.5, userId: clients[3].id },
    ],
  });
  console.log("   ✅ 4 portefeuilles");
  console.log("");

  console.log("📈 Création des investissements...");
  await prisma.investment.createMany({
    data: [
      { name: "Fonds Croissance", type: "FUNDS", amount: 100000, currentValue: 105200, returnRate: 5.2, status: "ACTIVE", startDate: new Date("2025-01-15"), userId: clients[0].id },
      { name: "SCPI Pierre", type: "REAL_ESTATE", amount: 80000, currentValue: 83040, returnRate: 3.8, status: "ACTIVE", startDate: new Date("2025-03-01"), userId: clients[0].id },
      { name: "Actions Tech", type: "STOCKS", amount: 120000, currentValue: 132000, returnRate: 10.0, status: "ACTIVE", startDate: new Date("2024-06-01"), userId: clients[1].id },
      { name: "Obligations", type: "BONDS", amount: 200000, currentValue: 206000, returnRate: 3.0, status: "ACTIVE", startDate: new Date("2025-01-01"), userId: clients[2].id },
    ],
  });
  console.log("   ✅ 4 investissements");
  console.log("");

  console.log("📄 Création des contrats...");
  await prisma.contract.createMany({
    data: [
      { reference: "AV-2026-001", type: "INSURANCE", title: "Assurance Vie", description: "Contrat premium.", status: "ACTIVE", startDate: new Date("2025-01-01"), userId: clients[0].id },
      { reference: "CI-2024-015", type: "CREDIT", title: "Crédit Immo", description: "Taux 3.2%.", status: "ACTIVE", startDate: new Date("2024-03-15"), userId: clients[0].id },
      { reference: "INV-2025-042", type: "INVESTMENT", title: "Mandat Gestion", description: "Profil équilibré.", status: "ACTIVE", startDate: new Date("2025-06-01"), userId: clients[1].id },
      { reference: "AV-2025-089", type: "INSURANCE", title: "Assurance Vie Jeune", description: "Contrat jeune.", status: "ACTIVE", startDate: new Date("2025-02-01"), userId: clients[3].id },
      { reference: "SERV-2026-003", type: "SERVICE", title: "Conseil Patrimonial", description: "Accompagnement.", status: "PENDING", startDate: new Date("2026-06-01"), userId: clients[2].id },
    ],
  });
  console.log("   ✅ 5 contrats");
  console.log("");

  console.log("🔄 Création des opérations...");
  await prisma.operation.createMany({
    data: [
      { type: "DIVIDEND", amount: 150, description: "Dividende TotalEnergies", balanceBefore: 249850, balanceAfter: 250000, userId: clients[0].id },
      { type: "FEE", amount: -12, description: "Frais de gestion", balanceBefore: 250012, balanceAfter: 250000, userId: clients[0].id },
      { type: "INTEREST", amount: 45, description: "Intérêts Livret A", balanceBefore: 249955, balanceAfter: 250000, userId: clients[0].id },
      { type: "DEPOSIT", amount: 5000, description: "Versement mensuel", balanceBefore: 175000, balanceAfter: 180000, userId: clients[1].id },
    ],
  });
  console.log("   ✅ 4 opérations");
  console.log("");

  console.log("═══════════════════════════════════════");
  console.log("🎉 SEED TERMINÉ !");
  console.log("");
  console.log("👑 admin@smilbank.fr / Test1234!");
  console.log("👤 jean.dupont@email.com / Test1234!");
  console.log("═══════════════════════════════════════");
}

main().catch(console.error).finally(async () => { await prisma.$disconnect(); });
