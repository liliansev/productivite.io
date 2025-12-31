import { Metadata } from 'next'
import { Layers } from 'lucide-react'

import { CategoryCard } from '@/components/categories/category-card'
import { getCategories, getTools } from '@/lib/actions/tools'

export const metadata: Metadata = {
  title: 'Catégories d\'outils SaaS | productivite.io',
  description:
    'Explorez toutes les catégories d\'outils SaaS : productivité, IA, automation, design, développement et plus encore.',
}

export default async function CategoriesPage() {
  // Fetch categories and tools from Payload CMS
  const [categories, toolsResult] = await Promise.all([
    getCategories(),
    getTools({ limit: 500 }), // Get all tools to count per category
  ])

  // Calculate tool count per category
  const toolCounts: Record<string, number> = {}
  categories.forEach((category) => {
    toolCounts[category.id] = toolsResult.tools.filter(
      (tool) => tool.category.id === category.id
    ).length
  })

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Toutes les catégories</h1>
              <p className="mt-1 text-muted-foreground">
                {categories.length} catégories pour trouver l&apos;outil
                parfait
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                toolCount={toolCounts[category.id]}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
