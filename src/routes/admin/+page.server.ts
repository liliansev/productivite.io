import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async () => {
  // Get dashboard stats
  const [
    toolsCount,
    publishedToolsCount,
    draftToolsCount,
    usersCount,
    categoriesCount,
    reviewsCount,
    upvotesCount,
    recentTools,
    recentReviews,
  ] = await Promise.all([
    prisma.tool.count(),
    prisma.tool.count({ where: { status: "PUBLISHED" } }),
    prisma.tool.count({ where: { status: "DRAFT" } }),
    prisma.user.count(),
    prisma.category.count(),
    prisma.review.count(),
    prisma.upvote.count(),
    prisma.tool.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { category: true },
    }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true } },
        tool: { select: { name: true, slug: true } },
      },
    }),
  ]);

  return {
    stats: {
      toolsCount,
      publishedToolsCount,
      draftToolsCount,
      usersCount,
      categoriesCount,
      reviewsCount,
      upvotesCount,
    },
    recentTools,
    recentReviews,
  };
};
