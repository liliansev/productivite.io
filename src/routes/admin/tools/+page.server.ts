import type { PageServerLoad, Actions } from "./$types";
import { prisma } from "$lib/server/prisma";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ url }) => {
  const status = url.searchParams.get("status") || "";
  const search = url.searchParams.get("q") || "";

  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { tagline: { contains: search, mode: "insensitive" } },
    ];
  }

  const tools = await prisma.tool.findMany({
    where,
    include: {
      category: true,
      _count: { select: { upvotes: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return { tools };
};

export const actions: Actions = {
  publish: async ({ request }) => {
    const formData = await request.formData();
    const toolId = formData.get("toolId")?.toString();

    if (!toolId) {
      return fail(400, { error: "Tool ID required" });
    }

    await prisma.tool.update({
      where: { id: toolId },
      data: { status: "PUBLISHED" },
    });

    return { success: true };
  },

  unpublish: async ({ request }) => {
    const formData = await request.formData();
    const toolId = formData.get("toolId")?.toString();

    if (!toolId) {
      return fail(400, { error: "Tool ID required" });
    }

    await prisma.tool.update({
      where: { id: toolId },
      data: { status: "DRAFT" },
    });

    return { success: true };
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const toolId = formData.get("toolId")?.toString();

    if (!toolId) {
      return fail(400, { error: "Tool ID required" });
    }

    await prisma.tool.delete({
      where: { id: toolId },
    });

    return { success: true };
  },
};
