import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Pricing } from '@/types'

interface PricingBadgeProps {
  pricing: Pricing
  className?: string
}

const pricingConfig: Record<Pricing, { label: string; className: string }> = {
  free: {
    label: 'Gratuit',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
  freemium: {
    label: 'Freemium',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  },
  paid: {
    label: 'Payant',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  },
  enterprise: {
    label: 'Enterprise',
    className: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
  },
}

export function PricingBadge({ pricing, className }: PricingBadgeProps) {
  const config = pricingConfig[pricing]

  return (
    <Badge
      variant="secondary"
      className={cn('text-xs font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
