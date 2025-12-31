// Types temporaires - seront remplacés par les types générés par Payload

export type Pricing = 'free' | 'freemium' | 'paid' | 'enterprise'

export type Platform = 'web' | 'ios' | 'android' | 'mac' | 'windows' | 'linux'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  order?: number
}

export interface Tool {
  id: string
  name: string
  slug: string
  logo?: string
  tagline: string
  description: string
  website: string
  affiliateUrl?: string
  category: Category
  pricing: Pricing
  platforms: Platform[]
  features?: string[]
  pros?: string[]
  cons?: string[]
  upvoteCount: number
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name?: string
  avatar?: {
    url: string
    alt: string
  }
  role: 'user' | 'admin'
}
