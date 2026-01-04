import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";

const SITE_URL = "https://productivite.io";

export const GET: RequestHandler = async () => {
  // Fetch all published tools
  const tools = await prisma.tool.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  // Fetch all categories
  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { name: "asc" },
  });

  const staticPages = [
    { url: "/", priority: 1.0, changefreq: "daily" },
    { url: "/tools", priority: 0.9, changefreq: "daily" },
    { url: "/categories", priority: 0.8, changefreq: "weekly" },
    { url: "/login", priority: 0.3, changefreq: "monthly" },
    { url: "/register", priority: 0.3, changefreq: "monthly" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("")}
  ${tools
    .map(
      (tool) => `
  <url>
    <loc>${SITE_URL}/tools/${tool.slug}</loc>
    <lastmod>${tool.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("")}
  ${categories
    .map(
      (category) => `
  <url>
    <loc>${SITE_URL}/categories/${category.slug}</loc>
    <lastmod>${category.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=3600",
    },
  });
};
