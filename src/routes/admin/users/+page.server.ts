import type { PageServerLoad, Actions } from "./$types";
import { prisma } from "$lib/server/prisma";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ url }) => {
  const search = url.searchParams.get("q") || "";
  const role = url.searchParams.get("role") || "";

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role) {
    where.role = role;
  }

  const users = await prisma.user.findMany({
    where,
    include: {
      _count: {
        select: { upvotes: true, reviews: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { users };
};

export const actions: Actions = {
  promote: async ({ request, locals }) => {
    const formData = await request.formData();
    const userId = formData.get("userId")?.toString();

    if (!userId) {
      return fail(400, { error: "User ID required" });
    }

    // Prevent self-demotion
    if (userId === locals.user?.id) {
      return fail(400, { error: "Cannot change your own role" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });

    return { success: true };
  },

  demote: async ({ request, locals }) => {
    const formData = await request.formData();
    const userId = formData.get("userId")?.toString();

    if (!userId) {
      return fail(400, { error: "User ID required" });
    }

    // Prevent self-demotion
    if (userId === locals.user?.id) {
      return fail(400, { error: "Cannot change your own role" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: "USER" },
    });

    return { success: true };
  },
};
