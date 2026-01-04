<script lang="ts">
  import { goto } from "$app/navigation";
  import * as Command from "$lib/components/ui/command";
  import { Badge } from "$lib/components/ui/badge";
  import { searchClient, TOOLS_INDEX, type AlgoliaToolRecord } from "$lib/algolia";
  import { Search, ArrowRight, Loader2 } from "@lucide/svelte";

  let { open = $bindable(false) }: { open?: boolean } = $props();

  let query = $state("");
  let results = $state<AlgoliaToolRecord[]>([]);
  let isLoading = $state(false);
  let debounceTimer: ReturnType<typeof setTimeout>;

  async function handleSearch(searchQuery: string) {
    if (!searchQuery.trim()) {
      results = [];
      return;
    }

    isLoading = true;
    try {
      const response = await searchClient.searchSingleIndex<AlgoliaToolRecord>({
        indexName: TOOLS_INDEX,
        searchParams: {
          query: searchQuery,
          hitsPerPage: 8,
        },
      });
      results = response.hits;
    } catch (error) {
      console.error("Search error:", error);
      results = [];
    } finally {
      isLoading = false;
    }
  }

  function debouncedSearch(value: string) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      handleSearch(value);
    }, 200);
  }

  $effect(() => {
    debouncedSearch(query);
  });

  function handleSelect(slug: string) {
    open = false;
    query = "";
    results = [];
    goto(`/tools/${slug}`);
  }

  function handleViewAll() {
    open = false;
    const searchQuery = query;
    query = "";
    results = [];
    goto(`/tools?q=${encodeURIComponent(searchQuery)}`);
  }

  function getPricingVariant(pricing: string): "default" | "secondary" | "outline" {
    switch (pricing) {
      case "FREE":
        return "secondary";
      case "FREEMIUM":
        return "outline";
      default:
        return "default";
    }
  }

  function getPricingLabel(pricing: string): string {
    switch (pricing) {
      case "FREE":
        return "Gratuit";
      case "FREEMIUM":
        return "Freemium";
      case "PAID":
        return "Payant";
      default:
        return pricing;
    }
  }

  // Keyboard shortcut to open search
  function handleKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      open = true;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<Command.Dialog bind:open title="Rechercher" description="Rechercher un outil">
  <Command.Input
    placeholder="Rechercher un outil..."
    bind:value={query}
  />
  <Command.List>
    {#if isLoading}
      <Command.Loading>
        <div class="flex items-center justify-center py-6 text-sm text-neutral-500">
          <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          Recherche...
        </div>
      </Command.Loading>
    {:else if query && results.length === 0}
      <Command.Empty>Aucun résultat trouvé.</Command.Empty>
    {:else if results.length > 0}
      <Command.Group heading="Outils">
        {#each results as tool (tool.objectID)}
          <Command.Item
            value={tool.slug}
            onSelect={() => handleSelect(tool.slug)}
            class="flex items-center gap-3 px-3 py-2"
          >
            {#if tool.logo}
              <img
                src={tool.logo}
                alt={tool.name}
                class="h-8 w-8 rounded-md object-cover"
              />
            {:else}
              <div class="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100">
                <Search class="h-4 w-4 text-neutral-400" />
              </div>
            {/if}
            <div class="flex flex-1 flex-col">
              <div class="flex items-center gap-2">
                <span class="font-medium">{tool.name}</span>
                <Badge variant={getPricingVariant(tool.pricing)} class="text-xs">
                  {getPricingLabel(tool.pricing)}
                </Badge>
              </div>
              {#if tool.tagline}
                <span class="text-sm text-neutral-500 line-clamp-1">{tool.tagline}</span>
              {/if}
            </div>
            <Badge
              variant="outline"
              style="border-color: {tool.categoryColor}; color: {tool.categoryColor}"
              class="text-xs"
            >
              {tool.categoryName}
            </Badge>
          </Command.Item>
        {/each}
      </Command.Group>
      {#if query}
        <Command.Separator />
        <Command.Group>
          <Command.Item
            value="view-all"
            onSelect={handleViewAll}
            class="flex items-center justify-center gap-2 text-sm text-neutral-600"
          >
            Voir tous les résultats pour "{query}"
            <ArrowRight class="h-4 w-4" />
          </Command.Item>
        </Command.Group>
      {/if}
    {:else}
      <Command.Empty class="py-6 text-center text-sm text-neutral-500">
        Tapez pour rechercher des outils...
      </Command.Empty>
    {/if}
  </Command.List>
</Command.Dialog>
