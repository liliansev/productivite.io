import { algoliasearch } from 'algoliasearch'

// Configuration Algolia
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || ''
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''
const adminKey = process.env.ALGOLIA_ADMIN_KEY || ''

// Client pour la recherche (côté client)
export const searchClient = algoliasearch(appId, searchKey)

// Client admin pour l'indexation (côté serveur uniquement)
export const getAdminClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Admin client should only be used on the server')
  }
  return algoliasearch(appId, adminKey)
}

// Nom de l'index pour les outils
export const TOOLS_INDEX = 'tools'

// Type pour les documents Algolia
export interface AlgoliaToolRecord {
  objectID: string
  name: string
  slug: string
  tagline: string
  description?: string
  category: {
    name: string
    slug: string
  } | null
  pricing: string
  platforms: string[]
  upvoteCount: number
  logoUrl?: string
}

// Fonction pour transformer un outil Payload en record Algolia
export function toolToAlgoliaRecord(tool: {
  id: number
  name: string
  slug: string
  tagline?: string | null
  description?: string | null
  category?: { name: string; slug: string } | null
  pricing?: string | null
  platforms?: string[]
  upvoteCount?: number | null
  logo?: { url?: string } | null
}): AlgoliaToolRecord {
  return {
    objectID: String(tool.id),
    name: tool.name,
    slug: tool.slug,
    tagline: tool.tagline || '',
    description: tool.description || undefined,
    category: tool.category || null,
    pricing: tool.pricing || 'free',
    platforms: tool.platforms || [],
    upvoteCount: tool.upvoteCount || 0,
    logoUrl: tool.logo?.url || undefined,
  }
}

// Fonction pour indexer un outil
export async function indexTool(tool: Parameters<typeof toolToAlgoliaRecord>[0]) {
  const client = getAdminClient()
  const record = toolToAlgoliaRecord(tool)
  await client.saveObject({
    indexName: TOOLS_INDEX,
    body: record,
  })
}

// Fonction pour supprimer un outil de l'index
export async function removeTool(toolId: string | number) {
  const client = getAdminClient()
  await client.deleteObject({
    indexName: TOOLS_INDEX,
    objectID: String(toolId),
  })
}

// Fonction pour réindexer tous les outils
export async function reindexAllTools(tools: Parameters<typeof toolToAlgoliaRecord>[0][]) {
  const client = getAdminClient()
  const records = tools.map(toolToAlgoliaRecord)
  await client.saveObjects({
    indexName: TOOLS_INDEX,
    objects: records,
  })
}
