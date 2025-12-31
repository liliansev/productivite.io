# Guide SEO - productivite.io

## Structure des URLs

```
/                           # Homepage
/tools                      # Liste tous les outils
/tools/[slug]               # Fiche outil
/categories                 # Liste catégories
/categories/[slug]          # Outils d'une catégorie
/articles                   # Blog
/articles/[slug]            # Article
/auth/login                 # Connexion
/auth/register              # Inscription
```

## Métadonnées par page

### Homepage
```typescript
export const metadata: Metadata = {
  title: 'productivite.io - Trouvez les meilleurs outils SaaS',
  description: 'Découvrez et comparez +50 outils de productivité, IA et automation. Avis vérifiés, guides pratiques et deals exclusifs.',
  openGraph: {
    title: 'productivite.io - Trouvez les meilleurs outils SaaS',
    description: 'Découvrez et comparez +50 outils de productivité, IA et automation.',
    type: 'website',
    locale: 'fr_FR',
  },
}
```

### Fiche outil (dynamique)
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const tool = await getTool(params.slug)
  return {
    title: `${tool.name} - Avis, Prix et Alternatives | productivite.io`,
    description: tool.seo?.metaDescription || tool.tagline,
    openGraph: {
      title: tool.name,
      description: tool.tagline,
      images: [tool.logo.url],
    },
  }
}
```

### Article (dynamique)
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticle(params.slug)
  return {
    title: article.seo?.metaTitle || `${article.title} | productivite.io`,
    description: article.seo?.metaDescription || article.excerpt,
    openGraph: {
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
  }
}
```

## Sitemap dynamique

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  
  // Pages statiques
  const staticPages = [
    { url: 'https://productivite.io', changeFrequency: 'daily', priority: 1 },
    { url: 'https://productivite.io/tools', changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://productivite.io/categories', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://productivite.io/articles', changeFrequency: 'daily', priority: 0.8 },
  ]
  
  // Outils
  const tools = await payload.find({ collection: 'tools', limit: 1000 })
  const toolPages = tools.docs.map(tool => ({
    url: `https://productivite.io/tools/${tool.slug}`,
    lastModified: tool.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))
  
  // Articles
  const articles = await payload.find({
    collection: 'articles',
    where: { status: { equals: 'published' } },
    limit: 1000,
  })
  const articlePages = articles.docs.map(article => ({
    url: `https://productivite.io/articles/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))
  
  // Catégories
  const categories = await payload.find({ collection: 'categories', limit: 100 })
  const categoryPages = categories.docs.map(cat => ({
    url: `https://productivite.io/categories/${cat.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))
  
  return [...staticPages, ...toolPages, ...articlePages, ...categoryPages]
}
```

## robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/auth/'],
    },
    sitemap: 'https://productivite.io/sitemap.xml',
  }
}
```

## Schema.org (JSON-LD)

### Fiche outil
```typescript
const toolSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: tool.name,
  description: tool.tagline,
  image: tool.logo.url,
  url: tool.links.website,
  applicationCategory: 'BusinessApplication',
  operatingSystem: tool.platforms.join(', '),
  offers: {
    '@type': 'Offer',
    price: tool.pricing.startingPrice || 0,
    priceCurrency: 'EUR',
  },
  aggregateRating: tool.stats.reviewCount > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: tool.stats.averageRating,
    reviewCount: tool.stats.reviewCount,
  } : undefined,
}
```

### Article
```typescript
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.excerpt,
  image: article.featuredImage?.url,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt,
  author: {
    '@type': 'Person',
    name: article.author.name,
  },
  publisher: {
    '@type': 'Organization',
    name: 'productivite.io',
    logo: 'https://productivite.io/logo.png',
  },
}
```

## Bonnes pratiques

1. **Titres** : 50-60 caractères, mot-clé principal en début
2. **Descriptions** : 150-160 caractères, call-to-action
3. **Images** : Alt text descriptif, formats WebP/AVIF
4. **URLs** : Courtes, descriptives, sans paramètres inutiles
5. **Liens internes** : Maillage entre outils similaires et articles
6. **Performance** : Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
