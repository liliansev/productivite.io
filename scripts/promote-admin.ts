import { prisma } from "../src/lib/server/prisma";

async function promoteAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.log("Usage: npx tsx scripts/promote-admin.ts <email>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log(`User with email "${email}" not found.`);
    process.exit(1);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
  });

  console.log(`User "${user.name || user.email}" has been promoted to ADMIN.`);
  process.exit(0);
}

promoteAdmin();
