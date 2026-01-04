import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { tools: true } },
    },
    orderBy: { order: "asc" },
  });

  return { categories };
};
