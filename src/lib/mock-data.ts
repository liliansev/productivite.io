// Données mockées pour le développement sans base de données

import type { Category, Tool } from '@/types'

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Productivité',
    slug: 'productivite',
    description: 'Outils pour améliorer votre productivité au quotidien',
    icon: 'Zap',
    color: 'bg-yellow-500/10',
    order: 1,
  },
  {
    id: '2',
    name: 'Intelligence Artificielle',
    slug: 'ia',
    description: "Outils utilisant l'IA pour automatiser vos tâches",
    icon: 'Brain',
    color: 'bg-purple-500/10',
    order: 2,
  },
  {
    id: '3',
    name: 'Automation',
    slug: 'automation',
    description: 'Automatisez vos workflows et gagnez du temps',
    icon: 'Workflow',
    color: 'bg-blue-500/10',
    order: 3,
  },
  {
    id: '4',
    name: 'Design',
    slug: 'design',
    description: 'Outils de design et création graphique',
    icon: 'Palette',
    color: 'bg-pink-500/10',
    order: 4,
  },
  {
    id: '5',
    name: 'Communication',
    slug: 'communication',
    description: 'Outils de communication et collaboration',
    icon: 'MessageSquare',
    color: 'bg-green-500/10',
    order: 5,
  },
  {
    id: '6',
    name: 'Développement',
    slug: 'developpement',
    description: 'Outils pour les développeurs',
    icon: 'Code',
    color: 'bg-slate-500/10',
    order: 6,
  },
]

export const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Notion',
    slug: 'notion',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    tagline: 'Espace de travail tout-en-un pour notes, docs et projets',
    description:
      'Notion est un outil de productivité qui combine notes, bases de données, kanban, wikis et calendriers. Il permet aux équipes et aux individus de centraliser toute leur information dans un seul endroit.',
    website: 'https://notion.so',
    category: mockCategories[0],
    pricing: 'freemium',
    platforms: ['web', 'mac', 'windows', 'ios', 'android'],
    features: [
      'Notes et documents',
      'Bases de données',
      'Tableaux Kanban',
      'Collaboration en temps réel',
    ],
    pros: [
      'Très flexible et personnalisable',
      'Interface intuitive',
      'Plan gratuit généreux',
    ],
    cons: [
      'Peut être lent avec beaucoup de données',
      "Courbe d'apprentissage",
    ],
    upvoteCount: 342,
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'ChatGPT',
    slug: 'chatgpt',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    tagline: 'Assistant IA conversationnel par OpenAI',
    description:
      "ChatGPT est un chatbot IA capable de répondre à vos questions, rédiger du contenu et vous assister dans de nombreuses tâches. Il utilise les modèles GPT d'OpenAI pour générer des réponses naturelles.",
    website: 'https://chat.openai.com',
    category: mockCategories[1],
    pricing: 'freemium',
    platforms: ['web', 'ios', 'android'],
    features: [
      'Conversations naturelles',
      'Génération de contenu',
      'Analyse de documents',
      'Génération de code',
    ],
    pros: ['Très polyvalent', 'Réponses de qualité', 'Amélioration continue'],
    cons: [
      'Peut générer des informations incorrectes',
      'Version Pro payante pour GPT-4',
    ],
    upvoteCount: 567,
    status: 'published',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
  {
    id: '3',
    name: 'Zapier',
    slug: 'zapier',
    logo: 'https://cdn.zapier.com/zapier/images/logos/zapier-logo.png',
    tagline: 'Connectez vos apps et automatisez vos workflows',
    description:
      'Zapier permet de créer des automatisations entre plus de 5000 applications sans code. Créez des "Zaps" qui déclenchent des actions automatiques entre vos outils préférés.',
    website: 'https://zapier.com',
    category: mockCategories[2],
    pricing: 'freemium',
    platforms: ['web'],
    features: [
      "5000+ intégrations",
      'Automatisations sans code',
      'Multi-step Zaps',
      'Filtres et conditions',
    ],
    pros: [
      "Énorme catalogue d'apps",
      'Interface drag & drop',
      'Documentation complète',
    ],
    cons: ['Peut devenir cher', 'Limites sur le plan gratuit'],
    upvoteCount: 289,
    status: 'published',
    createdAt: '2024-01-12T09:30:00Z',
    updatedAt: '2024-01-19T11:20:00Z',
  },
  {
    id: '4',
    name: 'Figma',
    slug: 'figma',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
    tagline: 'Outil de design collaboratif dans le navigateur',
    description:
      "Figma est un outil de design d'interface et de prototypage collaboratif. Il fonctionne entièrement dans le navigateur et permet à plusieurs designers de travailler simultanément.",
    website: 'https://figma.com',
    category: mockCategories[3],
    pricing: 'freemium',
    platforms: ['web', 'mac', 'windows'],
    features: [
      'Design vectoriel',
      'Prototypage interactif',
      'Collaboration temps réel',
      'Design systems',
    ],
    pros: [
      'Collaboration en temps réel',
      'Fonctionne dans le navigateur',
      'Plan gratuit généreux',
    ],
    cons: ['Nécessite connexion internet', 'Peut être lent sur gros fichiers'],
    upvoteCount: 456,
    status: 'published',
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-17T10:15:00Z',
  },
  {
    id: '5',
    name: 'Slack',
    slug: 'slack',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    tagline: "Messagerie d'équipe pour le travail",
    description:
      "Slack est une plateforme de communication d'équipe avec canaux, messages directs et intégrations. Elle centralise les conversations et les outils de l'équipe.",
    website: 'https://slack.com',
    category: mockCategories[4],
    pricing: 'freemium',
    platforms: ['web', 'mac', 'windows', 'linux', 'ios', 'android'],
    features: [
      'Canaux organisés',
      'Messages directs',
      'Appels audio/vidéo',
      '2400+ intégrations',
    ],
    pros: ['Interface intuitive', 'Nombreuses intégrations', 'Recherche puissante'],
    cons: ['Peut être distrayant', 'Historique limité en gratuit'],
    upvoteCount: 234,
    status: 'published',
    createdAt: '2024-01-05T11:30:00Z',
    updatedAt: '2024-01-16T09:45:00Z',
  },
  {
    id: '6',
    name: 'VS Code',
    slug: 'vscode',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg',
    tagline: 'Éditeur de code gratuit et puissant par Microsoft',
    description:
      'Visual Studio Code est un éditeur de code source léger mais puissant. Il supporte des centaines de langages et dispose d\'un écosystème d\'extensions très riche.',
    website: 'https://code.visualstudio.com',
    category: mockCategories[5],
    pricing: 'free',
    platforms: ['mac', 'windows', 'linux'],
    features: [
      'IntelliSense',
      'Débogage intégré',
      'Git intégré',
      'Extensions marketplace',
    ],
    pros: ['Gratuit et open source', 'Très extensible', 'Performances excellentes'],
    cons: ['Consomme de la RAM', "Trop d'extensions peut ralentir"],
    upvoteCount: 678,
    status: 'published',
    createdAt: '2024-01-03T16:00:00Z',
    updatedAt: '2024-01-15T13:30:00Z',
  },
]

export function getToolBySlug(slug: string): Tool | undefined {
  return mockTools.find((tool) => tool.slug === slug)
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return mockTools.filter((tool) => tool.category.slug === categorySlug)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return mockCategories.find((cat) => cat.slug === slug)
}
