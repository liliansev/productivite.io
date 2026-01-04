import { prisma } from "$lib/server/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals }) => {
  const query = url.searchParams.get("q") || "";
  const categorySlug = url.searchParams.get("category") || "";
  const pricing = url.searchParams.get("pricing") || "";
  const sort = url.searchParams.get("sort") || "popular";

  // Build where clause
  const where: Record<string, unknown> = {
    status: "PUBLISHED",
  };

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { tagline: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (pricing) {
    where.pricing = pricing;
  }

  // Build orderBy
  let orderBy: Record<string, string> = {};
  switch (sort) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    case "name":
      orderBy = { name: "asc" };
      break;
    case "popular":
    default:
      orderBy = { upvoteCount: "desc" };
  }

  const tools = await prisma.tool.findMany({
    where,
    orderBy,
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

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  // Get user's upvotes if logged in
  let userUpvotes: string[] = [];
  if (locals.user) {
    const toolIds = tools.map((t) => t.id);
    const upvotes = await prisma.upvote.findMany({
      where: {
        userId: locals.user.id,
        toolId: { in: toolIds },
      },
      select: {
        toolId: true,
      },
    });
    userUpvotes = upvotes.map((u) => u.toolId);
  }

  return {
    tools,
    categories,
    filters: {
      query,
      categorySlug,
      pricing,
      sort,
    },
    userUpvotes,
  };
};
