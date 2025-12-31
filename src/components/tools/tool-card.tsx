import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UpvoteButton } from './upvote-button'
import { PricingBadge } from '@/components/ui/pricing-badge'
import { PlatformIcons } from '@/components/ui/platform-icons'
import type { Tool } from '@/types'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="group relative flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/tools/${tool.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Voir {tool.name}</span>
      </Link>

      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        {/* Header: Logo + Name */}
        <div className="flex items-start gap-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border bg-muted">
            {tool.logo ? (
              <Image
                src={tool.logo}
                alt={tool.name}
                fill
                className="object-contain p-2"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                {tool.name[0]}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold leading-tight group-hover:text-primary">
              {tool.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {tool.tagline}
            </p>
          </div>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {tool.category.name}
          </Badge>
          <PricingBadge pricing={tool.pricing} />
        </div>

        {/* Platforms */}
        {tool.platforms && tool.platforms.length > 0 && (
          <PlatformIcons platforms={tool.platforms} />
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t px-5 py-3">
        <UpvoteButton
          toolId={tool.id}
          initialCount={tool.upvoteCount}
          className="relative z-20"
        />

        <span className="flex items-center gap-1 text-sm text-muted-foreground transition-colors group-hover:text-primary">
          Voir
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </CardFooter>
    </Card>
  )
}
