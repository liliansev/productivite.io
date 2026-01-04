import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, "Vous devez être connecté pour laisser un avis");
  }

  const body = await request.json();
  const { toolId, rating, title, content } = body;

  if (!toolId || !rating) {
    throw error(400, "toolId et rating sont requis");
  }

  if (rating < 1 || rating > 5) {
    throw error(400, "Le rating doit être entre 1 et 5");
  }

  if (content && content.length < 10) {
    throw error(400, "Le contenu doit faire au moins 10 caractères");
  }

  // Check if tool exists
  const tool = await prisma.tool.findUnique({
    where: { id: toolId },
  });

  if (!tool) {
    throw error(404, "Outil non trouvé");
  }

  // Check if user already reviewed this tool
  const existingReview = await prisma.review.findUnique({
    where: {
      toolId_userId: {
        toolId,
        userId: locals.user.id,
      },
    },
  });

  if (existingReview) {
    // Update existing review
    const updatedReview = await prisma.review.update({
      where: { id: existingReview.id },
      data: {
        rating,
        title: title || null,
        content: content || null,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return json({ success: true, review: updatedReview, updated: true });
  }

  // Create new review
  const review = await prisma.review.create({
    data: {
      toolId,
      userId: locals.user.id,
      rating,
      title: title || null,
      content: content || null,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return json({ success: true, review, updated: false });
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, "Vous devez être connecté");
  }

  const body = await request.json();
  const { reviewId } = body;

  if (!reviewId) {
    throw error(400, "reviewId est requis");
  }

  // Check if review exists and belongs to user
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw error(404, "Avis non trouvé");
  }

  if (review.userId !== locals.user.id) {
    throw error(403, "Vous ne pouvez supprimer que vos propres avis");
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return json({ success: true });
};
