# HISTORIQUE.md - productivite.io

> Dernière mise à jour : 31 décembre 2025

---

## État actuel du projet

**Score global : ~75% MVP complété**

| Composant | Statut | Notes |
|-----------|--------|-------|
| Next.js 15 + App Router | ✅ Fonctionnel | |
| PostgreSQL (Neon.tech) | ✅ Fonctionnel | Base de données en production |
| Drizzle ORM | ✅ Fonctionnel | Schema sync manuel |
| Payload CMS 3.0 | ⚠️ Partiel | Admin accessible, erreurs sessions |
| Better Auth | ✅ Fonctionnel | Credentials + Google OAuth prêt |
| Algolia Search | ⚠️ Structure prête | Attente clés API |
| UI (shadcn/ui) | ✅ Fonctionnel | Composants de base en place |
| Sécurité | ✅ 9/10 | Rate limiting, Zod, headers |
| Tests | ❌ Non commencé | Vitest + Playwright à configurer |

---

## Travail récent (dernières sessions)

### Session du 31 décembre 2025

#### 1. Corrections de sécurité (Score 7/10 → 9/10)

**Fichiers créés/modifiés :**
- `src/lib/rate-limit.ts` - Rate limiting avec Upstash Redis (+ fallback mémoire)
- `src/app/api/upvote/route.ts` - Ajout validation Zod + rate limiting
- `next.config.ts` - Security headers configurés

**Headers de sécurité ajoutés :**
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (caméra, micro, géoloc désactivés)
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HSTS)
- X-Powered-By désactivé

**Commit :** `256ea16` - "fix(security): add rate limiting, validation and security headers"

#### 2. Composant MobileNav (Task 6.10)

**Fichiers créés :**
- `src/components/layout/mobile-nav.tsx` - Navigation mobile slide-in

**Fonctionnalités :**
- Overlay avec blur
- Barre de recherche intégrée
- Navigation avec icônes (Accueil, Outils, Catégories)
- Section auth (connexion/inscription ou profil utilisateur)
- Fermeture automatique au changement de route
- Blocage du scroll body quand ouvert

#### 3. Intégration Algolia (Phase 4)

**Fichiers créés :**
- `src/lib/algolia.ts` - Client Algolia (search + admin)
- `src/components/search/algolia-provider.tsx` - Provider InstantSearch
- `src/components/search/search-box.tsx` - SearchBox Algolia
- `src/components/search/search-bar.tsx` - Barre de recherche simple (fallback)

**État :** Structure prête, fonctionne en mode redirect (`/tools?q=...`). Attente des clés API Algolia pour activer InstantSearch.

#### 4. Premier commit Git

**Commit initial :** `0a3573d` - 90 fichiers
**Repository :** https://github.com/liliansev/productivite.io

---

## Ce qui fonctionne

### Frontend public
- ✅ Homepage (`/`) - Hero, catégories, outils récents
- ✅ Liste outils (`/tools`) - Grid avec 5 outils de test
- ✅ Détail outil (`/tools/[slug]`) - Page complète
- ✅ Catégories (`/categories`, `/categories/[slug]`)
- ✅ Recherche - Redirection vers `/tools?q=...`
- ✅ Header responsive avec menu mobile
- ✅ Footer

### Authentification
- ✅ Login (`/login`) - Email/password
- ✅ Register (`/register`) - Création compte
- ✅ Session utilisateur - Better Auth fonctionnel
- ✅ UserMenu - Dropdown avec avatar
- ⚠️ Google OAuth - Config prête, attente credentials

### API
- ✅ `/api/upvote` - Toggle upvote (POST) + status (GET)
- ✅ Rate limiting actif (30 req/min API, 10 req/min auth)
- ✅ Validation Zod sur les inputs

### Admin Payload
- ✅ Accessible sur `/admin`
- ✅ Collections définies (Tools, Categories, Users, Media, Upvotes)
- ⚠️ Erreur sessions : `TypeError: Cannot read properties of undefined (reading 'join')`

---

## Problèmes connus

### 1. Payload Admin - Erreur sessions
**Symptôme :** `TypeError: Cannot read properties of undefined (reading 'join')` dans la console
**Cause probable :** Mismatch entre schema Drizzle et tables Payload (sessions/accounts)
**Impact :** L'admin fonctionne mais avec erreurs console
**Solution à investiguer :** Vérifier la synchronisation des tables auth entre Better Auth et Payload

### 2. Vulnérabilité esbuild (moderate)
**Package :** drizzle-kit → @esbuild-kit/* (deprecated)
**Statut :** Dépendance transitive, hors de notre contrôle
**Action :** Attendre mise à jour upstream de drizzle-kit

### 3. Peer dependencies warnings
```
@dnd-kit/modifiers 9.0.0 → unmet peer @dnd-kit/core@^6.3.0
zod-to-json-schema 3.24.6 → unmet peer zod@^3.24.1
```
**Impact :** Aucun impact fonctionnel pour le moment

---

## Ce qui reste à faire

### Priorité haute (MVP)

#### Tests (Phase 9)
- [ ] Configurer Vitest (`vitest.config.ts`, `src/tests/setup.ts`)
- [ ] Tests unitaires composants clés (ToolCard, UpvoteButton)
- [ ] Configurer Playwright (`playwright.config.ts`)
- [ ] Tests E2E parcours critiques (auth, navigation, upvote)

#### Algolia (finaliser Phase 4)
- [ ] Obtenir clés API Algolia (App ID, Search Key, Admin Key)
- [ ] Configurer variables d'environnement
- [ ] Activer InstantSearch sur `/tools`
- [ ] Hook Payload → Algolia (sync automatique)
- [ ] Script de réindexation initiale

#### SEO (Phase 8)
- [ ] `generateMetadata()` dynamique sur toutes les pages
- [ ] Sitemap dynamique (`src/app/sitemap.ts`)
- [ ] Robots.txt (`src/app/robots.ts`)
- [ ] JSON-LD Schema (SoftwareApplication, WebSite)

### Priorité moyenne

#### Payload Admin
- [ ] Investiguer et corriger l'erreur sessions
- [ ] Vérifier synchronisation tables auth

#### Google OAuth
- [ ] Obtenir credentials Google Cloud Console
- [ ] Configurer `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`
- [ ] Tester le flow OAuth

#### Améliorations UI
- [ ] Filtres sur `/tools` (catégorie, pricing, platform)
- [ ] Pagination ou infinite scroll
- [ ] Loading states (skeletons)

### Priorité basse (post-MVP)

- [ ] Reviews et notes (v2)
- [ ] Blog/Articles (v2)
- [ ] Dashboard utilisateur
- [ ] Notifications
- [ ] Analytics (Vercel Analytics)
- [ ] Error tracking (Sentry)

---

## Variables d'environnement

### Configurées ✅
```env
DATABASE_URL=postgresql://...          # Neon.tech
PAYLOAD_SECRET=...                      # Généré
BETTER_AUTH_SECRET=...                  # Généré
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### À configurer ⏳
```env
# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Upstash Redis (optionnel, fallback mémoire existe)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## Commandes utiles

```bash
# Développement
pnpm dev                    # Serveur local (http://localhost:3000)

# Database
pnpm db:generate            # Générer migrations Drizzle
pnpm db:migrate             # Appliquer migrations
pnpm db:studio              # Interface Drizzle Studio

# Payload
pnpm payload generate:types # Générer types TypeScript

# Tests (à configurer)
pnpm test                   # Tests unitaires Vitest
pnpm test:e2e               # Tests E2E Playwright

# Build & Deploy
pnpm build                  # Build production
pnpm start                  # Serveur production
```

---

## Structure des fichiers clés

```
src/
├── app/
│   ├── (frontend)/              # Routes publiques
│   │   ├── page.tsx             # Homepage
│   │   ├── tools/page.tsx       # Liste outils
│   │   ├── tools/[slug]/page.tsx
│   │   ├── categories/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (payload)/admin/         # Admin CMS
│   └── api/
│       ├── auth/[...all]/       # Better Auth
│       └── upvote/route.ts      # API upvote
├── collections/                 # Schemas Payload
│   ├── Tools.ts
│   ├── Categories.ts
│   ├── Users.ts
│   ├── Media.ts
│   └── Upvotes.ts
├── components/
│   ├── layout/                  # Header, Footer, MobileNav
│   ├── tools/                   # ToolCard, UpvoteButton
│   ├── search/                  # SearchBar, Algolia
│   └── auth/                    # LoginForm, UserMenu
├── lib/
│   ├── auth.ts                  # Better Auth server
│   ├── auth-client.ts           # Better Auth client
│   ├── algolia.ts               # Client Algolia
│   ├── rate-limit.ts            # Rate limiting
│   └── payload.ts               # Client Payload
└── payload.config.ts            # Config Payload CMS
```

---

## Données de test

5 outils créés dans la base :
1. **Notion** - Productivité (freemium)
2. **ChatGPT** - Intelligence Artificielle (freemium)
3. **Figma** - Design (freemium)
4. **Linear** - Gestion de projet (freemium)
5. **Slack** - Communication (freemium)

3 catégories :
1. Productivité
2. Intelligence Artificielle
3. Design

---

## Liens utiles

- **Repository :** https://github.com/liliansev/productivite.io
- **Neon Dashboard :** https://console.neon.tech
- **Payload CMS :** http://localhost:3000/admin
- **Plan détaillé :** `.claude/plans/bright-wishing-giraffe.md`
- **Skills :** `.claude/skills/`
