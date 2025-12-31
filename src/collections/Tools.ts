import type { CollectionConfig } from 'payload'

export const Tools: CollectionConfig = {
  slug: 'tools',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'pricing', 'status', 'upvoteCount'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'tagline',
      type: 'text',
      maxLength: 100,
      admin: {
        description: 'Courte description (max 100 caractères)',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'URL du site officiel',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'pricing',
      type: 'select',
      options: [
        { label: 'Gratuit', value: 'free' },
        { label: 'Freemium', value: 'freemium' },
        { label: 'Payant', value: 'paid' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
      required: true,
    },
    {
      name: 'platforms',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Web', value: 'web' },
        { label: 'iOS', value: 'ios' },
        { label: 'Android', value: 'android' },
        { label: 'Mac', value: 'mac' },
        { label: 'Windows', value: 'windows' },
        { label: 'Linux', value: 'linux' },
      ],
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
        },
      ],
    },
    {
      name: 'pros',
      type: 'array',
      fields: [
        {
          name: 'pro',
          type: 'text',
        },
      ],
    },
    {
      name: 'cons',
      type: 'array',
      fields: [
        {
          name: 'con',
          type: 'text',
        },
      ],
    },
    {
      name: 'upvoteCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Calculé automatiquement',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Publié', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Titre SEO (60 caractères max)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'Description SEO (160 caractères max)',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
