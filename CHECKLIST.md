# CHECKLIST - productivite.io

## Phase 1 : Setup projet (Fondations)

- [x] 1.1 Initialiser projet Next.js 15 avec pnpm
- [x] 1.2 Configurer variables d'environnement (.env.local)
- [x] 1.3 Installer et configurer Drizzle ORM
- [x] 1.4 Installer Payload CMS 3.0
- [x] 1.5 Installer shadcn/ui (button, card, input, label, badge, skeleton)
- [x] 1.6 Configurer scripts package.json
- [x] 1.7 Configurer base de données Neon.tech (DATABASE_URL)
- [x] 1.8 Exécuter migrations initiales

---

## Phase 2 : Collections Payload CMS

- [x] 2.1 Créer collection Users
- [x] 2.2 Créer collection Media
- [x] 2.3 Créer collection Categories
- [x] 2.4 Créer collection Tools
- [x] 2.5 Créer collection Upvotes
- [x] 2.6 Mettre à jour payload.config.ts avec toutes les collections
- [ ] 2.7 Générer types TypeScript Payload
- [x] 2.8 Résoudre conflit migrations Payload/Better Auth (Tables créées manuellement via SQL)

---

## Phase 3 : Authentification (Better Auth)

- [x] 3.1 Installer Better Auth
- [x] 3.2 Créer schéma auth Drizzle (src/db/auth-schema.ts)
- [x] 3.3 Configurer Better Auth serveur (src/lib/auth.ts)
- [x] 3.4 Configurer Better Auth client (src/lib/auth-client.ts)
- [x] 3.5 Créer route handler API (src/app/api/auth/[...all]/route.ts)
- [x] 3.6 Créer middleware protection routes
- [x] 3.7 Créer composant LoginForm
- [x] 3.8 Créer composant RegisterForm
- [x] 3.9 Créer composant UserMenu
- [x] 3.10 Créer page /login
- [x] 3.11 Créer page /register
- [x] 3.12 Intégrer UserMenu dans Header
- [x] 3.13 Installer composants shadcn manquants (avatar, dropdown-menu)
- [ ] 3.14 Configurer Google OAuth (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) - EN ATTENTE IDs
- [x] 3.15 Tester inscription email/password
- [x] 3.16 Tester connexion email/password (dropdown fixé)
- [ ] 3.17 Tester connexion Google OAuth - EN ATTENTE IDs
- [x] 3.18 Créer page /profile

---

## Phase 4 : Intégration Algolia

- [ ] 4.1 Installer algoliasearch et react-instantsearch
- [ ] 4.2 Configurer client Algolia admin (server-side)
- [ ] 4.3 Configurer client Algolia search (client-side)
- [ ] 4.4 Créer hook Payload → Algolia (afterChange)
- [ ] 4.5 Créer script de réindexation
- [ ] 4.6 Configurer index Algolia (searchable attributes, facets)
- [ ] 4.7 Créer composant SearchBar
- [ ] 4.8 Créer composant SearchResults
- [ ] 4.9 Créer composant SearchFilters
- [ ] 4.10 Intégrer recherche dans Header
- [ ] 4.11 Intégrer recherche dans page /tools

---

## Phase 5 : Pages Frontend

- [x] 5.1 Créer layout principal (src/app/(frontend)/layout.tsx)
- [x] 5.2 Créer composant Header
- [x] 5.3 Créer composant Footer
- [x] 5.4 Créer Homepage (src/app/(frontend)/page.tsx)
- [x] 5.5 Créer page liste outils (src/app/(frontend)/tools/page.tsx)
- [x] 5.6 Créer page détail outil (src/app/(frontend)/tools/[slug]/page.tsx)
- [x] 5.7 Créer page liste catégories (src/app/(frontend)/categories/page.tsx)
- [x] 5.8 Créer page détail catégorie (src/app/(frontend)/categories/[slug]/page.tsx)
- [x] 5.9 Créer pages auth (login, register)
- [x] 5.10 Créer page profil utilisateur

---

## Phase 6 : Composants UI

- [x] 6.1 Créer ToolCard
- [x] 6.2 Créer UpvoteButton
- [x] 6.3 Créer CategoryCard
- [x] 6.4 Créer CategoryGrid
- [x] 6.5 Créer PricingBadge
- [x] 6.6 Créer PlatformIcons
- [x] 6.7 Créer LoginForm
- [x] 6.8 Créer RegisterForm
- [x] 6.9 Créer UserMenu
- [ ] 6.10 Créer MobileNav (menu hamburger)

---

## Phase 7 : API Routes & Server Actions

- [x] 7.1 Créer API route upvote (POST toggle)
- [x] 7.2 Créer server action getTools(filters)
- [x] 7.3 Créer server action getToolBySlug(slug)
- [x] 7.4 Créer server action toggleUpvote(toolId) (via API route)
- [x] 7.5 Connecter UpvoteButton à l'API
- [x] 7.6 Remplacer mock data par données Payload

---

## Phase 8 : SEO & Performance

- [ ] 8.1 Ajouter generateMetadata à toutes les pages
- [ ] 8.2 Créer sitemap.ts
- [ ] 8.3 Créer robots.ts
- [ ] 8.4 Ajouter JSON-LD Schema (SoftwareApplication)
- [ ] 8.5 Optimiser images (next/image)
- [ ] 8.6 Vérifier Core Web Vitals

---

## Phase 9 : Tests

- [ ] 9.1 Installer et configurer Vitest
- [ ] 9.2 Créer setup.ts pour tests
- [ ] 9.3 Écrire tests ToolCard
- [ ] 9.4 Écrire tests UpvoteButton
- [ ] 9.5 Écrire tests utils
- [ ] 9.6 Installer et configurer Playwright
- [ ] 9.7 Écrire test E2E homepage
- [ ] 9.8 Écrire test E2E tools page
- [ ] 9.9 Écrire test E2E auth flow
- [ ] 9.10 Vérifier coverage > 80%

---

## Phase 10 : Déploiement

- [ ] 10.1 Connecter repo GitHub
- [ ] 10.2 Configurer Vercel
- [ ] 10.3 Ajouter variables d'environnement Vercel
- [ ] 10.4 Configurer domaine productivite.io
- [ ] 10.5 Vérifier SSL
- [ ] 10.6 Tester build production
- [ ] 10.7 Activer Vercel Analytics

---

## Critères de validation MVP

- [ ] Admin Payload accessible et fonctionnel
- [ ] CRUD outils via admin
- [ ] Recherche Algolia instantanée
- [ ] Inscription/Connexion (email + Google)
- [ ] Upvote outils (authentifié)
- [ ] Pages SEO-friendly
- [ ] Responsive mobile
- [ ] Tests passent (unit + E2E critiques)
- [ ] Déployé sur Vercel

---

## Progression

| Phase | Status | Progression |
|-------|--------|-------------|
| Phase 1 - Setup | Terminé | 8/8 |
| Phase 2 - Collections | En cours | 7/8 |
| Phase 3 - Auth | En cours | 16/18 |
| Phase 4 - Algolia | Non commencé | 0/11 |
| Phase 5 - Frontend | Terminé | 10/10 |
| Phase 6 - Composants | En cours | 9/10 |
| Phase 7 - API | Terminé | 6/6 |
| Phase 8 - SEO | Non commencé | 0/6 |
| Phase 9 - Tests | Non commencé | 0/10 |
| Phase 10 - Deploy | Non commencé | 0/7 |

**Total : ~41/93 tâches (~44%)**
