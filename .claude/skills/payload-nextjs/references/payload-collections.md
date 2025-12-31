# Payload CMS - Patterns de Collections

## Types de champs

### Champs simples
```typescript
{ name: 'title', type: 'text', required: true }
{ name: 'slug', type: 'text', unique: true }
{ name: 'content', type: 'textarea', maxLength: 2000 }
{ name: 'price', type: 'number', min: 0 }
{ name: 'isActive', type: 'checkbox', defaultValue: true }
{ name: 'publishedAt', type: 'date' }
{ name: 'email', type: 'email' }
```

### Select
```typescript
{
  name: 'status',
  type: 'select',
  options: [
    { label: 'Brouillon', value: 'draft' },
    { label: 'Publié', value: 'published' },
  ],
  defaultValue: 'draft',
}

// Select multiple
{
  name: 'platforms',
  type: 'select',
  hasMany: true,
  options: [
    { label: 'Web', value: 'web' },
    { label: 'iOS', value: 'ios' },
  ],
}
```

### Relations
```typescript
// Single relation
{
  name: 'category',
  type: 'relationship',
  relationTo: 'categories',
  required: true,
}

// Multiple relations
{
  name: 'tags',
  type: 'relationship',
  relationTo: 'tags',
  hasMany: true,
}

// Polymorphic relation
{
  name: 'parent',
  type: 'relationship',
  relationTo: ['pages', 'posts'],
}
```

### Upload (Media)
```typescript
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
  required: true,
}
```

### Rich Text
```typescript
{
  name: 'content',
  type: 'richText',
  required: true,
}
```

### Groups
```typescript
{
  name: 'seo',
  type: 'group',
  fields: [
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
  ],
}
```

### Arrays
```typescript
{
  name: 'features',
  type: 'array',
  maxRows: 10,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
  ],
}
```

### Blocks (contenu flexible)
```typescript
{
  name: 'layout',
  type: 'blocks',
  blocks: [
    {
      slug: 'hero',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      slug: 'content',
      fields: [
        { name: 'richText', type: 'richText' },
      ],
    },
  ],
}
```

## Access Control

### Patterns courants

```typescript
// Public en lecture
access: {
  read: () => true,
}

// Authentifié requis
access: {
  create: ({ req }) => !!req.user,
}

// Admin uniquement
access: {
  update: ({ req }) => req.user?.role === 'admin',
  delete: ({ req }) => req.user?.role === 'admin',
}

// Propriétaire ou admin
access: {
  update: ({ req }) => {
    if (req.user?.role === 'admin') return true
    return { user: { equals: req.user?.id } }
  },
}

// Lecture conditionnelle (ex: articles publiés)
access: {
  read: ({ req }) => {
    if (req.user?.role === 'admin') return true
    return { status: { equals: 'published' } }
  },
}
```

### Access sur les champs

```typescript
{
  name: 'role',
  type: 'select',
  options: ['member', 'admin'],
  access: {
    update: ({ req }) => req.user?.role === 'admin',
  },
}
```

## Hooks

### beforeValidate
```typescript
beforeValidate: [
  ({ data }) => {
    // Générer slug automatiquement
    if (data.name && !data.slug) {
      data.slug = slugify(data.name)
    }
    return data
  },
]
```

### beforeChange
```typescript
beforeChange: [
  ({ data, req, operation }) => {
    if (operation === 'create') {
      data.author = req.user.id
    }
    return data
  },
]
```

### afterChange
```typescript
afterChange: [
  async ({ doc, req, operation }) => {
    if (operation === 'create') {
      // Envoyer notification, mettre à jour cache, etc.
      await sendNotification(doc)
    }
    return doc
  },
]
```

### afterRead
```typescript
afterRead: [
  ({ doc, req }) => {
    // Ajouter champ calculé
    doc.fullName = `${doc.firstName} ${doc.lastName}`
    return doc
  },
]
```

## Admin UI

### Configuration collection
```typescript
admin: {
  useAsTitle: 'name',
  defaultColumns: ['name', 'category', 'status', 'updatedAt'],
  group: 'Contenu', // Grouper dans la sidebar
  description: 'Description affichée dans l\'admin',
  listSearchableFields: ['name', 'description'],
  pagination: {
    defaultLimit: 20,
  },
}
```

### Configuration champ
```typescript
{
  name: 'slug',
  type: 'text',
  admin: {
    position: 'sidebar',
    description: 'URL-friendly identifier',
    placeholder: 'mon-article',
    readOnly: true,
    condition: (data) => data.status === 'published',
  },
}
```

## Validation

```typescript
{
  name: 'email',
  type: 'email',
  validate: async (value, { payload }) => {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: value } },
    })
    if (existing.totalDocs > 0) {
      return 'Cet email est déjà utilisé'
    }
    return true
  },
}
```

## Indexes

```typescript
// Dans la collection
indexes: [
  { fields: { slug: 1 }, options: { unique: true } },
  { fields: { category: 1, createdAt: -1 } },
  { fields: { 'stats.upvoteCount': -1 } },
]
```
