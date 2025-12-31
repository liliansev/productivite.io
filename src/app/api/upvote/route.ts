import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { rateLimiters, checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'

// Validation schemas
const upvoteBodySchema = z.object({
  toolId: z.union([z.string(), z.number()]).transform((val) =>
    typeof val === 'string' ? parseInt(val, 10) : val
  ).refine((val) => !isNaN(val) && val > 0, {
    message: "L'ID de l'outil doit être un nombre positif",
  }),
})

const upvoteQuerySchema = z.object({
  toolId: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
    message: "L'ID de l'outil doit être un nombre positif",
  }),
})

export async function POST(request: NextRequest) {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour voter' },
        { status: 401 }
      )
    }

    // Rate limiting (per user)
    const identifier = getClientIdentifier(request, session.user.id)
    const rateLimit = await checkRateLimit(request, rateLimiters.api, identifier)

    if (rateLimit.limited) {
      return NextResponse.json(
        { error: rateLimit.response?.error },
        {
          status: rateLimit.status,
          headers: rateLimit.headers,
        }
      )
    }

    // Parse and validate body
    const body = await request.json().catch(() => ({}))
    const validation = upvoteBodySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || "Données invalides" },
        { status: 400 }
      )
    }

    const { toolId } = validation.data
    const payload = await getPayload({ config: configPromise })
    const userId = session.user.id

    // Verify tool exists
    try {
      await payload.findByID({
        collection: 'tools',
        id: toolId,
      })
    } catch {
      return NextResponse.json(
        { error: "Outil introuvable" },
        { status: 404 }
      )
    }

    // Check if user already upvoted this tool
    const existingUpvote = await payload.find({
      collection: 'upvotes',
      where: {
        and: [
          { tool: { equals: toolId } },
          { visitorId: { equals: userId } },
        ],
      },
      limit: 1,
    })

    let action: 'added' | 'removed'
    let newCount: number

    if (existingUpvote.docs.length > 0) {
      // Remove upvote
      await payload.delete({
        collection: 'upvotes',
        id: existingUpvote.docs[0].id,
      })
      action = 'removed'

      // Get updated count
      const tool = await payload.findByID({
        collection: 'tools',
        id: toolId,
      })
      newCount = tool.upvoteCount || 0
    } else {
      // Add upvote
      await payload.create({
        collection: 'upvotes',
        data: {
          tool: toolId,
          visitorId: userId,
        },
      })
      action = 'added'

      // Get updated count
      const tool = await payload.findByID({
        collection: 'tools',
        id: toolId,
      })
      newCount = tool.upvoteCount || 0
    }

    return NextResponse.json(
      {
        success: true,
        action,
        upvoteCount: newCount,
        hasUpvoted: action === 'added',
      },
      { headers: rateLimit.headers }
    )
  } catch (error) {
    console.error('Upvote error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du vote' },
      { status: 500 }
    )
  }
}

// Check if user has upvoted a tool
export async function GET(request: NextRequest) {
  try {
    // Rate limiting (per IP for GET requests)
    const rateLimit = await checkRateLimit(request, rateLimiters.api)

    if (rateLimit.limited) {
      return NextResponse.json(
        { error: rateLimit.response?.error },
        {
          status: rateLimit.status,
          headers: rateLimit.headers,
        }
      )
    }

    const { searchParams } = new URL(request.url)
    const toolIdParam = searchParams.get('toolId')

    // Validate query parameter
    const validation = upvoteQuerySchema.safeParse({ toolId: toolIdParam })

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || "ID de l'outil requis" },
        { status: 400 }
      )
    }

    const toolId = parseInt(validation.data.toolId, 10)

    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json(
        {
          hasUpvoted: false,
          upvoteCount: 0,
        },
        { headers: rateLimit.headers }
      )
    }

    const payload = await getPayload({ config: configPromise })
    const userId = session.user.id

    // Check if user has upvoted
    const existingUpvote = await payload.find({
      collection: 'upvotes',
      where: {
        and: [
          { tool: { equals: toolId } },
          { visitorId: { equals: userId } },
        ],
      },
      limit: 1,
    })

    // Get tool upvote count
    let upvoteCount = 0
    try {
      const tool = await payload.findByID({
        collection: 'tools',
        id: toolId,
      })
      upvoteCount = tool.upvoteCount || 0
    } catch {
      // Tool not found, return 0
    }

    return NextResponse.json(
      {
        hasUpvoted: existingUpvote.docs.length > 0,
        upvoteCount,
      },
      { headers: rateLimit.headers }
    )
  } catch (error) {
    console.error('Get upvote status error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du statut' },
      { status: 500 }
    )
  }
}
