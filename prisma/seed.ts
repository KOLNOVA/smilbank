import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("");
  console.log("🌱 SEED SMIL-BANK - Création des comptes");
  console.log("═══════════════════════════════════════");
  console.log("");

  const password = await bcrypt.hash("Test1234!", 12);

  // ============ SUPER ADMIN ============
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

  // ============ CLIENTS ============
  console.log("👤 Création des clients...");
  
  const clientsData = [
    { email: "jean.dupont@email.com", firstName: "Jean", lastName: "Dupont", phone: "06 12 34 56 78" },
    { email: "sophie.laurent@email.com", firstName: "Sophie", lastName: "Laurent", phone: "06 98 76 54 32" },
    { email: "marc.dubois@email.com", firstName: "Marc", lastName: "Dubois", phone: "07 45 67 89 01" },
    { email: "claire.moreau@email.com", firstName: "Claire", lastName: "Moreau", phone: "06 34 56 78 90" },
    { email: "pierre.martin@email.com", firstName: "Pierre", lastName: "Martin", phone: "07 89 01 23 45" },
  ];

  const clients = [];
  for (const c of clientsData) {
    const client = await prisma.user.create({
      data: {
        email: c.email,
        password,
        firstName: c.firstName,
        lastName: c.lastName,
        phone: c.phone,
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

  // ============ PORTEFEUILLES ============
  console.log("💰 Création des portefeuilles...");
  const portfolios = [
    { name: "Portefeuille Principal", balance: 250000, totalInvested: 180000, performance: 4.2, client: 0 },
    { name: "Portefeuille Retraite", balance: 180000, totalInvested: 120000, performance: 3.8, client: 1 },
    { name: "Portefeuille Dynastie", balance: 420000, totalInvested: 350000, performance: 5.2, client: 2 },
    { name: "Portefeuille Débutant", balance: 95000, totalInvested: 60000, performance: 2.5, client: 3 },
  ];
  for (const p of portfolios) {
    await prisma.portfolio.create({
      data: {
        name: p.name,
        balance: p.balance,
        totalInvested: p.totalInvested,
        performance: p.performance,
        userId: clients[p.client].id,
      },
    });
  }
  console.log(`   ✅ ${portfolios.length} portefeuilles`);
  console.log("");

  // ============ INVESTISSEMENTS ============
  console.log("📈 Création des investissements...");
  await prisma.investment.createMany({
    data: [
      { name: "Fonds Croissance", type: "FUNDS", amount: 100000, currentValue: 105200, returnRate: 5.2, status: "ACTIVE", startDate: new Date("2025-01-15"), userId: clients[0].id },
      { name: "SCPI Pierre", type: "REAL_ESTATE", amount: 80000, currentValue: 83040, returnRate: 3.8, status: "ACTIVE", startDate: new Date("2025-03-01"), userId: clients[0].id },
      { name: "Actions Tech", type: "STOCKS", amount: 120000, currentValue: 132000, returnRate: 10.0, status: "ACTIVE", startDate: new Date("2024-06-01"), userId: clients[1].id },
      { name: "Obligations État", type: "BONDS", amount: 200000, currentValue: 206000, returnRate: 3.0, status: "ACTIVE", startDate: new Date("2025-01-01"), userId: clients[2].id },
    ],
  });
  console.log("   ✅ 4 investissements");
  console.log("");

  // ============ CONTRATS ============
  console.log("📄 Création des contrats...");
  await prisma.contract.createMany({
    data: [
      { reference: "AV-2026-001", type: "INSURANCE", title: "Assurance Vie Premium", description: "Contrat d'assurance vie avec garantie plancher et fonds euros.", status: "ACTIVE", startDate: new Date("2025-01-01"), endDate: new Date("2035-01-01"), userId: clients[0].id },
      { reference: "CI-2024-015", type: "CREDIT", title: "Crédit Immobilier", description: "Prêt immobilier taux fixe 3.2% sur 20 ans.", status: "ACTIVE", startDate: new Date("2024-03-15"), endDate: new Date("2044-03-15"), userId: clients[0].id },
      { reference: "INV-2025-042", type: "INVESTMENT", title: "Mandat de Gestion", description: "Mandat de gestion pilotée profil équilibré.", status: "ACTIVE", startDate: new Date("2025-06-01"), userId: clients[1].id },
      { reference: "AV-2025-089", type: "INSURANCE", title: "Assurance Vie Jeune", description: "Contrat assurance vie pour préparer l'avenir.", status: "ACTIVE", startDate: new Date("2025-02-01"), userId: clients[3].id },
      { reference: "SERV-2026-003", type: "SERVICE", title: "Conseil Patrimonial", description: "Accompagnement personnalisé en gestion de patrimoine.", status: "PENDING", startDate: new Date("2026-06-01"), userId: clients[2].id },
    ],
  });
  console.log("   ✅ 5 contrats");
  console.log("");

  // ============ OPÉRATIONS ============
  console.log("🔄 Création des opérations...");
  await prisma.operation.createMany({
    data: [
      { type: "DIVIDEND", amount: 150, description: "Dividende TotalEnergies", balanceBefore: 249850, balanceAfter: 250000, userId: clients[0].id },
      { type: "FEE", amount: -12, description: "Frais de gestion mensuels", balanceBefore: 250012, balanceAfter: 250000, userId: clients[0].id },
      { type: "INTEREST", amount: 45, description: "Intérêts Livret A", balanceBefore: 249955, balanceAfter: 250000, userId: clients[0].id },
      { type: "DEPOSIT", amount: 5000, description: "Versement mensuel programmé", balanceBefore: 175000, balanceAfter: 180000, userId: clients[1].id },
      { type: "INVESTMENT", amount: 20000, description: "Souscription SCPI Pierre", balanceBefore: 440000, balanceAfter: 420000, userId: clients[2].id },
    ],
  });
  console.log("   ✅ 5 opérations");
  console.log("");

  // ============ DOCUMENTS ============
  console.log("📁 Création des documents...");
  await prisma.document.createMany({
    data: [
      { title: "Relevé annuel 2025", type: "STATEMENT", fileName: "releve-2025.pdf", filePath: "/documents/2025/releve.pdf", mimeType: "application/pdf", fileSize: 250000, status: "PRIVATE", userId: clients[0].id },
      { title: "Contrat Assurance Vie", type: "CONTRACT", fileName: "contrat-av-2026-001.pdf", filePath: "/documents/contrats/av-001.pdf", mimeType: "application/pdf", fileSize: 500000, status: "PRIVATE", userId: clients[0].id },
      { title: "Avis d'imposition 2025", type: "TAX", fileName: "avis-impot-2025.pdf", filePath: "/documents/fiscal/2025.pdf", mimeType: "application/pdf", fileSize: 150000, status: "PRIVATE", userId: clients[1].id },
      { title: "Rapport mensuel Juin 2026", type: "REPORT", fileName: "rapport-2026-06.pdf", filePath: "/documents/rapports/2026-06.pdf", mimeType: "application/pdf", fileSize: 350000, status: "PRIVATE", userId: clients[2].id },
    ],
  });
  console.log("   ✅ 4 documents");
  console.log("");

  // ============ LOG ============
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      action: "SEED",
      entity: "System",
      details: { message: "Base de données initialisée avec succès" },
    },
  });

  console.log("═══════════════════════════════════════");
  console.log("🎉 SEED TERMINÉ AVEC SUCCÈS !");
  console.log("");
  console.log("📋 COMPTES DE TEST :");
  console.log("═══════════════════════════════════════");
  console.log("👑 SUPER ADMIN :");
  console.log("   Email    : admin@smilbank.fr");
  console.log("   Mot de passe : Test1234!");
  console.log("   Interface : /admin");
  console.log("");
  console.log("👤 CLIENTS :");
  console.log("   jean.dupont@email.com / Test1234!");
  console.log("   sophie.laurent@email.com / Test1234!");
  console.log("   marc.dubois@email.com / Test1234!");
  console.log("   claire.moreau@email.com / Test1234!");
  console.log("   pierre.martin@email.com / Test1234!");
  console.log("═══════════════════════════════════════");
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
