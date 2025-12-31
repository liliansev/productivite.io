import { Metadata } from 'next'
import Link from 'next/link'
import { Filter, LayoutGrid, List, SlidersHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToolCard } from '@/components/tools/tool-card'
import { getTools, getCategories } from '@/lib/actions/tools'
import type { Pricing, Platform } from '@/types'

export const metadata: Metadata = {
  title: 'Tous les outils SaaS | productivite.io',
  description:
    'Explorez notre catalogue complet d\'outils SaaS pour la productivité, l\'IA et l\'automation. Filtrez par catégorie, prix et plateforme.',
}

const pricingOptions: { value: Pricing; label: string }[] = [
  { value: 'free', label: 'Gratuit' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Payant' },
  { value: 'enterprise', label: 'Enterprise' },
]

const platformOptions: { value: Platform; label: string }[] = [
  { value: 'web', label: 'Web' },
  { value: 'mac', label: 'Mac' },
  { value: 'windows', label: 'Windows' },
  { value: 'linux', label: 'Linux' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
]

interface ToolsPageProps {
  searchParams: Promise<{
    category?: string
    pricing?: string
    platform?: string
    sort?: string
    q?: string
  }>
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const params = await searchParams
  const { category, pricing, platform, sort, q } = params

  // Fetch data from Payload CMS using server actions
  const [toolsResult, categories] = await Promise.all([
    getTools({
      category,
      pricing,
      platform,
      sort: (sort as 'popular' | 'recent' | 'name') || 'popular',
      search: q,
    }),
    getCategories(),
  ])

  const filteredTools = toolsResult.tools
  const activeFiltersCount = [category, pricing, platform].filter(Boolean).length

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tous les outils</h1>
              <p className="mt-1 text-muted-foreground">
                {filteredTools.length} outil{filteredTools.length > 1 ? 's' : ''}{' '}
                trouvé{filteredTools.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trier par :</span>
              <div className="flex gap-1">
                <Button
                  variant={!sort || sort === 'popular' ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link
                    href={{
                      pathname: '/tools',
                      query: { ...params, sort: 'popular' },
                    }}
                  >
                    Populaires
                  </Link>
                </Button>
                <Button
                  variant={sort === 'recent' ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link
                    href={{
                      pathname: '/tools',
                      query: { ...params, sort: 'recent' },
                    }}
                  >
                    Récents
                  </Link>
                </Button>
                <Button
                  variant={sort === 'name' ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link
                    href={{
                      pathname: '/tools',
                      query: { ...params, sort: 'name' },
                    }}
                  >
                    A-Z
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="sticky top-24 space-y-6">
              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif
                    {activeFiltersCount > 1 ? 's' : ''}
                  </span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/tools">Effacer</Link>
                  </Button>
                </div>
              )}

              {/* Category Filter */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Filter className="h-4 w-4" />
                  Catégories
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={{
                        pathname: '/tools',
                        query: {
                          ...params,
                          category: category === cat.slug ? undefined : cat.slug,
                        },
                      }}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        category === cat.slug
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Pricing Filter */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <SlidersHorizontal className="h-4 w-4" />
                  Tarification
                </h3>
                <div className="space-y-1">
                  {pricingOptions.map((option) => (
                    <Link
                      key={option.value}
                      href={{
                        pathname: '/tools',
                        query: {
                          ...params,
                          pricing:
                            pricing === option.value ? undefined : option.value,
                        },
                      }}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        pricing === option.value
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Platform Filter */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <LayoutGrid className="h-4 w-4" />
                  Plateformes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {platformOptions.map((option) => (
                    <Link
                      key={option.value}
                      href={{
                        pathname: '/tools',
                        query: {
                          ...params,
                          platform:
                            platform === option.value ? undefined : option.value,
                        },
                      }}
                    >
                      <Badge
                        variant={
                          platform === option.value ? 'default' : 'outline'
                        }
                        className="cursor-pointer"
                      >
                        {option.label}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Tools Grid */}
          <main className="flex-1">
            {filteredTools.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
                <List className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">Aucun outil trouvé</h3>
                <p className="mb-4 text-center text-muted-foreground">
                  Essayez de modifier vos filtres ou d&apos;effectuer une autre
                  recherche.
                </p>
                <Button asChild>
                  <Link href="/tools">Voir tous les outils</Link>
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
