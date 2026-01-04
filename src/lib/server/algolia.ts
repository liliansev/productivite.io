import { algoliasearch } from "algoliasearch";

const appId = process.env.ALGOLIA_APP_ID || "";
const writeKey = process.env.ALGOLIA_WRITE_KEY || "";

// Client for server-side indexing (uses write key)
export const adminClient = algoliasearch(appId, writeKey);
export const TOOLS_INDEX = "tools";
