import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

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

    const { toolId } = await request.json()

    if (!toolId) {
      return NextResponse.json(
        { error: 'ID de l\'outil requis' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })
    const userId = session.user.id

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

    return NextResponse.json({
      success: true,
      action,
      upvoteCount: newCount,
      hasUpvoted: action === 'added',
    })
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
    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')

    if (!toolId) {
      return NextResponse.json(
        { error: 'ID de l\'outil requis' },
        { status: 400 }
      )
    }

    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json({
        hasUpvoted: false,
        upvoteCount: 0,
      })
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
    const tool = await payload.findByID({
      collection: 'tools',
      id: toolId,
    })

    return NextResponse.json({
      hasUpvoted: existingUpvote.docs.length > 0,
      upvoteCount: tool.upvoteCount || 0,
    })
  } catch (error) {
    console.error('Get upvote status error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du statut' },
      { status: 500 }
    )
  }
}
