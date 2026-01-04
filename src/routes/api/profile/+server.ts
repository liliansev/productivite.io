import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";

export const PATCH: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, "Vous devez être connecté");
  }

  const body = await request.json();
  const { name } = body;

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      throw error(400, "Le nom doit contenir au moins 2 caractères");
    }

    await prisma.user.update({
      where: { id: locals.user.id },
      data: { name: name.trim() },
    });
  }

  return json({ success: true });
};

export const DELETE: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    throw error(401, "Vous devez être connecté");
  }

  // Delete user and all related data (reviews, upvotes handled by cascade)
  await prisma.user.delete({
    where: { id: locals.user.id },
  });

  return json({ success: true });
};
