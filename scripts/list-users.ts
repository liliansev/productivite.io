import { prisma } from "../src/lib/server/prisma";

async function listUsers() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true },
  });
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}

listUsers();
