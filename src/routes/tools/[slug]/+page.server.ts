import { prisma } from "$lib/server/prisma";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  const tool = await prisma.tool.findUnique({
    where: {
      slug: params.slug,
      status: "PUBLISHED",
    },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: [{ likeCount: "desc" }, { createdAt: "desc" }],
      },
      _count: {
        select: {
          upvotes: true,
          reviews: true,
        },
      },
    },
  });

  if (!tool) {
    error(404, "Outil non trouvé");
  }

  // Get related tools from the same category
  const relatedTools = await prisma.tool.findMany({
    where: {
      categoryId: tool.categoryId,
      status: "PUBLISHED",
      id: { not: tool.id },
    },
    orderBy: {
      upvoteCount: "desc",
    },
    take: 4,
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

  // Calculate average rating
  const avgRating =
    tool.reviews.length > 0
      ? tool.reviews.reduce((acc, r) => acc + r.rating, 0) / tool.reviews.length
      : 0;

  // Check if user has upvoted this tool
  let isUpvoted = false;
  if (locals.user) {
    const upvote = await prisma.upvote.findUnique({
      where: {
        toolId_userId: {
          toolId: tool.id,
          userId: locals.user.id,
        },
      },
    });
    isUpvoted = !!upvote;
  }

  // Get user upvotes for related tools
  let relatedUpvotes: string[] = [];
  if (locals.user && relatedTools.length > 0) {
    const relatedIds = relatedTools.map((t) => t.id);
    const upvotes = await prisma.upvote.findMany({
      where: {
        userId: locals.user.id,
        toolId: { in: relatedIds },
      },
      select: { toolId: true },
    });
    relatedUpvotes = upvotes.map((u) => u.toolId);
  }

  // Get user likes for reviews
  let likedReviewIds: string[] = [];
  if (locals.user && tool.reviews.length > 0) {
    const reviewIds = tool.reviews.map((r) => r.id);
    const likes = await prisma.reviewLike.findMany({
      where: {
        userId: locals.user.id,
        reviewId: { in: reviewIds },
      },
      select: { reviewId: true },
    });
    likedReviewIds = likes.map((l) => l.reviewId);
  }

  return {
    tool,
    relatedTools,
    avgRating,
    isUpvoted,
    relatedUpvotes,
    likedReviewIds,
  };
};
