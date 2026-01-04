<script lang="ts">
  import { CategoryCard } from "$lib/components/categories";

  let { data } = $props();
</script>

<svelte:head>
  <title>Catégories d'outils SaaS - Productivité</title>
  <meta name="description" content="Explorez {data.categories.length} catégories d'outils SaaS : gestion de projet, automatisation, IA, communication et plus." />
  <meta property="og:title" content="Catégories d'outils SaaS - Productivité" />
  <meta property="og:description" content="Explorez les outils SaaS par catégorie : gestion de projet, automatisation, IA, communication et plus." />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-neutral-900">Catégories</h1>
    <p class="mt-2 text-neutral-600">
      Explorez les outils par domaine
    </p>
  </div>

  <!-- Categories Grid -->
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each data.categories as category}
      <CategoryCard {category} />
    {/each}
  </div>
</div>
