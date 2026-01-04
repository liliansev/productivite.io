import { prisma } from "$lib/server/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: {
          tools: {
            where: {
              status: "PUBLISHED",
            },
          },
        },
      },
    },
  });

  return {
    categories,
  };
};
