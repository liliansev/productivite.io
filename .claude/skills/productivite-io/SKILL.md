---
name: productivite-io
description: Guide complet pour développer productivite.io - un annuaire d'outils SaaS (productivité, IA, automation). Utiliser ce skill pour toute tâche liée au projet incluant : architecture, structure des fichiers, conventions de code, modèles de données, fonctionnalités (tools, reviews, upvotes, articles, affiliation, search), et déploiement Vercel.
---

# productivite.io - Guide de développement

## Vue d'ensemble

Annuaire francophone d'outils SaaS pour la productivité, l'IA et l'automation.
Inspiré de toolfinder.co mais avec une identité propre.

## Stack technique

| Composant | Choix | Raison |
|-----------|-------|--------|
| **Framework** | Next.js 15 (App Router + PPR) | SEO statique + dynamisme temps réel |
| **Database** | PostgreSQL via Neon.tech | Relationnel, autoscaling, branching |
| **ORM** | Drizzle ORM | Type-safe, performant, proche SQL |
| **CMS** | Payload CMS 3.0 | Intégré à Next.js comme librairie |
| **Auth** | Auth.js (NextAuth) | Natif Next.js |
| **Search** | Algolia | Search-as-you-type |
| **Styling** | Tailwind + shadcn/ui | Itération rapide |

## Structure du projet

```
productivite.io/
├── src/
│   ├── app/
│   │   ├── (frontend)/         # Routes publiques
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── tools/
│   │   │   │   ├── page.tsx    # Liste outils
│   │   │   │   └── [slug]/page.tsx  # Fiche outil
│   │   │   ├── categories/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   └── auth/
│   │   │       ├── login/page.tsx
│   │   │       └── register/page.tsx
│   │   ├── (payload)/
│   │   │   └── admin/[[...segments]]/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── [...payload]/route.ts
│   │   │   └── search/route.ts
│   │   └── layout.tsx
│   ├── collections/            # Payload collections
│   │   ├── Tools.ts
│   │   ├── Categories.ts
│   │   ├── Tags.ts
│   │   ├── Reviews.ts
│   │   ├── Upvotes.ts
│   │   ├── Articles.ts
│   │   ├── Users.ts
│   │   ├── Media.ts
│   │   └── index.ts
│   ├── components/
│   │   ├── ui/                 # shadcn/ui
│   │   ├── tools/
│   │   │   ├── ToolCard.tsx
│   │   │   ├── ToolGrid.tsx
│   │   │   ├── ToolFilters.tsx
│   │   │   └── UpvoteButton.tsx
│   │   ├── reviews/
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   └── ReviewList.tsx
│   │   ├── search/
│   │   │   └── SearchBar.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Sidebar.tsx
│   ├── db/
│   │   ├── schema.ts           # Schéma Drizzle (si tables custom)
│   │   ├── index.ts            # Client Drizzle
│   │   └── migrations/
│   ├── lib/
│   │   ├── auth.ts             # Config Auth.js
│   │   ├── algolia.ts          # Client Algolia
│   │   ├── payload.ts          # Helpers Payload
│   │   └── utils.ts
│   └── payload.config.ts
├── public/
│   └── media/                  # Uploads Payload
├── CLAUDE.md
├── PLAN.md                     # Plan à valider
├── CHECKLIST.md                # Tâches à cocher
└── .env.local
```

## Modèle de données

Voir [references/collections.md](references/collections.md) pour les schémas Payload détaillés.

### Relations principales

```
Users ──┬── Reviews ──── Tools ──── Categories
        │                  │
        └── Upvotes ───────┘
                           │
Articles ──────────────────┘ (relatedTools)
```

## Conventions de code

### Nommage
- **Composants** : PascalCase (`ToolCard.tsx`)
- **Fichiers utils** : camelCase (`formatPrice.ts`)
- **Routes** : kebab-case (`/tools/[slug]`)
- **Collections Payload** : PascalCase fichier, camelCase slug (`Tools.ts` → `tools`)
- **Tables Drizzle** : snake_case (`user_upvotes`)

### React
- Server Components par défaut
- `'use client'` uniquement pour interactivité
- Props typées avec TypeScript
- Importer types depuis `@/payload-types`

### Data fetching
- **Server** : Payload Local API (`payload.find()`)
- **Client** : REST API (`/api/tools`)
- ISR avec `revalidate` pour pages statiques
- SWR ou React Query pour données dynamiques

## Fonctionnalités clés

### 1. Catalogue d'outils
- Liste paginée avec filtres (catégorie, prix, plateforme)
- Recherche Algolia instantanée
- Tri par popularité, date, note

### 2. Fiche outil
- SEO optimisé (meta, JSON-LD)
- Logo, description, pricing, features
- Lien affilié avec tracking clics
- Reviews et note moyenne
- Bouton upvote

### 3. Reviews & Upvotes
- Auth requise pour voter/commenter
- 1 review par user/tool
- 1 upvote par user/tool
- Calcul automatique stats (hooks Payload)

### 4. Recherche
- Algolia search-as-you-type
- Indexation auto des tools (hook afterChange)
- Filtres faceted

### 5. Blog/Articles
- Rich text Payload
- SEO metadata
- Tools mentionnés
- Catégories (guide, comparatif, news)

## Références

- [Collections Payload](references/collections.md)
- [Composants UI](references/components.md)
- [Guide SEO](references/seo.md)
- [Intégration Algolia](references/algolia.md)
