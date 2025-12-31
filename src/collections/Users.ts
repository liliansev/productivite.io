import type { CollectionConfig } from 'payload'

// Note: Cette collection est pour les données utilisateurs frontend
// L'authentification frontend est gérée par Better Auth (tables: user, session, account)
// L'authentification admin Payload est gérée par la collection Admins

export const Users: CollectionConfig = {
  slug: 'payload_users', // Préfixé pour éviter conflit avec Better Auth 'user' table
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
    group: 'Données',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Utilisateur', value: 'user' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'user',
      required: true,
    },
    {
      name: 'betterAuthId',
      type: 'text',
      admin: {
        description: 'ID de l\'utilisateur dans Better Auth',
        readOnly: true,
      },
      index: true,
    },
  ],
}
