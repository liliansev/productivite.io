import { prisma } from "$lib/server/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  // Get top tools by upvote count
  const topTools = await prisma.tool.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      upvoteCount: "desc",
    },
    take: 10,
    include: {
      category: {
        select: {
          name: true,
          slug: true,
          color: true,
        },
      },
    },
  });

  // Get all categories with tool count
  const categories = await prisma.category.findMany({
    orderBy: {
      order: "asc",
    },
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

  // Get recently added tools
  const recentTools = await prisma.tool.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      category: {
        select: {
          name: true,
          slug: true,
          color: true,
        },
      },
    },
  });

  // Get user's upvotes if logged in
  let userUpvotes: string[] = [];
  if (locals.user) {
    const allToolIds = [
      ...topTools.map((t) => t.id),
      ...recentTools.map((t) => t.id),
    ];
    const uniqueToolIds = [...new Set(allToolIds)];

    const upvotes = await prisma.upvote.findMany({
      where: {
        userId: locals.user.id,
        toolId: { in: uniqueToolIds },
      },
      select: {
        toolId: true,
      },
    });
    userUpvotes = upvotes.map((u) => u.toolId);
  }

  return {
    topTools,
    categories,
    recentTools,
    userUpvotes,
  };
};
