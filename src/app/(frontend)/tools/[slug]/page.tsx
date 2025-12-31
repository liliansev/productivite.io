import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  X,
  Globe,
  Tag,
  Layers,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UpvoteButton } from '@/components/tools/upvote-button'
import { PricingBadge } from '@/components/ui/pricing-badge'
import { PlatformIcons } from '@/components/ui/platform-icons'
import { ToolCard } from '@/components/tools/tool-card'
import { getToolBySlug, getTools } from '@/lib/actions/tools'

interface ToolPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = await getToolBySlug(slug)

  if (!tool) {
    return {
      title: 'Outil non trouvé | productivite.io',
    }
  }

  return {
    title: `${tool.name} - ${tool.tagline} | productivite.io`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} - ${tool.tagline}`,
      description: tool.description,
      images: tool.logo ? [tool.logo] : [],
    },
  }
}

// Dynamic page - no static params needed with Payload CMS
export const dynamic = 'force-dynamic'

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = await getToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  // Get related tools (same category, excluding current)
  const relatedResult = await getTools({
    category: tool.category.slug,
    limit: 4,
    sort: 'popular',
  })
  const relatedTools = relatedResult.tools.filter((t) => t.id !== tool.id).slice(0, 3)

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/tools" className="flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Tous les outils
            </Link>
            <span>/</span>
            <Link
              href={`/categories/${tool.category.slug}`}
              className="hover:text-foreground"
            >
              {tool.category.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{tool.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="border-b py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: Tool Info */}
            <div className="flex flex-1 gap-6">
              {/* Logo */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-background shadow-sm">
                {tool.logo ? (
                  <Image
                    src={tool.logo}
                    alt={tool.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-muted-foreground">
                    {tool.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold sm:text-4xl">{tool.name}</h1>
                  <PricingBadge pricing={tool.pricing} />
                </div>
                <p className="mt-2 text-lg text-muted-foreground">
                  {tool.tagline}
                </p>

                {/* Meta */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <Link
                    href={`/categories/${tool.category.slug}`}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    <Tag className="h-4 w-4" />
                    {tool.category.name}
                  </Link>
                  <div className="flex items-center gap-1">
                    <Layers className="h-4 w-4" />
                    <PlatformIcons platforms={tool.platforms} showLabels />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <UpvoteButton
                toolId={tool.id}
                initialCount={tool.upvoteCount}
                size="lg"
              />
              <Button size="lg" asChild>
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Visiter le site
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: Description */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>

              {/* Features */}
              {tool.features && tool.features.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Fonctionnalités clés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Pros & Cons */}
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {/* Pros */}
                {tool.pros && tool.pros.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <Check className="h-5 w-5" />
                        Points forts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tool.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Cons */}
                {tool.cons && tool.cons.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <X className="h-5 w-5" />
                        Points faibles
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tool.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Catégorie
                    </span>
                    <Link
                      href={`/categories/${tool.category.slug}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {tool.category.name}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tarification
                    </span>
                    <PricingBadge pricing={tool.pricing} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Plateformes
                    </span>
                    <PlatformIcons platforms={tool.platforms} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Upvotes</span>
                    <span className="font-semibold">{tool.upvoteCount}</span>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <h3 className="font-semibold">Vous utilisez {tool.name} ?</h3>
                  <p className="mt-2 text-sm text-primary-foreground/80">
                    Partagez votre expérience et aidez les autres utilisateurs.
                  </p>
                  <Button variant="secondary" className="mt-4 w-full">
                    Laisser un avis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="border-t bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Outils similaires</h2>
              <Button variant="ghost" asChild>
                <Link
                  href={`/categories/${tool.category.slug}`}
                  className="gap-2"
                >
                  Voir tous
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTools.map((relatedTool) => (
                <ToolCard key={relatedTool.id} tool={relatedTool} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
