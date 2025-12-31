import { CategoryCard } from './category-card'
import type { Category } from '@/types'

interface CategoryGridProps {
  categories: Category[]
  toolCounts?: Record<string, number>
}

export function CategoryGrid({ categories, toolCounts }: CategoryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          toolCount={toolCounts?.[category.id]}
        />
      ))}
    </div>
  )
}
