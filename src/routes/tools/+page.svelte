<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Badge } from "$lib/components/ui/badge";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { ToolCard } from "$lib/components/tools";
  import { Search, SlidersHorizontal, X, ChevronDown } from "@lucide/svelte";
  import type { Pricing } from "@prisma/client";

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

  // Search query with sync to data changes - use $derived.by for initial sync
  const initialQuery = $derived(data.filters.query);
  let searchQueryOverride = $state<string | null>(null);
  const searchQuery = $derived(searchQueryOverride !== null ? searchQueryOverride : initialQuery);

  // Reset override when data changes
  $effect(() => {
    const _ = data.filters.query;
    searchQueryOverride = null;
  });

  function setSearchQuery(value: string) {
    searchQueryOverride = value;
  }

  const sortOptions = [
    { value: "popular", label: "Plus populaires" },
    { value: "recent", label: "Plus récents" },
    { value: "name", label: "Alphabétique" },
  ];

  const pricingOptions: { value: Pricing | ""; label: string }[] = [
    { value: "", label: "Tous les prix" },
    { value: "FREE", label: "Gratuit" },
    { value: "FREEMIUM", label: "Freemium" },
    { value: "PAID", label: "Payant" },
    { value: "ENTERPRISE", label: "Enterprise" },
  ];

  function handleSearch(e: Event) {
    e.preventDefault();
    updateFilters({ q: searchQuery });
  }

  function updateFilters(updates: Record<string, string>) {
    const params = new URLSearchParams($page.url.searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    goto(`/tools?${params.toString()}`);
  }

  function clearFilters() {
    setSearchQuery("");
    goto("/tools");
  }

  const currentSort = $derived(
    sortOptions.find((o) => o.value === data.filters.sort) || sortOptions[0]
  );

  const hasActiveFilters = $derived(
    data.filters.query || data.filters.categorySlug || data.filters.pricing
  );
</script>

<svelte:head>
  <title>Tous les outils SaaS - Productivité</title>
  <meta name="description" content="Explorez notre catalogue de {data.tools.length}+ outils SaaS pour booster votre productivité. Filtrez par catégorie, prix et popularité." />
  <meta property="og:title" content="Tous les outils SaaS - Productivité" />
  <meta property="og:description" content="Explorez notre catalogue d'outils SaaS pour booster votre productivité. Filtrez par catégorie, prix et popularité." />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-neutral-900">Outils</h1>
    <p class="mt-2 text-neutral-600">
      {data.tools.length} outils disponibles
    </p>
  </div>

  <!-- Filters -->
  <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <!-- Search -->
    <form onsubmit={handleSearch} class="relative flex-1 max-w-md">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <Input
        type="search"
        placeholder="Rechercher un outil..."
        class="pl-9"
        value={searchQuery}
        oninput={(e) => setSearchQuery(e.currentTarget.value)}
      />
    </form>

    <!-- Filter buttons -->
    <div class="flex items-center gap-3">
      <!-- Category filter -->
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2"
        >
          Catégorie
          {#if data.filters.categorySlug}
            <Badge variant="secondary">1</Badge>
          {/if}
          <ChevronDown class="h-4 w-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-56">
          <DropdownMenu.Item onclick={() => updateFilters({ category: "" })}>
            Toutes les catégories
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          {#each data.categories as category}
            <DropdownMenu.Item
              onclick={() => updateFilters({ category: category.slug })}
            >
              <span
                class="mr-2 h-2 w-2 rounded-full"
                style="background-color: {category.color}"
              ></span>
              {category.name}
            </DropdownMenu.Item>
          {/each}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <!-- Pricing filter -->
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2"
        >
          Prix
          {#if data.filters.pricing}
            <Badge variant="secondary">1</Badge>
          {/if}
          <ChevronDown class="h-4 w-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {#each pricingOptions as option}
            <DropdownMenu.Item
              onclick={() => updateFilters({ pricing: option.value })}
            >
              {option.label}
            </DropdownMenu.Item>
          {/each}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <!-- Sort -->
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2"
        >
          <SlidersHorizontal class="h-4 w-4" />
          {currentSort.label}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {#each sortOptions as option}
            <DropdownMenu.Item
              onclick={() => updateFilters({ sort: option.value })}
            >
              {option.label}
            </DropdownMenu.Item>
          {/each}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <!-- Clear filters -->
      {#if hasActiveFilters}
        <Button variant="ghost" size="sm" onclick={clearFilters}>
          <X class="mr-2 h-4 w-4" />
          Effacer
        </Button>
      {/if}
    </div>
  </div>

  <!-- Active filters display -->
  {#if hasActiveFilters}
    <div class="mb-6 flex flex-wrap items-center gap-2">
      {#if data.filters.query}
        <Badge variant="secondary" class="gap-1">
          Recherche: {data.filters.query}
          <button onclick={() => { setSearchQuery(""); updateFilters({ q: "" }); }}>
            <X class="h-3 w-3" />
          </button>
        </Badge>
      {/if}
      {#if data.filters.categorySlug}
        {@const category = data.categories.find((c) => c.slug === data.filters.categorySlug)}
        {#if category}
          <Badge variant="secondary" class="gap-1">
            {category.name}
            <button onclick={() => updateFilters({ category: "" })}>
              <X class="h-3 w-3" />
            </button>
          </Badge>
        {/if}
      {/if}
      {#if data.filters.pricing}
        {@const pricing = pricingOptions.find((p) => p.value === data.filters.pricing)}
        {#if pricing}
          <Badge variant="secondary" class="gap-1">
            {pricing.label}
            <button onclick={() => updateFilters({ pricing: "" })}>
              <X class="h-3 w-3" />
            </button>
          </Badge>
        {/if}
      {/if}
    </div>
  {/if}

  <!-- Tools list -->
  {#if data.tools.length > 0}
    <div class="space-y-3">
      {#each data.tools as tool, i}
        <ToolCard
          {tool}
          rank={i + 1}
          {isLoggedIn}
          upvoted={userUpvotes.has(tool.id)}
          onUpvoteChange={handleUpvoteChange}
        />
      {/each}
    </div>
  {:else}
    <div class="flex flex-col items-center justify-center py-16 text-center">
      <div class="mb-4 text-6xl">🔍</div>
      <h2 class="text-xl font-semibold text-neutral-900">Aucun outil trouvé</h2>
      <p class="mt-2 text-neutral-600">
        Essayez de modifier vos filtres ou votre recherche.
      </p>
      <Button variant="outline" class="mt-4" onclick={clearFilters}>
        Effacer les filtres
      </Button>
    </div>
  {/if}
</div>
