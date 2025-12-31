# Authentification - Auth.js + Payload CMS

## Stratégie

- **Auth.js (NextAuth)** : Gère l'authentification (login, sessions, providers)
- **Payload Users** : Stocke les données utilisateur
- **Synchronisation** : Auth.js callbacks créent/mettent à jour les users Payload

## Installation

```bash
pnpm add next-auth@beta @auth/drizzle-adapter
```

## Configuration Auth.js

```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { getPayloadClient } from './payload'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Email/Password
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const payload = await getPayloadClient()
        
        try {
          const { user } = await payload.login({
            collection: 'users',
            data: {
              email: credentials.email as string,
              password: credentials.password as string,
            },
          })
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch {
          return null
        }
      },
    }),
    
    // Google OAuth (à activer plus tard)
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account }) {
      // Sync avec Payload pour OAuth
      if (account?.provider === 'google') {
        const payload = await getPayloadClient()
        
        const existing = await payload.find({
          collection: 'users',
          where: { email: { equals: user.email } },
        })
        
        if (existing.totalDocs === 0) {
          // Créer le user dans Payload
          await payload.create({
            collection: 'users',
            data: {
              email: user.email!,
              name: user.name || 'Utilisateur',
              role: 'member',
              // Pas de password pour OAuth
            },
          })
        }
      }
      return true
    },
  },
  
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
})
```

## Route Handler

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
```

## Types étendus

```typescript
// types/next-auth.d.ts
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
  
  interface User {
    role: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
}
```

## Récupérer l'utilisateur

### Server Component
```typescript
import { auth } from '@/lib/auth'

export default async function Page() {
  const session = await auth()
  
  if (!session?.user) {
    return <LoginPrompt />
  }
  
  return <Dashboard user={session.user} />
}
```

### Client Component
```typescript
'use client'

import { useSession } from 'next-auth/react'

export function UserMenu() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <Skeleton />
  if (!session) return <LoginButton />
  
  return <Avatar user={session.user} />
}
```

### Middleware (protection routes)
```typescript
// middleware.ts
import { auth } from '@/lib/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  const isProtectedPage = req.nextUrl.pathname.startsWith('/dashboard')
  
  if (isProtectedPage && !isLoggedIn) {
    return Response.redirect(new URL('/auth/login', req.url))
  }
  
  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL('/', req.url))
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
```

## Formulaires

### Login
```typescript
// app/auth/login/page.tsx
import { signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    'use server'
    
    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    })
    
    if (result?.error) {
      return { error: 'Email ou mot de passe incorrect' }
    }
    
    redirect('/')
  }
  
  return (
    <form action={handleLogin}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Se connecter</button>
    </form>
  )
}
```

### Register
```typescript
// app/auth/register/page.tsx
import { getPayloadClient } from '@/lib/payload'
import { signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default function RegisterPage() {
  async function handleRegister(formData: FormData) {
    'use server'
    
    const payload = await getPayloadClient()
    
    try {
      await payload.create({
        collection: 'users',
        data: {
          email: formData.get('email') as string,
          password: formData.get('password') as string,
          name: formData.get('name') as string,
          role: 'member',
        },
      })
      
      // Auto-login
      await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      })
      
      redirect('/')
    } catch (error) {
      return { error: 'Cet email est déjà utilisé' }
    }
  }
  
  return (
    <form action={handleRegister}>
      <input name="name" type="text" required placeholder="Nom" />
      <input name="email" type="email" required placeholder="Email" />
      <input name="password" type="password" required placeholder="Mot de passe" />
      <button type="submit">Créer un compte</button>
    </form>
  )
}
```

## SessionProvider

```typescript
// app/providers.tsx
'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

```typescript
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Variables d'environnement

```env
# Auth.js
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optionnel pour l'instant)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```
