# Collections Payload CMS - productivite.io

## Vue d'ensemble

| Collection | Description | Accès public |
|------------|-------------|--------------|
| `tools` | Outils SaaS référencés | ✅ Lecture |
| `categories` | Catégories d'outils | ✅ Lecture |
| `tags` | Tags pour filtrage | ✅ Lecture |
| `reviews` | Avis utilisateurs | ✅ Lecture |
| `upvotes` | Votes utilisateurs | ✅ Lecture |
| `articles` | Blog/guides SEO | ✅ Lecture (publiés) |
| `users` | Membres et admins | ✅ Profils publics |
| `media` | Images et fichiers | ✅ Lecture |

## Tools

Champs principaux :
- `name` (text, required) - Nom de l'outil
- `slug` (text, unique) - URL-friendly
- `logo` (upload → media) - Logo de l'outil
- `tagline` (text, max 120) - Description courte
- `description` (richText) - Description complète

Pricing :
- `pricing.model` (select: free, freemium, paid, custom)
- `pricing.startingPrice` (number) - Prix en €/mois
- `pricing.hasFreeTrial` (checkbox)

Liens :
- `links.website` (text, required) - Site officiel
- `links.affiliateUrl` (text) - Lien affilié trackable

Relations :
- `category` (relationship → categories, single)
- `tags` (relationship → tags, many)

Métadonnées :
- `platforms` (select multiple: web, macos, windows, linux, ios, android)
- `features` (array of text) - Liste des fonctionnalités
- `featured` (checkbox) - Mis en avant
- `sponsored` (checkbox) - Sponsorisé

Stats (calculées automatiquement) :
- `stats.upvoteCount` (number)
- `stats.reviewCount` (number)
- `stats.averageRating` (number)
- `stats.clickCount` (number)

SEO :
- `seo.metaTitle` (text)
- `seo.metaDescription` (textarea, max 160)

## Categories

- `name` (text, required)
- `slug` (text, unique)
- `description` (textarea)
- `icon` (text) - Nom icône Lucide
- `color` (text) - Couleur hex
- `order` (number) - Ordre d'affichage

## Tags

- `name` (text, required)
- `slug` (text, unique)

## Reviews

- `tool` (relationship → tools, required)
- `user` (relationship → users, required)
- `rating` (number, 1-5, required)
- `title` (text, max 100)
- `content` (textarea, max 2000, required)
- `pros` (array, max 5) - Points positifs
- `cons` (array, max 5) - Points négatifs
- `verified` (checkbox) - Utilisateur vérifié
- `helpful` (number) - Compteur "utile"

**Contrainte** : Un user ne peut poster qu'une review par outil.

## Upvotes

- `tool` (relationship → tools, required)
- `user` (relationship → users, required)

**Contrainte** : Index unique sur (tool, user) - un seul upvote par user/tool.

## Articles

- `title` (text, required)
- `slug` (text, unique)
- `excerpt` (textarea, max 300)
- `featuredImage` (upload → media)
- `content` (richText, required)
- `author` (relationship → users)
- `category` (select: guide, comparison, news, tutorial)
- `relatedTools` (relationship → tools, many)
- `status` (select: draft, published)
- `publishedAt` (date)
- `seo.metaTitle`, `seo.metaDescription`, `seo.keywords`

## Users

Auth intégrée Payload :
- `email` (email, unique) - Auto par Payload auth
- `password` - Auto par Payload auth
- `name` (text, required)
- `avatar` (upload → media)
- `role` (select: member, admin)
- `bio` (textarea, max 500)

## Media

Upload config :
- Formats : images uniquement
- Dossier : `public/media`
- Tailles générées :
  - `thumbnail` : 100x100
  - `card` : 400x300
  - `hero` : 1200x630

Champs :
- `alt` (text) - Texte alternatif
- `caption` (text) - Légende

## Hooks recommandés

### afterChange sur Reviews
```typescript
// Recalculer averageRating et reviewCount sur l'outil
async ({ doc, req }) => {
  const reviews = await req.payload.find({
    collection: 'reviews',
    where: { tool: { equals: doc.tool } },
  })
  const avg = reviews.docs.reduce((sum, r) => sum + r.rating, 0) / reviews.totalDocs
  await req.payload.update({
    collection: 'tools',
    id: doc.tool,
    data: {
      'stats.reviewCount': reviews.totalDocs,
      'stats.averageRating': Math.round(avg * 10) / 10,
    },
  })
}
```

### afterChange/afterDelete sur Upvotes
```typescript
// Recalculer upvoteCount sur l'outil
async ({ doc, req }) => {
  const count = await req.payload.count({
    collection: 'upvotes',
    where: { tool: { equals: doc.tool } },
  })
  await req.payload.update({
    collection: 'tools',
    id: doc.tool,
    data: { 'stats.upvoteCount': count.totalDocs },
  })
}
```

## Indexes recommandés

```typescript
// Sur tools
{ slug: 1 } // unique
{ category: 1 }
{ 'stats.upvoteCount': -1 }
{ featured: 1, 'stats.upvoteCount': -1 }

// Sur reviews
{ tool: 1, user: 1 } // unique
{ tool: 1, createdAt: -1 }

// Sur upvotes
{ tool: 1, user: 1 } // unique

// Sur articles
{ slug: 1 } // unique
{ status: 1, publishedAt: -1 }
```
