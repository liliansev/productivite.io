import Link from 'next/link'
import { SearchX } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function ToolNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <SearchX className="mb-6 h-16 w-16 text-muted-foreground" />
      <h1 className="mb-2 text-2xl font-bold">Outil non trouvé</h1>
      <p className="mb-6 text-center text-muted-foreground">
        Cet outil n&apos;existe pas ou a été supprimé.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/tools">Voir tous les outils</Link>
        </Button>
        <Button asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </div>
  )
}
