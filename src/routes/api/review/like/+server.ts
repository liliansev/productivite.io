import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: "Non autorisé" }, { status: 401 });
  }

  const { reviewId } = await request.json();

  if (!reviewId) {
    return json({ error: "reviewId requis" }, { status: 400 });
  }

  // Check if review exists
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    return json({ error: "Avis non trouvé" }, { status: 404 });
  }

  // Check if already liked
  const existingLike = await prisma.reviewLike.findUnique({
    where: {
      reviewId_userId: {
        reviewId,
        userId: locals.user.id,
      },
    },
  });

  if (existingLike) {
    // Unlike - remove like and decrement count
    await prisma.$transaction([
      prisma.reviewLike.delete({
        where: { id: existingLike.id },
      }),
      prisma.review.update({
        where: { id: reviewId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);

    return json({ liked: false, likeCount: review.likeCount - 1 });
  } else {
    // Like - add like and increment count
    await prisma.$transaction([
      prisma.reviewLike.create({
        data: {
          reviewId,
          userId: locals.user.id,
        },
      }),
      prisma.review.update({
        where: { id: reviewId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);

    return json({ liked: true, likeCount: review.likeCount + 1 });
  }
};
