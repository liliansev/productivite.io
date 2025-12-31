import Link from 'next/link'
import { Zap } from 'lucide-react'

const footerLinks = {
  product: {
    title: 'Produit',
    links: [
      { name: 'Tous les outils', href: '/tools' },
      { name: 'Catégories', href: '/categories' },
      { name: 'Nouveautés', href: '/tools?sort=recent' },
      { name: 'Populaires', href: '/tools?sort=popular' },
    ],
  },
  categories: {
    title: 'Catégories',
    links: [
      { name: 'Productivité', href: '/categories/productivite' },
      { name: 'Intelligence Artificielle', href: '/categories/ia' },
      { name: 'Automation', href: '/categories/automation' },
      { name: 'Design', href: '/categories/design' },
    ],
  },
  company: {
    title: 'À propos',
    links: [
      { name: 'Qui sommes-nous', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Soumettre un outil', href: '/submit' },
    ],
  },
  legal: {
    title: 'Légal',
    links: [
      { name: 'Mentions légales', href: '/legal' },
      { name: 'Politique de confidentialité', href: '/privacy' },
      { name: 'CGU', href: '/terms' },
    ],
  },
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">productivite.io</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              L&apos;annuaire francophone des meilleurs outils SaaS pour la
              productivité, l&apos;IA et l&apos;automation.
            </p>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} productivite.io. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
