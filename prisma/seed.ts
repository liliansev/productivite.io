import "dotenv/config";
import { PrismaClient, Pricing, Status } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: "Gestion de projet",
    slug: "gestion-projet",
    description: "Outils pour organiser et suivre vos projets",
    icon: "FolderKanban",
    color: "#3B82F6",
    order: 1,
  },
  {
    name: "Automatisation",
    slug: "automatisation",
    description: "Automatisez vos tâches répétitives",
    icon: "Zap",
    color: "#F59E0B",
    order: 2,
  },
  {
    name: "Intelligence Artificielle",
    slug: "intelligence-artificielle",
    description: "Outils IA pour booster votre productivité",
    icon: "Brain",
    color: "#8B5CF6",
    order: 3,
  },
  {
    name: "Communication",
    slug: "communication",
    description: "Collaborez efficacement avec votre équipe",
    icon: "MessageSquare",
    color: "#10B981",
    order: 4,
  },
  {
    name: "Notes & Documentation",
    slug: "notes-documentation",
    description: "Capturez et organisez vos idées",
    icon: "FileText",
    color: "#EC4899",
    order: 5,
  },
  {
    name: "Design",
    slug: "design",
    description: "Créez des visuels professionnels",
    icon: "Palette",
    color: "#06B6D4",
    order: 6,
  },
  {
    name: "Développement",
    slug: "developpement",
    description: "Outils pour les développeurs",
    icon: "Code",
    color: "#64748B",
    order: 7,
  },
  {
    name: "Marketing",
    slug: "marketing",
    description: "Optimisez votre stratégie marketing",
    icon: "TrendingUp",
    color: "#EF4444",
    order: 8,
  },
];

const tools = [
  // Gestion de projet
  {
    name: "Notion",
    slug: "notion",
    tagline: "Tout-en-un pour la productivité",
    description:
      "Notion est un espace de travail tout-en-un qui combine notes, wikis, bases de données et gestion de projets. Idéal pour les équipes et les individus qui veulent centraliser leur travail.",
    website: "https://notion.so",
    pricing: Pricing.FREEMIUM,
    platforms: ["web", "mac", "windows", "ios", "android"],
    features: [
      "Bases de données flexibles",
      "Templates personnalisables",
      "Collaboration en temps réel",
      "API puissante",
    ],
    pros: [
      "Interface intuitive",
      "Très personnalisable",
      "Plan gratuit généreux",
    ],
    cons: [
      "Peut être lent avec beaucoup de contenu",
      "Courbe d'apprentissage",
    ],
    upvoteCount: 342,
    status: Status.PUBLISHED,
    categorySlug: "gestion-projet",
  },
  {
    name: "Linear",
    slug: "linear",
    tagline: "Issue tracking pour les équipes modernes",
    description:
      "Linear est un outil de gestion de projet conçu pour les équipes produit et développement. Son interface rapide et minimaliste en fait un favori des startups.",
    website: "https://linear.app",
    pricing: Pricing.FREEMIUM,
    platforms: ["web", "mac", "windows", "ios", "android"],
    features: [
      "Interface ultra-rapide",
      "Cycles et roadmaps",
      "Intégration Git",
      "Raccourcis clavier",
    ],
    pros: ["Très performant", "Design épuré", "Excellent pour les devs"],
    cons: ["Moins flexible que d'autres outils", "Prix élevé pour les équipes"],
    upvoteCount: 287,
    status: Status.PUBLISHED,
    categorySlug: "gestion-projet",
  },
  {
    name: "Asana",
    slug: "asana",
    tagline: "Gérez le travail de votre équipe",
    description:
      "Asana aide les équipes à orchestrer leur travail, des tâches quotidiennes aux initiatives stratégiques. Avec des vues multiples et des automatisations puissantes.",
    website: "https://asana.com",
    pricing: Pricing.FREEMIUM,
    platforms: ["web", "mac", "windows", "ios", "android"],
    features: [
      "Vues liste, board, timeline, calendrier",
      "Automatisations",
      "Portfolios",
      "Formulaires",
    ],
    pros: [
      "Fonctionnalités riches",
      "Bon pour les grandes équipes",
      "Nombreuses intégrations",
    ],
    cons: ["Interface complexe", "Prix élevé", "Peut être overwhelming"],
    upvoteCount: 198,
    status: Status.PUBLISHED,
    categorySlug: "gestion-projet",
  },

  // Automatisation
  {
    name: "Zapier",
    slug: "zapier",
    tagline: "Connectez vos apps favorites",
    description:
      "Zapier permet de créer des automatisations entre plus de 6000 applications sans code. Gagnez du temps en automatisant vos workflows répétitifs.",
    website: "https://zapier.com",
    pricing: Pricing.FREEMIUM,
    platforms: ["web"],
    features: [
      "6000+ intégrations",
      "Zaps multi-étapes",
      "Filtres et formatage",
      "Paths conditionnels",
    ],
    pros: ["Énorme catalogue d'apps", "Facile à utiliser", "Fiable"],
    cons: ["Devient cher rapidement", "Limité en complexité"],
    upvoteCount: 256,
    status: Status.PUBLISHED,
    categorySlug: "automatisation",
  },
  {
    name: "Make",
    slug: "make",
    tagline: "Automatisation visuelle puissante",
    description:
      "Make (anciennement Integromat) offre une interface visuelle pour créer des automatisations complexes. Plus puissant que Zapier pour les scénarios avancés.",
    website: "https://make.com",
    pricing: Pricing.FREEMIUM,
    platforms: ["web"],
    features: [
      "Interface visuelle",
      "Scénarios complexes",
      "Gestion d'erreurs",
      "Data stores",
    ],
    pros: [
      "Très puissant",
      "Meilleur rapport qualité/prix",
      "Scénarios complexes",
    ],
    cons: ["Courbe d'apprentissage", "Moins d'intégrations que Zapier"],
    upvoteCount: 189,
    status: Status.PUBLISHED,
    categorySlug: "automatisation",
  },
  {
    name: "n8n",
    slug: "n8n",
    tagline: "Automatisation open source",
    description:
      "n8n est une plateforme d'automatisation open source et self-hosted. Parfait pour ceux qui veulent garder le contrôle de leurs données.",
    website: "https://n8n.io",
    pricing: Pricing.FREEMIUM,
    platforms: ["web", "self-hosted"],
    features: ["Open source", "Self-hosted", "200+ intégrations", "Code custom"],
    pros: ["Gratuit (self-hosted)", "Contrôle total", "Communauté active"],
    cons: ["Requiert des compétences techniques", "Maintenance nécessaire"],
    upvoteCount: 167,
    status: Status.PUBLISHED,
    categorySlug: "automatisation",
  },

  // Intelligence Artificielle
  {
    name: "ChatGPT",
    slug: "chatgpt",
    tagline: "Assistant IA conversationnel",
    description:
      "ChatGPT d'OpenAI est un assistant IA capable de répondre à des questions, générer du contenu, coder, et bien plus. L'outil IA le plus populaire au monde.",
    website: "https://chat.openai.com",
    pricing: Pricing.FREEMIUM,
    platforms: ["web", "ios", "android"],
    features: [
      "Conversation naturelle",
      "Génération de code",
      "Analyse de documents",
      "Plugins",
    ],
    pros: ["Très polyvalent", "Qualité des réponses", "Mises à jour régulières"],
    cons: ["Peut halluciner", "Limite de contexte", "Coût de GPT-4"],
    upvoteCount: 523,
    status: Status.PUBLISHED,
    categorySlug: "intelligence-artificielle",
  },
  {
    name: "Claude",
    slug: "claude",
    tagline: "IA sûre et utile par Anthropic",
    description:
      "Claude est un assistant IA développé par Anthropic, connu pour sa sécurité et ses réponses nuancées. Excellent pour les tâches de rédaction et d'analyse.",
    website: "https://claude.ai",
    pricing: Pricing.FREEMIUM,
    platforms: ["web", "ios", "android"],
    features: [
      "Contexte de 200k tokens",
      "Analyse de fichiers",
      "Vision",
      "API disponible",
    ],
    pros: [
      "Contexte très long",
      "Réponses nuancées",
      "Moins d'hallucinations",
    ],
    cons: ["Moins de plugins", "Parfois trop prudent"],
    upvoteCount: 412,
    status: Status.PUBLISHED,
    categorySlug: "intelligence-artificielle",
  },
  {
    name: "Perplexity",
    slug: "perplexity",
    tagline: "Moteur de recherche IA",
    description:
      "Perplexity combine la puissance des LLMs avec la recherche web en temps réel. Obtenez des réponses sourcées à vos questions.",
    website: "https://perplexity.ai",
    pricing: Pricing.FREEMIUM,
    platforms: ["web", "ios", "android"],
    features: [
      "Recherche en temps réel",
      "Sources citées",
      "Collections",
      "Focus modes",
    ],
    pros: ["Sources vérifiables", "Informations actuelles", "Interface simple"],
    cons: ["Moins polyvalent que ChatGPT", "Pro assez cher"],
    upvoteCount: 298,
    status: Status.PUBLISHED,
    categorySlug: "intelligence-artificielle",
  },

  // Communication
  {
    name: "Slack",
    slug: "slack",
    tagline: "Communication d'équipe moderne",
    description:
      "Slack est la plateforme de messagerie d'équipe la plus populaire. Organisez vos conversations par canaux et intégrez tous vos outils.",
    website: "https://slack.com",
    pricing: Pricing.FREEMIUM,
    platforms: ["web", "mac", "windows", "ios", "android", "linux"],
    features: [
      "Canaux organisés",
      "Huddles audio/vidéo",
      "2000+ intégrations",
      "Workflow builder",
    ],
    pros: ["Standard de l'industrie", "Intégrations riches", "Recherche puissante"],
    cons: ["Peut être distrayant", "Cher pour les grandes équipes", "Historique limité en gratuit"],
    upvoteCount: 234,
    status: Status.PUBLISHED,
    categorySlug: "communication",
  },
  {
    name: "Discord",
    slug: "discord",
    tagline: "Communautés et équipes",
    description:
      "Discord n'est plus seulement pour les gamers. De plus en plus d'équipes et de communautés l'utilisent pour sa qualité audio et ses serveurs organisés.",
    website: "https://discord.com",
    pricing: Pricing.FREEMIUM,
    platforms: ["web", "mac", "windows", "ios", "android", "linux"],
    features: [
      "Serveurs et canaux",
      "Audio haute qualité",
      "Screen sharing",
      "Bots et intégrations",
    ],
    pros: ["Gratuit et complet", "Excellente qualité audio", "Communauté active"],
    cons: ["Interface gaming", "Pas conçu pour le travail", "Gestion des permissions complexe"],
    upvoteCount: 178,
    status: Status.PUBLISHED,
    categorySlug: "communication",
  },

  // Notes & Documentation
  {
    name: "Obsidian",
    slug: "obsidian",
    tagline: "Second cerveau en Markdown",
    description:
      "Obsidian est une app de prise de notes qui stocke vos fichiers en local en Markdown. Ses liens bidirectionnels créent un graphe de connaissances personnel.",
    website: "https://obsidian.md",
    pricing: Pricing.FREEMIUM,
    platforms: ["mac", "windows", "ios", "android", "linux"],
    features: [
      "Markdown local",
      "Liens bidirectionnels",
      "Graph view",
      "Plugins communautaires",
    ],
    pros: [
      "Données en local",
      "Très personnalisable",
      "Gratuit pour usage personnel",
    ],
    cons: ["Sync payant", "Courbe d'apprentissage", "Pas de collaboration native"],
    upvoteCount: 367,
    status: Status.PUBLISHED,
    categorySlug: "notes-documentation",
  },
  {
    name: "Logseq",
    slug: "logseq",
    tagline: "Outliner open source",
    description:
      "Logseq est un outil de prise de notes open source basé sur les blocs. Parfait pour ceux qui préfèrent une structure outliner.",
    website: "https://logseq.com",
    pricing: Pricing.FREE,
    platforms: ["mac", "windows", "ios", "android", "linux"],
    features: [
      "Open source",
      "Structure outliner",
      "Graph view",
      "PDF annotation",
    ],
    pros: ["Entièrement gratuit", "Open source", "Respect de la vie privée"],
    cons: ["Moins de plugins qu'Obsidian", "Performance variable", "Moins mature"],
    upvoteCount: 145,
    status: Status.PUBLISHED,
    categorySlug: "notes-documentation",
  },

  // Design
  {
    name: "Figma",
    slug: "figma",
    tagline: "Design collaboratif dans le navigateur",
    description:
      "Figma est l'outil de design collaboratif le plus populaire. Créez des interfaces, des prototypes et des design systems directement dans votre navigateur.",
    website: "https://figma.com",
    pricing: Pricing.FREEMIUM,
    platforms: ["web", "mac", "windows"],
    features: [
      "Collaboration temps réel",
      "Prototypage",
      "Design systems",
      "Dev mode",
    ],
    pros: [
      "Collaboration excellente",
      "Plan gratuit généreux",
      "Communauté active",
    ],
    cons: ["Hors ligne limité", "Performance avec gros fichiers", "Appartient à Adobe"],
    upvoteCount: 423,
    status: Status.PUBLISHED,
    categorySlug: "design",
  },
  {
    name: "Canva",
    slug: "canva",
    tagline: "Design simple pour tous",
    description:
      "Canva démocratise le design avec ses templates et son éditeur intuitif. Créez des visuels professionnels sans compétences en design.",
    website: "https://canva.com",
    pricing: Pricing.FREEMIUM,
    platforms: ["web", "mac", "windows", "ios", "android"],
    features: [
      "Millions de templates",
      "IA générative",
      "Brand kit",
      "Collaboration",
    ],
    pros: ["Très facile à utiliser", "Templates de qualité", "Plan gratuit généreux"],
    cons: ["Limité pour le design avancé", "Résultats parfois génériques"],
    upvoteCount: 312,
    status: Status.PUBLISHED,
    categorySlug: "design",
  },

  // Développement
  {
    name: "GitHub",
    slug: "github",
    tagline: "Plateforme de développement collaborative",
    description:
      "GitHub est la plateforme de référence pour héberger du code, collaborer avec Git, et gérer des projets open source ou privés.",
    website: "https://github.com",
    pricing: Pricing.FREEMIUM,
    platforms: ["web", "mac", "windows", "ios", "android"],
    features: ["Git hosting", "Pull requests", "Actions CI/CD", "Copilot"],
    pros: ["Standard de l'industrie", "Gratuit pour l'open source", "Copilot intégré"],
    cons: ["Interface parfois complexe", "Appartient à Microsoft"],
    upvoteCount: 456,
    status: Status.PUBLISHED,
    categorySlug: "developpement",
  },
  {
    name: "Cursor",
    slug: "cursor",
    tagline: "L'IDE propulsé par l'IA",
    description:
      "Cursor est un fork de VS Code avec des fonctionnalités IA intégrées. Codez plus vite avec l'autocomplétion intelligente et le chat contextuel.",
    website: "https://cursor.sh",
    pricing: Pricing.FREEMIUM,
    platforms: ["mac", "windows", "linux"],
    features: [
      "Autocomplétion IA",
      "Chat avec codebase",
      "Multi-fichiers edit",
      "Compatible VS Code",
    ],
    pros: ["IA très performante", "Intégration native", "Extensions VS Code"],
    cons: ["Abonnement mensuel", "Consomme des ressources", "Dépendance à l'IA"],
    upvoteCount: 378,
    status: Status.PUBLISHED,
    categorySlug: "developpement",
  },
  {
    name: "Vercel",
    slug: "vercel",
    tagline: "Déployez vos apps frontend",
    description:
      "Vercel est la plateforme de déploiement préférée des développeurs frontend. Déployez vos apps Next.js, Svelte, et autres en quelques clics.",
    website: "https://vercel.com",
    pricing: Pricing.FREEMIUM,
    platforms: ["web"],
    features: [
      "Déploiement instantané",
      "Preview deployments",
      "Edge functions",
      "Analytics",
    ],
    pros: ["DX exceptionnelle", "Gratuit pour les projets perso", "Performance optimale"],
    cons: ["Coût qui monte vite", "Lock-in avec Next.js", "Limites du plan gratuit"],
    upvoteCount: 289,
    status: Status.PUBLISHED,
    categorySlug: "developpement",
  },

  // Marketing
  {
    name: "Mailchimp",
    slug: "mailchimp",
    tagline: "Email marketing simplifié",
    description:
      "Mailchimp est la plateforme d'email marketing la plus connue. Créez des campagnes, automatisez vos emails et analysez vos résultats.",
    website: "https://mailchimp.com",
    pricing: Pricing.FREEMIUM,
    platforms: ["web", "ios", "android"],
    features: [
      "Email builder",
      "Automatisations",
      "Landing pages",
      "Analytics",
    ],
    pros: ["Plan gratuit généreux", "Interface intuitive", "Nombreuses intégrations"],
    cons: ["Devient cher rapidement", "Fonctionnalités avancées limitées"],
    upvoteCount: 187,
    status: Status.PUBLISHED,
    categorySlug: "marketing",
  },
  {
    name: "Ahrefs",
    slug: "ahrefs",
    tagline: "SEO professionnel",
    description:
      "Ahrefs est l'outil SEO de référence pour analyser les backlinks, rechercher des mots-clés et auditer votre site.",
    website: "https://ahrefs.com",
    pricing: Pricing.PAID,
    platforms: ["web"],
    features: [
      "Analyse de backlinks",
      "Recherche de mots-clés",
      "Site audit",
      "Rank tracker",
    ],
    pros: ["Base de données énorme", "Données précises", "Interface claire"],
    cons: ["Prix élevé", "Pas de plan gratuit", "Courbe d'apprentissage"],
    upvoteCount: 156,
    status: Status.PUBLISHED,
    categorySlug: "marketing",
  },
];

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.upvote.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const createdCategories: Record<string, string> = {};
  for (const category of categories) {
    const created = await prisma.category.create({
      data: category,
    });
    createdCategories[category.slug] = created.id;
    console.log(`Created category: ${category.name}`);
  }

  // Create tools
  for (const tool of tools) {
    const { categorySlug, ...toolData } = tool;
    await prisma.tool.create({
      data: {
        ...toolData,
        categoryId: createdCategories[categorySlug],
      },
    });
    console.log(`Created tool: ${tool.name}`);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
