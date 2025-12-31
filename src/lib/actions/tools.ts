'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Tool, Category } from '@/types'

// Get Payload instance
async function getPayloadClient() {
  return await getPayload({ config: configPromise })
}

// Transform Payload tool to frontend Tool type
function transformTool(doc: any): Tool {
  return {
    id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
    logo: doc.logo?.url || '',
    tagline: doc.tagline || '',
    description: doc.description || '',
    website: doc.website || '',
    affiliateUrl: doc.affiliateUrl,
    category: doc.category ? transformCategory(doc.category) : {
      id: '',
      name: 'Non catégorisé',
      slug: 'uncategorized',
      description: '',
      icon: 'Folder',
      color: 'bg-gray-500/10',
      order: 99,
    },
    pricing: doc.pricing || 'free',
    platforms: doc.platforms || [],
    features: doc.features?.map((f: any) => f.feature) || [],
    pros: doc.pros?.map((p: any) => p.pro) || [],
    cons: doc.cons?.map((c: any) => c.con) || [],
    upvoteCount: doc.upvoteCount || 0,
    status: doc.status || 'draft',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

// Transform Payload category to frontend Category type
function transformCategory(doc: any): Category {
  return {
    id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
    description: doc.description || '',
    icon: doc.icon || 'Folder',
    color: doc.color || 'bg-gray-500/10',
    order: doc.order || 0,
  }
}

export interface GetToolsOptions {
  category?: string
  pricing?: string
  platform?: string
  sort?: 'popular' | 'recent' | 'name'
  search?: string
  limit?: number
  page?: number
}

export async function getTools(options: GetToolsOptions = {}) {
  const payload = await getPayloadClient()

  const { category, pricing, platform, sort = 'popular', search, limit = 50, page = 1 } = options

  // Build where clause
  const where: any = {
    status: { equals: 'published' },
  }

  if (category) {
    where['category.slug'] = { equals: category }
  }

  if (pricing) {
    where.pricing = { equals: pricing }
  }

  if (platform) {
    where.platforms = { contains: platform }
  }

  if (search) {
    where.or = [
      { name: { contains: search } },
      { tagline: { contains: search } },
    ]
  }

  // Build sort
  let sortField = '-upvoteCount' // Default: popular (descending)
  if (sort === 'recent') {
    sortField = '-createdAt'
  } else if (sort === 'name') {
    sortField = 'name'
  }

  try {
    const result = await payload.find({
      collection: 'tools',
      where,
      sort: sortField,
      limit,
      page,
      depth: 2, // Include category relationship
    })

    return {
      tools: result.docs.map(transformTool),
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    }
  } catch (error) {
    console.error('Error fetching tools:', error)
    return {
      tools: [],
      totalDocs: 0,
      totalPages: 0,
      page: 1,
      hasNextPage: false,
      hasPrevPage: false,
    }
  }
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const payload = await getPayloadClient()

  try {
    const result = await payload.find({
      collection: 'tools',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      limit: 1,
      depth: 2,
    })

    if (result.docs.length === 0) {
      return null
    }

    return transformTool(result.docs[0])
  } catch (error) {
    console.error('Error fetching tool:', error)
    return null
  }
}

export async function getCategories(): Promise<Category[]> {
  const payload = await getPayloadClient()

  try {
    const result = await payload.find({
      collection: 'categories',
      sort: 'order',
      limit: 100,
    })

    return result.docs.map(transformCategory)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const payload = await getPayloadClient()

  try {
    const result = await payload.find({
      collection: 'categories',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return null
    }

    return transformCategory(result.docs[0])
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

export async function getToolsByCategory(categorySlug: string): Promise<Tool[]> {
  const result = await getTools({ category: categorySlug })
  return result.tools
}
