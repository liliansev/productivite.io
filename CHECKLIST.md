# CHECKLIST - productivite.io (SvelteKit)

## Phase 1 : Setup projet

- [x] 1.1 Initialiser projet SvelteKit 2 avec pnpm
- [x] 1.2 Configurer Svelte 5 (runes)
- [x] 1.3 Installer et configurer Prisma 7
- [x] 1.4 Configurer Neon PostgreSQL (DATABASE_URL)
- [x] 1.5 Installer shadcn-svelte
- [x] 1.6 Configurer Tailwind CSS v4
- [x] 1.7 Configurer Vercel adapter
- [x] 1.8 Creer schema Prisma (User, Tool, Category, Upvote, Review, Session, Account, Verification)
- [x] 1.9 Creer script de seed

---

## Phase 2 : Authentification (Better Auth)

- [x] 2.1 Installer Better Auth
- [x] 2.2 Configurer Better Auth serveur (src/lib/server/auth.ts)
- [x] 2.3 Configurer Better Auth client (src/lib/auth-client.ts)
- [x] 2.4 Creer route handler API (src/routes/api/auth/[...all])
- [x] 2.5 Creer hooks.server.ts pour session
- [x] 2.6 Creer composant LoginForm
- [x] 2.7 Creer composant RegisterForm
- [x] 2.8 Creer composant UserMenu
- [x] 2.9 Creer page /login
- [x] 2.10 Creer page /register
- [x] 2.11 Integrer UserMenu dans Header
- [x] 2.12 Configurer trustedOrigins pour localhost
- [x] 2.13 Tester inscription email/password
- [x] 2.14 Tester connexion email/password
- [ ] 2.15 Configurer Google OAuth (optionnel)
- [x] 2.16 Creer page /profile

---

## Phase 3 : Pages Frontend

- [x] 3.1 Creer layout principal (+layout.svelte)
- [x] 3.2 Creer composant Header
- [x] 3.3 Creer composant Footer
- [x] 3.4 Creer Homepage (+page.svelte)
- [x] 3.5 Creer page liste outils (/tools)
- [x] 3.6 Creer page detail outil (/tools/[slug])
- [x] 3.7 Creer page liste categories (/categories)
- [x] 3.8 Creer page detail categorie (/categories/[slug])
- [x] 3.9 Creer pages auth (login, register)
- [x] 3.10 Creer page /submit (soumettre un outil)

---

## Phase 4 : Composants UI

- [x] 4.1 Creer ToolCard
- [x] 4.2 Creer CategoryCard
- [x] 4.3 Installer composants shadcn (button, input, badge, card, dropdown-menu, avatar, separator, skeleton, sheet, dialog)
- [x] 4.4 Configurer Sonner (toasts)
- [x] 4.5 Creer MobileNav (menu hamburger responsive)

---

## Phase 5 : Systeme d'Upvote

- [x] 5.1 Creer API route upvote POST (toggle)
- [x] 5.2 Creer API route upvote GET (status)
- [x] 5.3 Ajouter props upvote a ToolCard (upvoted, isLoggedIn, onUpvoteChange)
- [x] 5.4 Implementer optimistic updates
- [x] 5.5 Ajouter etat upvote dans homepage
- [x] 5.6 Ajouter etat upvote dans /tools
- [x] 5.7 Ajouter etat upvote dans /tools/[slug]
- [x] 5.8 Ajouter etat upvote dans /categories/[slug]
- [x] 5.9 Tester upvote non connecte (toast)
- [x] 5.10 Tester upvote connecte (toggle)

---

## Phase 6 : Recherche

- [x] 6.1 Installer Algolia (algoliasearch)
- [x] 6.2 Configurer client Algolia (src/lib/algolia.ts, src/lib/server/algolia.ts)
- [x] 6.3 Creer script de synchronisation Prisma -> Algolia (scripts/algolia-sync.ts)
- [x] 6.4 Creer composant SearchBar (SearchCommand avec Command Dialog)
- [x] 6.5 Integrer recherche dans Header (⌘+K pour ouvrir)
- [x] 6.6 Creer page de resultats de recherche (/tools?q= existant)

---

## Phase 7 : SEO & Performance

- [x] 7.1 Ajouter metadonnees a toutes les pages (svelte:head)
- [x] 7.2 Creer sitemap.xml (src/routes/sitemap.xml/+server.ts)
- [x] 7.3 Creer robots.txt (static/robots.txt)
- [ ] 7.4 Ajouter JSON-LD Schema
- [ ] 7.5 Optimiser images
- [ ] 7.6 Verifier Core Web Vitals

---

## Phase 8 : Tests

- [x] 8.1 Installer et configurer Vitest (vitest.config.ts)
- [x] 8.2 Ecrire tests unitaires composants (src/lib/utils.test.ts)
- [x] 8.3 Installer et configurer Playwright (playwright.config.ts)
- [x] 8.4 Ecrire test E2E homepage (tests/homepage.test.ts)
- [x] 8.5 Ecrire test E2E auth flow (tests/auth.test.ts)
- [ ] 8.6 Ecrire test E2E upvote flow

---

## Phase 9 : Deploiement

- [ ] 9.1 Connecter repo GitHub
- [ ] 9.2 Configurer Vercel
- [ ] 9.3 Ajouter variables d'environnement Vercel
- [ ] 9.4 Configurer domaine productivite.io
- [ ] 9.5 Tester build production
- [ ] 9.6 Activer Vercel Analytics

---

## Criteres de validation MVP

- [x] Base de donnees fonctionnelle avec seed
- [x] Inscription/Connexion email
- [x] Upvote outils (authentifie)
- [x] Pages principales (home, tools, categories)
- [x] Page profil utilisateur
- [x] Page soumission d'outil
- [x] Recherche fonctionnelle (Algolia)
- [x] Responsive mobile (MobileNav)
- [x] SEO de base (meta tags, sitemap, robots.txt)
- [ ] Deploye sur Vercel

---

## Progression

| Phase | Status | Progression |
|-------|--------|-------------|
| Phase 1 - Setup | Termine | 9/9 |
| Phase 2 - Auth | Termine | 15/16 |
| Phase 3 - Frontend | Termine | 10/10 |
| Phase 4 - Composants | Termine | 5/5 |
| Phase 5 - Upvote | Termine | 10/10 |
| Phase 6 - Recherche | Termine | 6/6 |
| Phase 7 - SEO | En cours | 3/6 |
| Phase 8 - Tests | En cours | 5/6 |
| Phase 9 - Deploy | Non commence | 0/6 |

**Total : 63/74 taches (~85%)**

---

## Notes techniques

### Stack
- **Framework**: SvelteKit 2 + Svelte 5 (runes)
- **ORM**: Prisma 7 avec @prisma/adapter-pg
- **Base de donnees**: Neon PostgreSQL
- **Auth**: Better Auth
- **UI**: shadcn-svelte + Tailwind CSS v4
- **Icons**: Lucide Svelte
- **Toasts**: Sonner

### Fichiers cles
- `src/lib/server/prisma.ts` - Client Prisma
- `src/lib/server/auth.ts` - Config Better Auth
- `src/routes/api/upvote/+server.ts` - API upvote
- `prisma/schema.prisma` - Schema base de donnees
- `prisma/seed.ts` - Donnees de test
- `src/lib/algolia.ts` - Client Algolia (search)
- `src/lib/components/search/search-command.svelte` - Composant recherche instantanee
- `scripts/algolia-sync.ts` - Sync tools vers Algolia
- `src/routes/sitemap.xml/+server.ts` - Sitemap dynamique
- `vitest.config.ts` - Config tests unitaires
- `playwright.config.ts` - Config tests E2E

### Patterns Svelte 5
- Utiliser `$derived` pour les valeurs reactives derivees des props
- Utiliser `$effect` pour synchroniser les overrides locaux avec les props
- Pattern override: `$state` pour les overrides + `$derived` pour combiner avec les props
