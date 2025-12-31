---
name: testing
description: Guide pour les tests sur productivite.io avec Vitest (unit tests) et Playwright (E2E tests). Utiliser ce skill pour toute tâche de testing incluant : configuration, écriture de tests, mocking, tests d'intégration, et tests end-to-end.
---

# Testing - Vitest + Playwright

## Stack de tests

| Type | Outil | Usage |
|------|-------|-------|
| **Unit tests** | Vitest | Composants, utils, hooks |
| **Integration** | Vitest + Testing Library | Composants avec API |
| **E2E** | Playwright | Parcours utilisateur complets |

## Installation

```bash
# Vitest + Testing Library
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/dom jsdom

# Playwright
pnpm add -D @playwright/test
npx playwright install
```

## Configuration Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['**/e2e/**', 'node_modules'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules', 'tests'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

```typescript
// tests/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))
```

## Configuration Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Structure des tests

```
tests/
├── setup.ts                    # Setup Vitest
├── unit/                       # Tests unitaires
│   ├── utils/
│   │   └── formatPrice.test.ts
│   └── components/
│       └── ToolCard.test.tsx
├── integration/                # Tests d'intégration
│   └── api/
│       └── tools.test.ts
└── e2e/                        # Tests Playwright
    ├── auth.spec.ts
    ├── tools.spec.ts
    └── search.spec.ts
```

## Exemples de tests

### Unit test - Composant
```typescript
// tests/unit/components/ToolCard.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ToolCard } from '@/components/tools/ToolCard'

const mockTool = {
  id: '1',
  name: 'Notion',
  slug: 'notion',
  tagline: 'All-in-one workspace',
  logo: { url: '/notion.png' },
  category: { name: 'Productivity', slug: 'productivity' },
  pricing: { model: 'freemium', startingPrice: 8 },
  stats: { upvoteCount: 42, averageRating: 4.5 },
}

describe('ToolCard', () => {
  it('renders tool name and tagline', () => {
    render(<ToolCard tool={mockTool} />)
    
    expect(screen.getByText('Notion')).toBeInTheDocument()
    expect(screen.getByText('All-in-one workspace')).toBeInTheDocument()
  })

  it('displays upvote count', () => {
    render(<ToolCard tool={mockTool} />)
    
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('links to tool page', () => {
    render(<ToolCard tool={mockTool} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/tools/notion')
  })
})
```

### Unit test - Utility
```typescript
// tests/unit/utils/formatPrice.test.ts
import { describe, it, expect } from 'vitest'
import { formatPrice } from '@/lib/utils'

describe('formatPrice', () => {
  it('formats price with euro symbol', () => {
    expect(formatPrice(29)).toBe('29 €/mois')
  })

  it('returns "Gratuit" for 0 or null', () => {
    expect(formatPrice(0)).toBe('Gratuit')
    expect(formatPrice(null)).toBe('Gratuit')
  })

  it('returns "Sur devis" for undefined with custom flag', () => {
    expect(formatPrice(undefined, { custom: true })).toBe('Sur devis')
  })
})
```

### E2E test - Playwright
```typescript
// tests/e2e/tools.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Tools Page', () => {
  test('displays list of tools', async ({ page }) => {
    await page.goto('/tools')
    
    // Vérifie que la page charge
    await expect(page.locator('h1')).toContainText('Outils')
    
    // Vérifie qu'il y a des outils
    const toolCards = page.locator('[data-testid="tool-card"]')
    await expect(toolCards).toHaveCount({ min: 1 })
  })

  test('filters by category', async ({ page }) => {
    await page.goto('/tools')
    
    // Clique sur un filtre catégorie
    await page.click('text=Productivité')
    
    // Vérifie l'URL
    await expect(page).toHaveURL(/category=productivite/)
    
    // Vérifie que les résultats sont filtrés
    const toolCards = page.locator('[data-testid="tool-card"]')
    await expect(toolCards.first()).toBeVisible()
  })

  test('search works', async ({ page }) => {
    await page.goto('/tools')
    
    // Tape dans la recherche
    await page.fill('[data-testid="search-input"]', 'notion')
    
    // Attend les résultats
    await page.waitForSelector('[data-testid="search-results"]')
    
    // Vérifie qu'on trouve Notion
    await expect(page.locator('text=Notion')).toBeVisible()
  })
})
```

### E2E test - Auth
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('login flow', async ({ page }) => {
    await page.goto('/auth/login')
    
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Vérifie la redirection
    await expect(page).toHaveURL('/')
    
    // Vérifie qu'on est connecté
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test('register flow', async ({ page }) => {
    await page.goto('/auth/register')
    
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/')
  })

  test('upvote requires auth', async ({ page }) => {
    await page.goto('/tools/notion')
    
    // Clique sur upvote sans être connecté
    await page.click('[data-testid="upvote-button"]')
    
    // Vérifie qu'on est redirigé vers login
    await expect(page).toHaveURL(/\/auth\/login/)
  })
})
```

### E2E test - Review
```typescript
// tests/e2e/reviews.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Reviews', () => {
  test.beforeEach(async ({ page }) => {
    // Login avant chaque test
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/')
  })

  test('submit review', async ({ page }) => {
    await page.goto('/tools/notion')
    
    // Ouvre le formulaire de review
    await page.click('text=Laisser un avis')
    
    // Remplit le formulaire
    await page.click('[data-testid="rating-5"]') // 5 étoiles
    await page.fill('textarea[name="content"]', 'Super outil, je recommande !')
    await page.click('button[type="submit"]')
    
    // Vérifie que la review apparaît
    await expect(page.locator('text=Super outil, je recommande !')).toBeVisible()
  })
})
```

## Scripts package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

## Commandes

```bash
# Unit tests
pnpm test                 # Watch mode
pnpm test:coverage        # Avec coverage

# E2E tests
pnpm test:e2e             # Headless
pnpm test:e2e:ui          # Interface Playwright
pnpm test:e2e:headed      # Voir le navigateur
```

## CI/CD (GitHub Actions)

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```
