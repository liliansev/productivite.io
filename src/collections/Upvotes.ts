import type { CollectionConfig } from 'payload'

export const Upvotes: CollectionConfig = {
  slug: 'upvotes',
  admin: {
    defaultColumns: ['tool', 'visitorId', 'createdAt'],
    group: 'Données',
  },
  fields: [
    {
      name: 'tool',
      type: 'relationship',
      relationTo: 'tools',
      required: true,
      index: true,
    },
    {
      name: 'visitorId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'ID Better Auth de l\'utilisateur (table user.id)',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Recalculer upvoteCount du tool après création
        if (operation === 'create') {
          const toolId = typeof doc.tool === 'object' ? doc.tool.id : doc.tool

          const upvotesCount = await req.payload.count({
            collection: 'upvotes',
            where: {
              tool: {
                equals: toolId,
              },
            },
          })

          await req.payload.update({
            collection: 'tools',
            id: toolId,
            data: {
              upvoteCount: upvotesCount.totalDocs,
            },
          })
        }
        return doc
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        // Recalculer upvoteCount après suppression
        const toolId = typeof doc.tool === 'object' ? doc.tool.id : doc.tool

        const upvotesCount = await req.payload.count({
          collection: 'upvotes',
          where: {
            tool: {
              equals: toolId,
            },
          },
        })

        await req.payload.update({
          collection: 'tools',
          id: toolId,
          data: {
            upvoteCount: upvotesCount.totalDocs,
          },
        })
      },
    ],
  },
}
