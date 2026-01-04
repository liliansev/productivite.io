import type { Actions, PageServerLoad } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, "/login?redirect=/submit");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return { categories };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(302, "/login?redirect=/submit");
    }

    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim();
    const website = formData.get("website")?.toString().trim();
    const tagline = formData.get("tagline")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const categoryId = formData.get("categoryId")?.toString();
    const pricing = formData.get("pricing")?.toString();
    const platforms = formData.getAll("platforms").map((p) => p.toString());

    // Validation
    const errors: Record<string, string> = {};

    if (!name || name.length < 2) {
      errors.name = "Le nom doit contenir au moins 2 caractères";
    }

    if (!website) {
      errors.website = "L'URL du site est requise";
    } else {
      try {
        new URL(website);
      } catch {
        errors.website = "L'URL n'est pas valide";
      }
    }

    if (!tagline || tagline.length < 10) {
      errors.tagline = "La description courte doit contenir au moins 10 caractères";
    }

    if (!categoryId) {
      errors.categoryId = "Veuillez sélectionner une catégorie";
    }

    if (!pricing) {
      errors.pricing = "Veuillez sélectionner un modèle tarifaire";
    }

    if (Object.keys(errors).length > 0) {
      return fail(400, {
        errors,
        data: { name, website, tagline, description, categoryId, pricing, platforms },
      });
    }

    // Generate slug
    const baseSlug = name!
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check for existing slug and generate unique one
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.tool.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    // Create tool in DRAFT status
    await prisma.tool.create({
      data: {
        name: name!,
        slug,
        website: website!,
        tagline: tagline!,
        description: description || null,
        categoryId: categoryId!,
        pricing: pricing as "FREE" | "FREEMIUM" | "PAID" | "ENTERPRISE",
        platforms,
        status: "DRAFT", // Requires admin approval
      },
    });

    throw redirect(302, "/submit/success");
  },
};
