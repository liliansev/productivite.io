<script lang="ts">
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import { ToolCard } from "$lib/components/tools";
  import { CategoryCard } from "$lib/components/categories";
  import { ArrowRight, Sparkles, TrendingUp, Clock } from "@lucide/svelte";

  let { data } = $props();

  // Check if user is logged in from layout data
  const isLoggedIn = $derived(!!$page.data.user);

  // Track upvotes locally for reactivity - use $derived.by to sync with props
  const initialUpvotes = $derived(new Set(data.userUpvotes));
  let localUpvoteOverrides = $state<Map<string, boolean>>(new Map());

  // Combined view of upvotes
  const userUpvotes = $derived.by(() => {
    const combined = new Set(initialUpvotes);
    for (const [toolId, upvoted] of localUpvoteOverrides) {
      if (upvoted) {
        combined.add(toolId);
      } else {
        combined.delete(toolId);
      }
    }
    return combined;
  });

  // Reset local overrides when data changes
  $effect(() => {
    const _ = data.userUpvotes;
    localUpvoteOverrides = new Map();
  });

  function handleUpvoteChange(toolId: string, upvoted: boolean) {
    localUpvoteOverrides.set(toolId, upvoted);
    localUpvoteOverrides = new Map(localUpvoteOverrides); // Trigger reactivity
  }
</script>

<div class="flex flex-col">
  <!-- Hero Section -->
  <section class="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-rose-50 py-16 md:py-24">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-orange-200 to-rose-200 opacity-30 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-30 blur-3xl"></div>
    </div>

    <div class="container relative mx-auto px-4">
      <div class="mx-auto max-w-3xl text-center">
        <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
          <Sparkles class="h-4 w-4" />
          <span>Découvrez les meilleurs outils</span>
        </div>

        <h1 class="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
          Boostez votre
          <span class="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
            productivité
          </span>
        </h1>

        <p class="mt-6 text-lg text-neutral-600 sm:text-xl">
          Trouvez les meilleurs outils SaaS pour optimiser votre workflow.
          Reviews, comparatifs et recommandations par la communauté.
        </p>

        <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" class="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600" href="/tools">
            Explorer les outils
            <ArrowRight class="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" href="/categories">
            Voir les catégories
          </Button>
        </div>

        <!-- Stats -->
        <div class="mt-16 grid grid-cols-3 gap-8">
          <div>
            <div class="text-3xl font-bold text-neutral-900">{data.topTools.length}+</div>
            <div class="text-sm text-neutral-500">Outils référencés</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-neutral-900">{data.categories.length}</div>
            <div class="text-sm text-neutral-500">Catégories</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-neutral-900">100%</div>
            <div class="text-sm text-neutral-500">Gratuit</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Top Tools Section -->
  <section class="py-16">
    <div class="container mx-auto px-4">
      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
            <TrendingUp class="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-neutral-900">Top outils</h2>
            <p class="text-sm text-neutral-500">Les plus populaires de la communauté</p>
          </div>
        </div>
        <Button variant="ghost" href="/tools">
          Voir tout
          <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div class="space-y-3">
        {#each data.topTools as tool, i}
          <ToolCard
            {tool}
            rank={i + 1}
            {isLoggedIn}
            upvoted={userUpvotes.has(tool.id)}
            onUpvoteChange={handleUpvoteChange}
          />
        {/each}
      </div>
    </div>
  </section>

  <!-- Categories Section -->
  <section class="bg-neutral-50 py-16">
    <div class="container mx-auto px-4">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-neutral-900">Catégories</h2>
          <p class="mt-1 text-neutral-500">Explorez par domaine</p>
        </div>
        <Button variant="ghost" href="/categories">
          Voir tout
          <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each data.categories as category}
          <CategoryCard {category} />
        {/each}
      </div>
    </div>
  </section>

  <!-- Recent Tools Section -->
  <section class="py-16">
    <div class="container mx-auto px-4">
      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <Clock class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-neutral-900">Récemment ajoutés</h2>
            <p class="text-sm text-neutral-500">Les dernières découvertes</p>
          </div>
        </div>
        <Button variant="ghost" href="/tools?sort=recent">
          Voir tout
          <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div class="space-y-3">
        {#each data.recentTools as tool}
          <ToolCard
            {tool}
            {isLoggedIn}
            upvoted={userUpvotes.has(tool.id)}
            onUpvoteChange={handleUpvoteChange}
          />
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="bg-gradient-to-r from-orange-500 to-rose-500 py-16">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold text-white">Vous avez un outil à recommander ?</h2>
      <p class="mt-4 text-lg text-white/90">
        Partagez vos découvertes avec la communauté et aidez d'autres à être plus productifs.
      </p>
      <Button size="lg" variant="secondary" class="mt-8" href="/submit">
        Soumettre un outil
        <ArrowRight class="ml-2 h-4 w-4" />
      </Button>
    </div>
  </section>
</div>
