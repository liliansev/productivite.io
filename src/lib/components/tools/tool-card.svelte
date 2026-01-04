<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { ChevronUp, Loader2 } from "@lucide/svelte";
  import { toast } from "svelte-sonner";
  import type { Pricing } from "@prisma/client";

  type Tool = {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    tagline: string | null;
    upvoteCount: number;
    pricing: Pricing;
    category: {
      name: string;
      slug: string;
      color: string;
    };
  };

  let {
    tool,
    rank,
    upvoted = false,
    isLoggedIn = false,
    onUpvoteChange,
  }: {
    tool: Tool;
    rank?: number;
    upvoted?: boolean;
    isLoggedIn?: boolean;
    onUpvoteChange?: (toolId: string, upvoted: boolean, newCount: number) => void;
  } = $props();

  let isLoading = $state(false);

  // Use $derived for reactive sync with props, but allow local modifications for optimistic updates
  let localUpvoteOverride = $state<boolean | null>(null);
  let localCountOverride = $state<number | null>(null);

  // Computed values that respect both props and local overrides
  const localUpvoted = $derived(localUpvoteOverride !== null ? localUpvoteOverride : upvoted);
  const localCount = $derived(localCountOverride !== null ? localCountOverride : tool.upvoteCount);

  // Reset overrides when props change
  $effect(() => {
    // Track the prop
    const _ = upvoted;
    localUpvoteOverride = null;
  });

  $effect(() => {
    // Track the prop
    const _ = tool.upvoteCount;
    localCountOverride = null;
  });

  const pricingLabels: Record<Pricing, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    FREE: { label: "Gratuit", variant: "secondary" },
    FREEMIUM: { label: "Freemium", variant: "outline" },
    PAID: { label: "Payant", variant: "default" },
    ENTERPRISE: { label: "Enterprise", variant: "destructive" },
  };

  async function handleUpvote(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("Connectez-vous pour voter", {
        action: {
          label: "Se connecter",
          onClick: () => window.location.href = "/login",
        },
      });
      return;
    }

    if (isLoading) return;

    isLoading = true;

    // Optimistic update
    const previousUpvoted = localUpvoted;
    const previousCount = localCount;
    localUpvoteOverride = !localUpvoted;
    localCountOverride = localUpvoteOverride ? localCount + 1 : localCount - 1;

    try {
      const response = await fetch("/api/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toolId: tool.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors du vote");
      }

      const data = await response.json();
      localUpvoteOverride = data.upvoted;
      localCountOverride = data.upvoteCount;

      onUpvoteChange?.(tool.id, data.upvoted, data.upvoteCount);
    } catch (err) {
      // Revert optimistic update
      localUpvoteOverride = previousUpvoted;
      localCountOverride = previousCount;
      toast.error(err instanceof Error ? err.message : "Erreur lors du vote");
    } finally {
      isLoading = false;
    }
  }

  function getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
</script>

<a
  href="/tools/{tool.slug}"
  class="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-300 hover:shadow-md"
>
  <!-- Rank (optional) -->
  {#if rank !== undefined}
    <div class="hidden sm:flex h-8 w-8 items-center justify-center text-lg font-semibold text-neutral-400">
      {rank}
    </div>
  {/if}

  <!-- Logo -->
  <div class="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
    {#if tool.logo}
      <img src={tool.logo} alt={tool.name} class="h-10 w-10 object-contain" />
    {:else}
      <span class="text-lg font-bold text-neutral-400">{getInitials(tool.name)}</span>
    {/if}
  </div>

  <!-- Content -->
  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-2 flex-wrap">
      <h3 class="font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors truncate">
        {tool.name}
      </h3>
      <Badge variant={pricingLabels[tool.pricing].variant} class="text-xs">
        {pricingLabels[tool.pricing].label}
      </Badge>
    </div>
    <p class="mt-1 text-sm text-neutral-600 line-clamp-1">
      {tool.tagline || "Aucune description"}
    </p>
    <div class="mt-2 flex items-center gap-2">
      <span
        class="text-xs font-medium"
        style="color: {tool.category.color}"
      >
        {tool.category.name}
      </span>
    </div>
  </div>

  <!-- Upvote Button -->
  <div class="shrink-0">
    <Button
      variant="outline"
      size="sm"
      class="flex h-auto flex-col gap-0 px-3 py-2 transition-all {localUpvoted
        ? 'border-orange-500 bg-orange-50 text-orange-600'
        : 'hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600'}"
      onclick={handleUpvote}
      disabled={isLoading}
    >
      {#if isLoading}
        <Loader2 class="h-4 w-4 animate-spin" />
      {:else}
        <ChevronUp class="h-4 w-4 {localUpvoted ? 'fill-orange-600' : ''}" />
      {/if}
      <span class="text-sm font-semibold">{localCount}</span>
    </Button>
  </div>
</a>
