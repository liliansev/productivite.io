---
name: payload-nextjs
description: Guide pour développer avec Payload CMS 3.x intégré à Next.js 15, Drizzle ORM et Neon PostgreSQL. Utiliser ce skill pour toute tâche impliquant Payload CMS incluant : création de collections, configuration, hooks, access control, queries (Local API et REST), et intégration avec Drizzle ORM.
---

# Payload CMS 3.0 + Next.js 15 + Drizzle

## Stack database

- **PostgreSQL** : Neon.tech (serverless, autoscaling)
- **ORM principal** : Drizzle ORM (pour queries custom)
- **Adapter Payload** : @payloadcms/db-postgres (utilise Drizzle en interne)

## Installation

```bash
# Créer projet Next.js + Payload
pnpm create payload-app@latest

# Ou ajouter à projet existant
pnpm add payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical

# Drizzle pour queries custom
pnpm add drizzle-orm
pnpm add -D drizzle-kit
```

## Configuration Payload

```typescript
// payload.config.ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Tools } from './collections/Tools'
import { Categories } from './collections/Categories'
import { Reviews } from './collections/Reviews'
import { Upvotes } from './collections/Upvotes'
import { Articles } from './collections/Articles'
import { Media } from './collections/Media'
import { Tags } from './collections/Tags'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Tools,
    Categories,
    Tags,
    Reviews,
    Upvotes,
    Articles,
    Media,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
})
```

## Configuration Drizzle (queries custom)

```typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

## Structure des fichiers

```
src/
├── app/
│   ├── (frontend)/          # Routes publiques
│   ├── (payload)/
│   │   └── admin/
│   │       └── [[...segments]]/
│   │           └── page.tsx  # Admin UI Payload
│   │           └── not-found.tsx
│   └── api/
│       ├── [...payload]/
│       │   └── route.ts      # API REST Payload
│       └── auth/[...nextauth]/
│           └── route.ts      # Auth.js
├── collections/              # Définitions Payload
├── db/
│   ├── index.ts              # Client Drizzle
│   ├── schema.ts             # Schéma custom (si besoin)
│   └── migrations/
├── lib/
│   ├── payload.ts            # Helper getPayload
│   └── auth.ts               # Config Auth.js
└── payload.config.ts
```

## Routes Next.js pour Payload

```typescript
// app/(payload)/admin/[[...segments]]/page.tsx
import { PayloadAdminBar } from '@payloadcms/next/views'
import configPromise from '@payload-config'
import { importMap } from '../importMap'

export { generateMetadata } from '@payloadcms/next/views'

export default async function AdminPage({ params, searchParams }) {
  return PayloadAdminBar({ config: configPromise, importMap, params, searchParams })
}
```

```typescript
// app/api/[...payload]/route.ts
import { handleRoute } from '@payloadcms/next/routes'
import configPromise from '@payload-config'

export const GET = handleRoute(configPromise)
export const POST = handleRoute(configPromise)
export const DELETE = handleRoute(configPromise)
export const PATCH = handleRoute(configPromise)
export const PUT = handleRoute(configPromise)
```

## Queries

### Local API (Server Components) - Recommandé

```typescript
// lib/payload.ts
import { getPayload } from 'payload'
import config from '@payload-config'

export async function getPayloadClient() {
  return getPayload({ config })
}
```

```typescript
// Dans un Server Component
import { getPayloadClient } from '@/lib/payload'

export default async function ToolsPage() {
  const payload = await getPayloadClient()
  
  const tools = await payload.find({
    collection: 'tools',
    where: {
      featured: { equals: true },
    },
    sort: '-stats.upvoteCount',
    limit: 10,
    depth: 2, // Résoudre relations
  })
  
  return <ToolGrid tools={tools.docs} />
}
```

### Queries Drizzle (cas complexes)

Utiliser Drizzle pour les queries que Payload ne gère pas bien :

```typescript
import { db } from '@/db'
import { sql } from 'drizzle-orm'

// Exemple : agrégation complexe
const topTools = await db.execute(sql`
  SELECT t.*, 
         COUNT(DISTINCT u.id) as upvote_count,
         AVG(r.rating) as avg_rating
  FROM tools t
  LEFT JOIN upvotes u ON u.tool_id = t.id
  LEFT JOIN reviews r ON r.tool_id = t.id
  GROUP BY t.id
  ORDER BY upvote_count DESC
  LIMIT 10
`)
```

## Collections

Voir [references/payload-collections.md](references/payload-collections.md) pour les patterns détaillés.

### Structure de base
```typescript
import { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  slug: 'my-collection',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'createdAt'],
    group: 'Contenu', // Grouper dans sidebar
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    // ...
  ],
  hooks: {
    beforeChange: [],
    afterChange: [],
  },
}
```

## Commandes

```bash
# Dev
pnpm dev

# Build
pnpm build

# Générer types Payload
pnpm payload generate:types

# Migrations Drizzle
pnpm drizzle-kit generate
pnpm drizzle-kit migrate

# Drizzle Studio
pnpm drizzle-kit studio
```

## Références

- [Patterns Collections](references/payload-collections.md)
- [Authentification](references/payload-auth.md)
