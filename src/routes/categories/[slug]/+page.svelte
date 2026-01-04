<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Icons from "@lucide/svelte";
  import { ToolCard } from "$lib/components/tools";
  import { SlidersHorizontal } from "@lucide/svelte";

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

  const sortOptions = [
    { value: "popular", label: "Plus populaires" },
    { value: "recent", label: "Plus récents" },
    { value: "name", label: "Alphabétique" },
  ];

  function updateSort(sort: string) {
    const params = new URLSearchParams($page.url.searchParams);
    params.set("sort", sort);
    goto(`/categories/${data.category.slug}?${params.toString()}`);
  }

  const currentSort = $derived(
    sortOptions.find((o) => o.value === data.sort) || sortOptions[0]
  );

  // Dynamically get the icon component
  const IconComponent = $derived(
    (Icons as unknown as Record<string, typeof Icons.Folder>)[data.category.icon] || Icons.Folder
  );
</script>

<svelte:head>
  <title>Outils {data.category.name} - Productivité</title>
  <meta name="description" content={data.category.description || `Découvrez les ${data.tools.length} meilleurs outils de ${data.category.name} pour booster votre productivité.`} />
  <meta property="og:title" content="Outils {data.category.name} - Productivité" />
  <meta property="og:description" content={data.category.description || `Les meilleurs outils de ${data.category.name}`} />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <!-- Breadcrumb -->
  <nav class="mb-6 text-sm text-neutral-500">
    <a href="/" class="hover:text-neutral-900">Accueil</a>
    <span class="mx-2">/</span>
    <a href="/categories" class="hover:text-neutral-900">Catégories</a>
    <span class="mx-2">/</span>
    <span class="text-neutral-900">{data.category.name}</span>
  </nav>

  <!-- Header -->
  <div class="mb-8 flex items-start gap-4">
    <div
      class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
      style="background-color: {data.category.color}20"
    >
      <IconComponent class="h-8 w-8" style="color: {data.category.color}" />
    </div>
    <div>
      <h1 class="text-3xl font-bold text-neutral-900">{data.category.name}</h1>
      {#if data.category.description}
        <p class="mt-2 text-neutral-600">{data.category.description}</p>
      {/if}
      <p class="mt-2 text-sm text-neutral-500">{data.tools.length} outils</p>
    </div>
  </div>

  <!-- Sort -->
  <div class="mb-6 flex justify-end">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2"
      >
        <SlidersHorizontal class="h-4 w-4" />
        {currentSort.label}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {#each sortOptions as option}
          <DropdownMenu.Item onclick={() => updateSort(option.value)}>
            {option.label}
          </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>

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
      <div class="mb-4 text-6xl">📭</div>
      <h2 class="text-xl font-semibold text-neutral-900">Aucun outil dans cette catégorie</h2>
      <p class="mt-2 text-neutral-600">
        Soyez le premier à soumettre un outil dans cette catégorie !
      </p>
      <Button class="mt-4" href="/submit">
        Soumettre un outil
      </Button>
    </div>
  {/if}
</div>
