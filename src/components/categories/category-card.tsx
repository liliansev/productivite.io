import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
  toolCount?: number
}

// Helper to get icon from Lucide
function getIcon(name: string): LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>
  return icons[name] || LucideIcons.Folder
}

export function CategoryCard({ category, toolCount }: CategoryCardProps) {
  const IconComponent = getIcon(category.icon || 'Folder')

  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group transition-all hover:shadow-md hover:border-primary/50">
        <CardContent className="flex items-center gap-4 p-4">
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
              category.color || 'bg-primary/10'
            )}
          >
            <IconComponent className="h-6 w-6 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold group-hover:text-primary">
              {category.name}
            </h3>
            {category.description && (
              <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                {category.description}
              </p>
            )}
            {typeof toolCount === 'number' && (
              <p className="mt-1 text-xs text-muted-foreground">
                {toolCount} outil{toolCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
