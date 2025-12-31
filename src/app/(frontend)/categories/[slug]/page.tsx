import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ToolCard } from '@/components/tools/tool-card'
import { getCategoryBySlug, getToolsByCategory, getCategories } from '@/lib/actions/tools'
import type { LucideIcon } from 'lucide-react'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Catégorie non trouvée | productivite.io',
    }
  }

  return {
    title: `Outils ${category.name} | productivite.io`,
    description:
      category.description ||
      `Découvrez les meilleurs outils ${category.name.toLowerCase()} pour améliorer votre productivité.`,
  }
}

// Dynamic page - no static params needed with Payload CMS
export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  // Fetch category, tools in category, and all categories for "Other categories" section
  const [category, categoryTools, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getToolsByCategory(slug),
    getCategories(),
  ])

  if (!category) {
    notFound()
  }

  // Get icon component
  const IconComponent = category.icon
    ? (LucideIcons[category.icon as keyof typeof LucideIcons] as LucideIcon)
    : null

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section
        className={`border-b py-12 ${category.color || 'bg-muted/30'}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/categories" className="flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Catégories
            </Link>
            <span>/</span>
            <span className="text-foreground">{category.name}</span>
          </nav>

          <div className="flex items-center gap-4">
            {IconComponent && (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-background shadow-sm">
                <IconComponent className="h-7 w-7 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              {category.description && (
                <p className="mt-1 text-muted-foreground">
                  {category.description}
                </p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                {categoryTools.length} outil{categoryTools.length > 1 ? 's' : ''}{' '}
                dans cette catégorie
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {categoryTools.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
              <h3 className="mb-2 text-lg font-semibold">
                Aucun outil pour l&apos;instant
              </h3>
              <p className="mb-4 text-center text-muted-foreground">
                Cette catégorie ne contient pas encore d&apos;outils.
              </p>
              <Button asChild>
                <Link href="/submit">Proposer un outil</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Other Categories */}
      <section className="border-t bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Autres catégories</h2>
            <Button variant="ghost" asChild>
              <Link href="/categories" className="gap-2">
                Voir toutes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {allCategories
              .filter((c) => c.id !== category.id)
              .map((otherCategory) => {
                const OtherIcon = otherCategory.icon
                  ? (LucideIcons[
                      otherCategory.icon as keyof typeof LucideIcons
                    ] as LucideIcon)
                  : null
                return (
                  <Link
                    key={otherCategory.id}
                    href={`/categories/${otherCategory.slug}`}
                    className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                  >
                    {OtherIcon && <OtherIcon className="h-4 w-4" />}
                    {otherCategory.name}
                  </Link>
                )
              })}
          </div>
        </div>
      </section>
    </div>
  )
}
