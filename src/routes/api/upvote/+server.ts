import { json, error } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
  // Check authentication
  if (!locals.user) {
    error(401, "Vous devez être connecté pour voter");
  }

  const { toolId } = await request.json();

  if (!toolId || typeof toolId !== "string") {
    error(400, "ID de l'outil requis");
  }

  // Check if tool exists
  const tool = await prisma.tool.findUnique({
    where: { id: toolId },
    select: { id: true, upvoteCount: true },
  });

  if (!tool) {
    error(404, "Outil non trouvé");
  }

  // Check if user already upvoted
  const existingUpvote = await prisma.upvote.findUnique({
    where: {
      toolId_userId: {
        toolId,
        userId: locals.user.id,
      },
    },
  });

  let upvoted: boolean;
  let newCount: number;

  if (existingUpvote) {
    // Remove upvote
    await prisma.$transaction([
      prisma.upvote.delete({
        where: { id: existingUpvote.id },
      }),
      prisma.tool.update({
        where: { id: toolId },
        data: { upvoteCount: { decrement: 1 } },
      }),
    ]);
    upvoted = false;
    newCount = tool.upvoteCount - 1;
  } else {
    // Add upvote
    await prisma.$transaction([
      prisma.upvote.create({
        data: {
          toolId,
          userId: locals.user.id,
        },
      }),
      prisma.tool.update({
        where: { id: toolId },
        data: { upvoteCount: { increment: 1 } },
      }),
    ]);
    upvoted = true;
    newCount = tool.upvoteCount + 1;
  }

  return json({
    upvoted,
    upvoteCount: newCount,
  });
};

// Get upvote status for multiple tools
export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) {
    return json({ upvotes: [] });
  }

  const toolIds = url.searchParams.get("toolIds");

  if (!toolIds) {
    return json({ upvotes: [] });
  }

  const ids = toolIds.split(",").filter(Boolean);

  const upvotes = await prisma.upvote.findMany({
    where: {
      userId: locals.user.id,
      toolId: { in: ids },
    },
    select: {
      toolId: true,
    },
  });

  return json({
    upvotes: upvotes.map((u) => u.toolId),
  });
};
