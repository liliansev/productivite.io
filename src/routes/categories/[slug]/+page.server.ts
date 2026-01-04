import { prisma } from "$lib/server/prisma";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, url, locals }) => {
  const sort = url.searchParams.get("sort") || "popular";

  const category = await prisma.category.findUnique({
    where: {
      slug: params.slug,
    },
  });

  if (!category) {
    error(404, "Catégorie non trouvée");
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
    where: {
      categoryId: category.id,
      status: "PUBLISHED",
    },
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
    category,
    tools,
    sort,
    userUpvotes,
  };
};
