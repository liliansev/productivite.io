import { algoliasearch } from "algoliasearch";
import { env } from "$env/dynamic/public";

const appId = env.PUBLIC_ALGOLIA_APP_ID || "";
const apiKey = env.PUBLIC_ALGOLIA_SEARCH_KEY || "";

export const searchClient = algoliasearch(appId, apiKey);
export const TOOLS_INDEX = "tools";

export type AlgoliaToolRecord = {
  objectID: string;
  name: string;
  slug: string;
  tagline: string | null;
  logo: string | null;
  pricing: string;
  upvoteCount: number;
  categoryName: string;
  categorySlug: string;
  categoryColor: string;
};
