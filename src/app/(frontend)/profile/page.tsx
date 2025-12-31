import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { User, Heart, Settings, Mail, Calendar } from 'lucide-react'

import { auth } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mon profil | productivite.io',
  description: 'Gérez votre profil et vos préférences sur productivite.io',
}

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/login')
  }

  const user = session.user
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase()

  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.image || undefined} alt={user.name || 'Avatar'} />
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold">{user.name || 'Utilisateur'}</h1>
          <p className="mt-1 text-muted-foreground">{user.email}</p>
          {createdAt && (
            <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
              <Calendar className="h-4 w-4" />
              Membre depuis {createdAt}
            </p>
          )}
        </div>

        <Button variant="outline" asChild>
          <Link href="/profile/settings">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Heart className="h-4 w-4" />
              Votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">outils votés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-sm">
              Utilisateur
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Mail className="h-4 w-4" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={user.emailVerified ? 'default' : 'outline'} className="text-sm">
              {user.emailVerified ? 'Vérifié' : 'Non vérifié'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Accédez rapidement à vos fonctionnalités préférées</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/profile/upvotes">
              <Heart className="mr-2 h-4 w-4" />
              Mes votes
            </Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/profile/settings">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres du compte
            </Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/tools">
              <User className="mr-2 h-4 w-4" />
              Explorer les outils
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
