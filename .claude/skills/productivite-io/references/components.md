# Composants UI - productivite.io

## Bibliothèque de composants

Utiliser **shadcn/ui** comme base. Installer les composants nécessaires :

```bash
npx shadcn@latest init
npx shadcn@latest add button card input badge avatar dropdown-menu dialog sheet tabs select command
```

## Composants métier

### ToolCard

Carte d'aperçu d'un outil pour les listes.

```
┌─────────────────────────────────┐
│ [Logo]  Nom de l'outil     [▲12]│
│         Tagline courte...       │
│ ┌─────┐ ┌─────┐ ┌────────────┐  │
│ │ Web │ │ iOS │ │ Freemium   │  │
│ └─────┘ └─────┘ └────────────┘  │
│ ⭐ 4.5 (23 avis)                │
└─────────────────────────────────┘
```

Props :
- `tool: Tool` - Données de l'outil
- `variant?: 'default' | 'compact' | 'featured'`
- `showUpvote?: boolean`

### ToolDetail

Page complète d'un outil.

Sections :
1. Header (logo, nom, tagline, CTA)
2. Description (richText)
3. Features (liste)
4. Pricing
5. Platforms
6. Reviews
7. Outils similaires

### ReviewCard

Affichage d'une review.

```
┌─────────────────────────────────┐
│ [Avatar] Nom      ⭐⭐⭐⭐⭐      │
│ Il y a 2 jours                  │
│                                 │
│ Titre de la review              │
│ Contenu de la review...         │
│                                 │
│ ✅ Pro 1  ✅ Pro 2              │
│ ❌ Con 1                        │
│                                 │
│ 👍 12 utile                     │
└─────────────────────────────────┘
```

### ReviewForm

Formulaire pour poster une review.

Champs :
- Rating (5 étoiles cliquables)
- Titre (optionnel)
- Contenu (textarea)
- Pros (jusqu'à 5, ajout dynamique)
- Cons (jusqu'à 5, ajout dynamique)

### UpvoteButton

Bouton d'upvote interactif.

États :
- Non connecté → Dialog login
- Connecté, pas voté → Bouton outline
- Connecté, déjà voté → Bouton filled

### CategoryCard

Carte de catégorie.

```
┌─────────────────────────────────┐
│ [Icon]                          │
│ Nom de la catégorie             │
│ 24 outils                       │
└─────────────────────────────────┘
```

### ArticleCard

Carte d'article pour le blog.

```
┌─────────────────────────────────┐
│ [Image featured]                │
│                                 │
│ GUIDE                           │
│ Titre de l'article              │
│ Excerpt...                      │
│                                 │
│ [Avatar] Auteur • 5 min read    │
└─────────────────────────────────┘
```

## Composants layout

### Header

- Logo (lien vers /)
- Navigation principale (Outils, Catégories, Articles)
- Search (Command palette)
- Auth (Login/Avatar dropdown)

### Footer

- Logo + description
- Liens : À propos, Contact, CGU, Confidentialité
- Réseaux sociaux
- Newsletter signup

### Sidebar (filtres)

Pour la page /tools :
- Catégories (checkboxes)
- Prix (radio: tous, gratuit, freemium, payant)
- Plateformes (checkboxes)
- Note minimum (slider)

## Patterns d'interaction

### Infinite scroll / Pagination

Pour les listes d'outils :
```typescript
// Utiliser useInfiniteQuery ou pagination serveur
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['tools', filters],
  queryFn: ({ pageParam = 1 }) => fetchTools({ ...filters, page: pageParam }),
  getNextPageParam: (lastPage) => lastPage.nextPage,
})
```

### Optimistic updates

Pour upvotes et reviews :
```typescript
// Mettre à jour l'UI immédiatement, rollback si erreur
const upvoteMutation = useMutation({
  mutationFn: toggleUpvote,
  onMutate: async (toolId) => {
    await queryClient.cancelQueries(['tool', toolId])
    const previous = queryClient.getQueryData(['tool', toolId])
    queryClient.setQueryData(['tool', toolId], (old) => ({
      ...old,
      stats: {
        ...old.stats,
        upvoteCount: old.hasUpvoted ? old.stats.upvoteCount - 1 : old.stats.upvoteCount + 1,
      },
      hasUpvoted: !old.hasUpvoted,
    }))
    return { previous }
  },
  onError: (err, toolId, context) => {
    queryClient.setQueryData(['tool', toolId], context.previous)
  },
})
```

### Toast notifications

Utiliser le composant Toast de shadcn/ui :
- Succès : review postée, upvote enregistré
- Erreur : échec de connexion, erreur serveur
- Info : connexion requise

## Responsive design

Breakpoints Tailwind :
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablette)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

Règles :
- Mobile-first
- Grid 1 col → 2 cols (md) → 3-4 cols (lg)
- Sidebar devient sheet sur mobile
- Navigation devient hamburger menu sur mobile
