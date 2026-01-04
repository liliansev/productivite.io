<script lang="ts">
  import * as Icons from "@lucide/svelte";

  type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string;
    color: string;
    _count?: {
      tools: number;
    };
  };

  let { category }: { category: Category } = $props();

  // Dynamically get the icon component - use $derived for reactivity
  const IconComponent = $derived((Icons as unknown as Record<string, typeof Icons.Zap>)[category.icon] || Icons.Folder);
</script>

<a
  href="/categories/{category.slug}"
  class="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-300 hover:shadow-md"
>
  <!-- Icon -->
  <div
    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
    style="background-color: {category.color}20"
  >
    <IconComponent class="h-6 w-6" style="color: {category.color}" />
  </div>

  <!-- Content -->
  <div class="flex-1 min-w-0">
    <h3 class="font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors">
      {category.name}
    </h3>
    {#if category.description}
      <p class="mt-0.5 text-sm text-neutral-500 line-clamp-1">
        {category.description}
      </p>
    {/if}
  </div>

  <!-- Tool Count -->
  {#if category._count?.tools !== undefined}
    <div class="shrink-0 text-sm font-medium text-neutral-400">
      {category._count.tools} outils
    </div>
  {/if}
</a>
