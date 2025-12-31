import Link from 'next/link'
import { ArrowRight, Search, Sparkles, TrendingUp, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToolCard } from '@/components/tools/tool-card'
import { CategoryGrid } from '@/components/categories/category-grid'
import { getTools, getCategories } from '@/lib/actions/tools'

export default async function HomePage() {
  // Fetch data from Payload CMS
  const [popularResult, recentResult, categories] = await Promise.all([
    getTools({ sort: 'popular', limit: 6 }),
    getTools({ sort: 'recent', limit: 3 }),
    getCategories(),
  ])

  const popularTools = popularResult.tools
  const recentTools = recentResult.tools

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/50 to-background py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>+500 outils référencés</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Trouvez les meilleurs{' '}
              <span className="text-primary">outils SaaS</span> pour votre
              productivité
            </h1>

            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              L&apos;annuaire francophone des outils de productivité,
              d&apos;intelligence artificielle et d&apos;automation. Découvrez,
              comparez et votez pour vos favoris.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mt-10 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un outil (ex: Notion, ChatGPT, Zapier...)"
                  className="h-14 rounded-full pl-12 pr-32 text-base shadow-lg"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full">
                  Rechercher
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Populaires :</span>
              {['Notion', 'ChatGPT', 'Figma', 'Slack'].map((tool) => (
                <Link
                  key={tool}
                  href={`/tools/${tool.toLowerCase()}`}
                  className="rounded-full border bg-background px-3 py-1 transition-colors hover:border-primary hover:text-primary"
                >
                  {tool}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Explorer par catégorie
              </h2>
              <p className="mt-2 text-muted-foreground">
                Trouvez l&apos;outil parfait pour votre besoin
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/categories" className="gap-2">
                Toutes les catégories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8">
            <CategoryGrid categories={categories} />
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="border-t bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Outils populaires
                </h2>
                <p className="text-muted-foreground">
                  Les plus votés par la communauté
                </p>
              </div>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/tools?sort=popular" className="gap-2">
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Tools Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Ajoutés récemment
                </h2>
                <p className="text-muted-foreground">
                  Les derniers outils référencés
                </p>
              </div>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/tools?sort=recent" className="gap-2">
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary py-16 text-primary-foreground sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Vous connaissez un outil incontournable ?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Proposez-le à notre communauté et aidez les autres à découvrir de
              nouveaux outils.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-8"
              asChild
            >
              <Link href="/submit">Soumettre un outil</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
