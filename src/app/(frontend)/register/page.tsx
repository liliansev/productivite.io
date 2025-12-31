import { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Inscription | productivite.io',
  description: 'Créez votre compte productivite.io et rejoignez la communauté pour voter pour vos outils préférés.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-12 px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold">productivite.io</span>
      </Link>

      <RegisterForm />

      <p className="mt-8 text-center text-sm text-muted-foreground max-w-sm">
        En créant un compte, vous acceptez nos{' '}
        <Link href="/cgu" className="underline hover:text-primary">
          Conditions d&apos;utilisation
        </Link>{' '}
        et notre{' '}
        <Link href="/confidentialite" className="underline hover:text-primary">
          Politique de confidentialité
        </Link>
        .
      </p>
    </div>
  )
}
