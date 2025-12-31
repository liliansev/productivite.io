# Intégration Algolia - productivite.io

## Configuration

### Installation
```bash
pnpm add algoliasearch react-instantsearch
```

### Variables d'environnement
```env
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_only_key
ALGOLIA_ADMIN_KEY=your_admin_key  # Côté serveur uniquement
```

### Client Algolia
```typescript
// lib/algolia.ts
import algoliasearch from 'algoliasearch'

// Client admin (serveur uniquement)
export const algoliaAdmin = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
)

// Client recherche (client-side safe)
export const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
)

export const toolsIndex = algoliaAdmin.initIndex('tools')
```

## Structure de l'index

### Schéma d'un tool indexé
```typescript
interface AlgoliaToolRecord {
  objectID: string          // ID Payload
  name: string
  slug: string
  tagline: string
  description: string       // Texte brut (pas richText)
  category: {
    name: string
    slug: string
  }
  tags: string[]            // Noms des tags
  pricing: {
    model: 'free' | 'freemium' | 'paid' | 'custom'
    startingPrice: number | null
  }
  platforms: string[]
  logo: string              // URL de l'image
  stats: {
    upvoteCount: number
    reviewCount: number
    averageRating: number
  }
  featured: boolean
  sponsored: boolean
  updatedAt: number         // Timestamp pour tri
}
```

## Indexation automatique

### Hook Payload afterChange
```typescript
// collections/Tools.ts
import { toolsIndex } from '@/lib/algolia'
import { richTextToPlainText } from '@/lib/utils'

hooks: {
  afterChange: [
    async ({ doc, req, operation }) => {
      // Indexer dans Algolia
      const record = {
        objectID: doc.id,
        name: doc.name,
        slug: doc.slug,
        tagline: doc.tagline,
        description: richTextToPlainText(doc.description),
        category: {
          name: doc.category.name,
          slug: doc.category.slug,
        },
        tags: doc.tags?.map(t => t.name) || [],
        pricing: doc.pricing,
        platforms: doc.platforms || [],
        logo: doc.logo?.url || '',
        stats: doc.stats,
        featured: doc.featured,
        sponsored: doc.sponsored,
        updatedAt: Date.now(),
      }

      await toolsIndex.saveObject(record)
      return doc
    },
  ],
  afterDelete: [
    async ({ doc }) => {
      await toolsIndex.deleteObject(doc.id)
    },
  ],
}
```

### Script de réindexation complète
```typescript
// scripts/reindex-algolia.ts
import { getPayload } from 'payload'
import config from '@/payload.config'
import { toolsIndex } from '@/lib/algolia'

async function reindexAll() {
  const payload = await getPayload({ config })
  
  const tools = await payload.find({
    collection: 'tools',
    limit: 1000,
    depth: 2, // Inclure relations
  })

  const records = tools.docs.map(doc => ({
    objectID: doc.id,
    name: doc.name,
    // ... mapper tous les champs
  }))

  await toolsIndex.replaceAllObjects(records)
  console.log(`Indexed ${records.length} tools`)
}

reindexAll()
```

## Configuration de l'index Algolia

### Settings recommandés
```typescript
await toolsIndex.setSettings({
  searchableAttributes: [
    'name',
    'tagline',
    'description',
    'category.name',
    'tags',
  ],
  attributesForFaceting: [
    'filterOnly(category.slug)',
    'filterOnly(pricing.model)',
    'filterOnly(platforms)',
    'searchable(tags)',
  ],
  customRanking: [
    'desc(sponsored)',
    'desc(featured)',
    'desc(stats.upvoteCount)',
    'desc(stats.averageRating)',
  ],
  attributesToRetrieve: [
    'objectID',
    'name',
    'slug',
    'tagline',
    'category',
    'pricing',
    'platforms',
    'logo',
    'stats',
    'featured',
    'sponsored',
  ],
  attributesToHighlight: ['name', 'tagline'],
  hitsPerPage: 20,
})
```

## Composant de recherche

### SearchBar avec React InstantSearch
```typescript
// components/search/SearchBar.tsx
'use client'

import { useState } from 'react'
import { InstantSearch, SearchBox, Hits, Configure } from 'react-instantsearch'
import { algoliaClient } from '@/lib/algolia'
import { ToolCard } from '@/components/tools/ToolCard'

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <InstantSearch searchClient={algoliaClient} indexName="tools">
      <Configure hitsPerPage={10} />
      
      <div className="relative">
        <SearchBox
          placeholder="Rechercher un outil..."
          onFocus={() => setIsOpen(true)}
          classNames={{
            input: 'w-full px-4 py-2 border rounded-lg',
            submit: 'hidden',
            reset: 'hidden',
          }}
        />
        
        {isOpen && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border z-50">
            <Hits
              hitComponent={({ hit }) => (
                <ToolCard tool={hit} variant="compact" />
              )}
            />
          </div>
        )}
      </div>
    </InstantSearch>
  )
}
```

### Page de recherche avec filtres
```typescript
// app/(frontend)/tools/page.tsx
'use client'

import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Pagination,
  Stats,
} from 'react-instantsearch'
import { algoliaClient } from '@/lib/algolia'

export default function ToolsPage() {
  return (
    <InstantSearch searchClient={algoliaClient} indexName="tools">
      <div className="grid grid-cols-4 gap-8">
        {/* Sidebar filtres */}
        <aside className="col-span-1">
          <h3>Catégorie</h3>
          <RefinementList attribute="category.slug" />
          
          <h3>Prix</h3>
          <RefinementList attribute="pricing.model" />
          
          <h3>Plateforme</h3>
          <RefinementList attribute="platforms" />
        </aside>
        
        {/* Résultats */}
        <main className="col-span-3">
          <SearchBox placeholder="Rechercher..." />
          <Stats />
          <Hits hitComponent={ToolHit} />
          <Pagination />
        </main>
      </div>
    </InstantSearch>
  )
}
```

## API Route pour recherche serveur

```typescript
// app/api/search/route.ts
import { NextRequest } from 'next/server'
import { algoliaAdmin } from '@/lib/algolia'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category')
  const page = parseInt(searchParams.get('page') || '0')

  const filters = category ? `category.slug:${category}` : ''

  const { hits, nbHits, nbPages } = await algoliaAdmin
    .initIndex('tools')
    .search(query, {
      filters,
      page,
      hitsPerPage: 20,
    })

  return Response.json({
    tools: hits,
    total: nbHits,
    pages: nbPages,
    page,
  })
}
```

## Alternatives : Meilisearch

Si tu préfères une solution self-hosted :

```typescript
// lib/meilisearch.ts
import { MeiliSearch } from 'meilisearch'

export const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST!,
  apiKey: process.env.MEILISEARCH_API_KEY,
})

export const toolsIndex = meilisearch.index('tools')
```

L'API est très similaire à Algolia.
