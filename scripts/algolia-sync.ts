import "dotenv/config";
import { algoliasearch } from "algoliasearch";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Utilise le driver pg natif pour éviter les problèmes avec le driver pg de Prisma
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const appId = process.env.ALGOLIA_APP_ID;
const writeKey = process.env.ALGOLIA_WRITE_KEY;

if (!appId || !writeKey) {
  throw new Error("ALGOLIA_APP_ID and ALGOLIA_WRITE_KEY must be set");
}

const client = algoliasearch(appId, writeKey);
const TOOLS_INDEX = "tools";

async function syncToolsToAlgolia() {
  console.log("Fetching tools from database...");

  const tools = await prisma.tool.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
  });

  console.log(`Found ${tools.length} published tools`);

  const records = tools.map((tool) => ({
    objectID: tool.id,
    name: tool.name,
    slug: tool.slug,
    tagline: tool.tagline,
    description: tool.description,
    logo: tool.logo,
    pricing: tool.pricing,
    upvoteCount: tool.upvoteCount,
    platforms: tool.platforms,
    categoryName: tool.category.name,
    categorySlug: tool.category.slug,
    categoryColor: tool.category.color,
  }));

  console.log("Syncing to Algolia...");

  try {
    // Clear and replace all records
    await client.saveObjects({
      indexName: TOOLS_INDEX,
      objects: records,
    });

    // Configure index settings
    await client.setSettings({
      indexName: TOOLS_INDEX,
      indexSettings: {
        searchableAttributes: [
          "name",
          "tagline",
          "description",
          "categoryName",
        ],
        attributesForFaceting: [
          "filterOnly(pricing)",
          "filterOnly(categorySlug)",
          "searchable(platforms)",
        ],
        customRanking: ["desc(upvoteCount)"],
        attributesToRetrieve: [
          "objectID",
          "name",
          "slug",
          "tagline",
          "logo",
          "pricing",
          "upvoteCount",
          "categoryName",
          "categorySlug",
          "categoryColor",
        ],
      },
    });

    console.log(`Successfully synced ${records.length} tools to Algolia`);
  } catch (error) {
    console.error("Error syncing to Algolia:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

syncToolsToAlgolia();
