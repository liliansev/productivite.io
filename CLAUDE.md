# productivite.io

Annuaire francophone d'outils SaaS (productivité, IA, automation).

## Stack technique

| Composant | Choix | Justification |
|-----------|-------|---------------|
| **Framework** | Next.js 15 (App Router + PPR) | SEO statique + dynamisme pour upvotes/reviews |
| **Database** | PostgreSQL (Neon.tech) | Relationnel, autoscaling, branching pour tests |
| **ORM** | Drizzle ORM | Plus rapide que Prisma, type-safe, proche du SQL |
| **CMS** | Payload CMS 3.0 (Local API) | Intégré comme librairie dans Next.js |
| **Auth** | Auth.js (NextAuth) | Intégration native Next.js |
| **Search** | Algolia (ou Meilisearch) | Search-as-you-type essentiel pour UX |
| **Styling** | Tailwind CSS + shadcn/ui | Standard pour itérer vite |
| **Tests Unit** | Vitest + Testing Library | Tests composants et utils |
| **Tests E2E** | Playwright | Tests parcours utilisateur |
| **Hébergement** | Vercel | Natif Next.js, edge functions |
| **Domaine** | productivite.io | - |

---

## ⚠️ RÈGLE ABSOLUE : Context7

**AVANT d'utiliser n'importe quel outil, librairie ou framework, TOUJOURS consulter la documentation via Context7.**

### Comment utiliser Context7

Pour chaque outil de la stack, utiliser le MCP Context7 pour récupérer la documentation à jour :

```
Exemples de requêtes Context7 :
- "Next.js 15 App Router documentation"
- "Payload CMS 3.0 collections"
- "Drizzle ORM PostgreSQL setup"
- "Auth.js NextAuth credentials provider"
- "Algolia InstantSearch React"
- "Playwright testing Next.js"
- "Vitest React Testing Library"
- "shadcn/ui components"
- "Tailwind CSS"
- "Neon PostgreSQL serverless"
```

### Quand utiliser Context7

- **AVANT** d'écrire du code utilisant une librairie
- **AVANT** de configurer un outil
- **QUAND** tu rencontres une erreur
- **POUR** vérifier la syntaxe/API actuelle

Ne JAMAIS se fier uniquement à tes connaissances - les APIs changent !

---

## Méthodologie de travail OBLIGATOIRE

### 1. Planification avant exécution

**AVANT de coder quoi que ce soit :**
1. Lire les skills dans `.claude/skills/`
2. Consulter Context7 pour chaque outil de la stack
3. Créer un fichier `PLAN.md` avec le plan complet détaillé
4. **ATTENDRE la validation** de l'utilisateur sur le plan
5. Une fois validé, créer `CHECKLIST.md` avec toutes les tâches

### 2. Exécution séquentielle stricte

**Règles STRICTES :**
- ✅ Exécuter les tâches **UNE PAR UNE**, dans l'ordre
- ✅ **NE JAMAIS sauter** une étape
- ✅ **Cocher** chaque case dans `CHECKLIST.md` quand terminée : `- [x]`
- ✅ **Tester** chaque étape avant de passer à la suivante
- ✅ En cas de blocage, documenter le problème et demander de l'aide
- ❌ Ne pas faire plusieurs tâches en parallèle
- ❌ Ne pas anticiper les tâches futures

### 3. Format de la checklist

```markdown
# CHECKLIST.md

## Phase 1 : Setup projet
- [ ] 1.1 Initialiser projet Next.js 15 avec pnpm
- [ ] 1.2 Configurer base de données Neon.tech
- [ ] 1.3 Installer et configurer Drizzle ORM
- [ ] 1.4 Installer Payload CMS 3.0
- [ ] 1.5 Configurer variables d'environnement
- [ ] 1.6 Vérifier que le projet démarre (pnpm dev)

## Phase 2 : Collections CMS
- [ ] 2.1 Créer collection Users
- [ ] 2.2 Créer collection Media
- [ ] 2.3 Créer collection Categories
...
```

### 4. Tests obligatoires

Après chaque fonctionnalité majeure :
- Écrire les tests unitaires (Vitest)
- Écrire les tests E2E si applicable (Playwright)
- Vérifier que tous les tests passent avant de continuer

---

## Skills disponibles

Lire **OBLIGATOIREMENT** les skills avant de commencer :

| Skill | Fichier | Contenu |
|-------|---------|---------|
| **productivite-io** | `.claude/skills/productivite-io/SKILL.md` | Architecture, structure, conventions |
| **payload-nextjs** | `.claude/skills/payload-nextjs/SKILL.md` | Config Payload, collections, auth |
| **testing** | `.claude/skills/testing/SKILL.md` | Vitest, Playwright, stratégie de tests |

### Références additionnelles

Dans chaque skill, consulter le dossier `references/` :
- `collections.md` - Schémas Payload détaillés
- `components.md` - Composants UI à créer
- `seo.md` - Guide SEO complet
- `algolia.md` - Intégration recherche
- `payload-auth.md` - Auth.js + Payload
- `payload-collections.md` - Patterns collections

---

## Commandes

```bash
# Développement
pnpm dev                    # Serveur de développement

# Build
pnpm build                  # Build production

# Database
pnpm db:generate            # Générer migrations Drizzle
pnpm db:migrate             # Appliquer migrations
pnpm db:studio              # Drizzle Studio (GUI)

# Payload
pnpm payload generate:types # Générer types TypeScript

# Tests
pnpm test                   # Tests unitaires (watch)
pnpm test:coverage          # Tests avec coverage
pnpm test:e2e               # Tests E2E Playwright
pnpm test:e2e:ui            # Tests E2E avec interface
```

---

## Structure cible

```
src/
├── app/
│   ├── (frontend)/         # Routes publiques
│   │   ├── page.tsx        # Homepage
│   │   ├── tools/          # Liste et fiches outils
│   │   ├── categories/     # Catégories
│   │   └── articles/       # Blog
│   ├── (payload)/          # Admin CMS
│   │   └── admin/[[...segments]]/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/  # Auth.js
│   │   └── [...payload]/        # Payload API
│   └── layout.tsx
├── collections/            # Schémas Payload CMS
├── components/
│   ├── ui/                 # shadcn/ui
│   ├── tools/              # Composants outils
│   └── layout/             # Header, Footer
├── db/
│   ├── schema.ts           # Schéma Drizzle
│   ├── index.ts            # Client Drizzle
│   └── migrations/         # Fichiers migration
├── lib/
│   ├── auth.ts             # Config Auth.js
│   ├── algolia.ts          # Client Algolia
│   └── utils.ts            # Helpers
├── tests/
│   ├── setup.ts            # Setup Vitest
│   ├── unit/               # Tests unitaires
│   └── e2e/                # Tests Playwright
└── payload.config.ts       # Config Payload
```

---

## Variables d'environnement requises

```env
# Database (Neon.tech)
DATABASE_URL=postgresql://...

# Payload CMS
PAYLOAD_SECRET=

# Auth.js
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=

# Vercel (auto)
VERCEL_URL=
```

---

## Checklist de démarrage rapide

Quand tu démarres une session :

1. [ ] Lire ce fichier CLAUDE.md
2. [ ] Lire les skills dans `.claude/skills/`
3. [ ] Utiliser Context7 pour vérifier la doc des outils
4. [ ] Créer/mettre à jour PLAN.md si nouveau
5. [ ] Travailler sur CHECKLIST.md tâche par tâche
6. [ ] Cocher les tâches terminées
7. [ ] Tester avant de passer à la suite
