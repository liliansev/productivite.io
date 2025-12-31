import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function seed() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')

  const payload = await getPayload({ config })

  console.log('Seeding database...')

  // 1. Create admin user
  try {
    const existingAdmins = await payload.find({
      collection: 'admins',
      limit: 1,
    })

    if (existingAdmins.totalDocs === 0) {
      await payload.create({
        collection: 'admins',
        data: {
          email: 'admin@productivite.io',
          password: 'Admin123!',
          name: 'Admin',
        },
      })
      console.log('Admin created: admin@productivite.io')
    } else {
      console.log('Admin already exists, skipping...')
    }
  } catch (error) {
    console.error('Error creating admin:', error)
  }

  // 2. Create categories
  const categories = [
    { name: 'Productivit\u00e9', slug: 'productivite', description: 'Outils pour am\u00e9liorer votre productivit\u00e9 au quotidien', icon: 'Zap', color: 'bg-yellow-50', order: 1 },
    { name: 'IA & Automation', slug: 'ia-automation', description: 'Outils d\'intelligence artificielle et d\'automatisation', icon: 'Bot', color: 'bg-purple-50', order: 2 },
    { name: 'Design', slug: 'design', description: 'Outils de design et de cr\u00e9ation graphique', icon: 'Palette', color: 'bg-pink-50', order: 3 },
    { name: 'D\u00e9veloppement', slug: 'developpement', description: 'Outils pour les d\u00e9veloppeurs', icon: 'Code', color: 'bg-blue-50', order: 4 },
    { name: 'Marketing', slug: 'marketing', description: 'Outils de marketing digital', icon: 'Megaphone', color: 'bg-orange-50', order: 5 },
    { name: 'Communication', slug: 'communication', description: 'Outils de communication et collaboration', icon: 'MessageSquare', color: 'bg-green-50', order: 6 },
  ]

  for (const cat of categories) {
    try {
      const existing = await payload.find({
        collection: 'categories',
        where: { slug: { equals: cat.slug } },
        limit: 1,
      })

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'categories',
          data: cat,
        })
        console.log(`Category created: ${cat.name}`)
      } else {
        console.log(`Category ${cat.name} already exists, skipping...`)
      }
    } catch (error) {
      console.error(`Error creating category ${cat.name}:`, error)
    }
  }

  // 3. Create sample tools
  const tools = [
    {
      name: 'Notion',
      slug: 'notion',
      tagline: 'L\'espace de travail tout-en-un',
      description: 'Notion combine notes, docs, wikis et gestion de projets dans un seul outil puissant.',
      website: 'https://notion.so',
      categorySlug: 'productivite',
      pricing: 'freemium' as const,
      platforms: ['web', 'mac', 'windows', 'ios', 'android'],
      features: [{ feature: 'Notes' }, { feature: 'Wikis' }, { feature: 'Bases de donn\u00e9es' }, { feature: 'Gestion de projets' }, { feature: 'Templates' }],
      pros: [{ pro: 'Tr\u00e8s flexible' }, { pro: 'Design \u00e9l\u00e9gant' }, { pro: 'Bon plan gratuit' }],
      cons: [{ con: 'Courbe d\'apprentissage' }, { con: 'Peut \u00eatre lent' }],
      status: 'published' as const,
    },
    {
      name: 'ChatGPT',
      slug: 'chatgpt',
      tagline: 'L\'assistant IA conversationnel',
      description: 'ChatGPT est un mod\u00e8le de langage avanc\u00e9 capable de g\u00e9n\u00e9rer du texte, r\u00e9pondre \u00e0 des questions et aider dans de nombreuses t\u00e2ches.',
      website: 'https://chat.openai.com',
      categorySlug: 'ia-automation',
      pricing: 'freemium' as const,
      platforms: ['web', 'ios', 'android'],
      features: [{ feature: 'G\u00e9n\u00e9ration de texte' }, { feature: 'Analyse' }, { feature: 'Cr\u00e9ation de code' }, { feature: 'Brainstorming' }],
      pros: [{ pro: 'Tr\u00e8s capable' }, { pro: 'Interface simple' }, { pro: 'Am\u00e9lioration continue' }],
      cons: [{ con: 'Peut halluciner' }, { con: 'N\u00e9cessite v\u00e9rification' }],
      status: 'published' as const,
    },
    {
      name: 'Figma',
      slug: 'figma',
      tagline: 'Design collaboratif dans le cloud',
      description: 'Figma est l\'outil de design d\'interface le plus populaire, permettant la collaboration en temps r\u00e9el.',
      website: 'https://figma.com',
      categorySlug: 'design',
      pricing: 'freemium' as const,
      platforms: ['web', 'mac', 'windows'],
      features: [{ feature: 'Design d\'interface' }, { feature: 'Prototypage' }, { feature: 'Design systems' }, { feature: 'Plugins' }],
      pros: [{ pro: 'Collaboration temps r\u00e9el' }, { pro: 'Plan gratuit g\u00e9n\u00e9reux' }, { pro: 'Communaut\u00e9 active' }],
      cons: [{ con: 'N\u00e9cessite internet' }, { con: 'Performances variables' }],
      status: 'published' as const,
    },
    {
      name: 'Linear',
      slug: 'linear',
      tagline: 'Gestion de projet pour les \u00e9quipes tech',
      description: 'Linear est un outil de gestion de projet moderne, rapide et esth\u00e9tique, con\u00e7u pour les \u00e9quipes de d\u00e9veloppement.',
      website: 'https://linear.app',
      categorySlug: 'developpement',
      pricing: 'freemium' as const,
      platforms: ['web', 'mac', 'windows', 'ios', 'android'],
      features: [{ feature: 'Issues' }, { feature: 'Cycles' }, { feature: 'Roadmaps' }, { feature: 'Int\u00e9grations Git' }],
      pros: [{ pro: 'Ultra rapide' }, { pro: 'UI/UX excellente' }, { pro: 'Raccourcis clavier' }],
      cons: [{ con: 'Pas de version auto-h\u00e9berg\u00e9e' }, { con: 'Moins de fonctionnalit\u00e9s que Jira' }],
      status: 'published' as const,
    },
    {
      name: 'Slack',
      slug: 'slack',
      tagline: 'La messagerie d\'\u00e9quipe',
      description: 'Slack est la plateforme de communication d\'\u00e9quipe la plus utilis\u00e9e, avec des canaux, messages directs et int\u00e9grations.',
      website: 'https://slack.com',
      categorySlug: 'communication',
      pricing: 'freemium' as const,
      platforms: ['web', 'mac', 'windows', 'linux', 'ios', 'android'],
      features: [{ feature: 'Canaux' }, { feature: 'Messages directs' }, { feature: 'Huddles' }, { feature: 'Int\u00e9grations' }, { feature: 'Recherche' }],
      pros: [{ pro: 'Adopt\u00e9 largement' }, { pro: 'Nombreuses int\u00e9grations' }, { pro: 'Fiable' }],
      cons: [{ con: 'Peut \u00eatre distrayant' }, { con: 'Plan gratuit limit\u00e9' }, { con: 'Prix \u00e9lev\u00e9' }],
      status: 'published' as const,
    },
  ]

  for (const tool of tools) {
    try {
      const existing = await payload.find({
        collection: 'tools',
        where: { slug: { equals: tool.slug } },
        limit: 1,
      })

      if (existing.totalDocs === 0) {
        // Get category ID
        const category = await payload.find({
          collection: 'categories',
          where: { slug: { equals: tool.categorySlug } },
          limit: 1,
        })

        if (category.docs[0]) {
          const { categorySlug, ...toolData } = tool
          await payload.create({
            collection: 'tools',
            data: {
              ...toolData,
              category: category.docs[0].id,
            },
          })
          console.log(`Tool created: ${tool.name}`)
        }
      } else {
        console.log(`Tool ${tool.name} already exists, skipping...`)
      }
    } catch (error) {
      console.error(`Error creating tool ${tool.name}:`, error)
    }
  }

  console.log('Seeding complete!')
  process.exit(0)
}

seed().catch(console.error)
