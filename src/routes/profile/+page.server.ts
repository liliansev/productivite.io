import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  // Get user's upvoted tools
  const upvotedTools = await prisma.tool.findMany({
    where: {
      upvotes: {
        some: {
          userId: locals.user.id,
        },
      },
      status: "PUBLISHED",
    },
    include: {
      category: true,
    },
    orderBy: {
      upvoteCount: "desc",
    },
    take: 20,
  });

  // Get user's reviews
  const reviews = await prisma.review.findMany({
    where: {
      userId: locals.user.id,
    },
    include: {
      tool: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return {
    upvotedTools,
    reviews,
  };
};
