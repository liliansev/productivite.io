<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import * as Card from "$lib/components/ui/card";

  let { data } = $props();

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }
</script>

<svelte:head>
  <title>Gestion des catégories - Admin</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-2xl font-bold text-neutral-900">Gestion des catégories</h2>
    <Badge variant="outline">{data.categories.length} catégories</Badge>
  </div>

  <!-- Categories Grid -->
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each data.categories as category}
      <Card.Root>
        <Card.Content class="p-4">
          <div class="flex items-start gap-3">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
              style="background-color: {category.color}20"
            >
              {category.icon}
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-neutral-900">{category.name}</h3>
              <p class="text-sm text-neutral-500">{category.slug}</p>
              <div class="mt-2 flex items-center gap-2">
                <Badge variant="secondary">{category._count.tools} outils</Badge>
                <span
                  class="inline-block h-3 w-3 rounded-full"
                  style="background-color: {category.color}"
                ></span>
              </div>
            </div>
          </div>
          {#if category.description}
            <p class="mt-3 text-sm text-neutral-600">{category.description}</p>
          {/if}
          <p class="mt-2 text-xs text-neutral-400">
            Créée le {formatDate(category.createdAt)}
          </p>
        </Card.Content>
      </Card.Root>
    {/each}
  </div>

  {#if data.categories.length === 0}
    <Card.Root>
      <Card.Content class="py-12 text-center">
        <p class="text-neutral-500">Aucune catégorie trouvée</p>
      </Card.Content>
    </Card.Root>
  {/if}
</div>
