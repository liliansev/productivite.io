import {
  Globe,
  Smartphone,
  Apple,
  Monitor,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Platform } from '@/types'

interface PlatformIconsProps {
  platforms: Platform[]
  className?: string
  showLabels?: boolean
}

const platformConfig: Record<Platform, { icon: LucideIcon; label: string }> = {
  web: { icon: Globe, label: 'Web' },
  ios: { icon: Smartphone, label: 'iOS' },
  android: { icon: Smartphone, label: 'Android' },
  mac: { icon: Apple, label: 'Mac' },
  windows: { icon: Monitor, label: 'Windows' },
  linux: { icon: Monitor, label: 'Linux' },
}

export function PlatformIcons({ platforms, className, showLabels = false }: PlatformIconsProps) {
  // Deduplicate icons (ios and android both use Smartphone)
  const uniquePlatforms = [...new Set(platforms)]

  if (showLabels) {
    return (
      <div className={cn('flex flex-wrap items-center gap-2', className)}>
        {uniquePlatforms.map((platform) => {
          const config = platformConfig[platform]
          return (
            <span key={platform} className="text-sm">
              {config.label}
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {uniquePlatforms.map((platform) => {
        const config = platformConfig[platform]
        const Icon = config.icon

        return (
          <div
            key={platform}
            title={config.label}
            className="flex h-6 w-6 items-center justify-center rounded bg-muted"
          >
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        )
      })}
    </div>
  )
}
