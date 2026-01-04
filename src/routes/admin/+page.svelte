<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import {
    Wrench,
    Users,
    FolderOpen,
    Star,
    Heart,
    FileText,
    Eye,
  } from "@lucide/svelte";

  let { data } = $props();

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  const statCards = [
    {
      label: "Outils total",
      value: data.stats.toolsCount,
      icon: Wrench,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Publiés",
      value: data.stats.publishedToolsCount,
      icon: Eye,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "En attente",
      value: data.stats.draftToolsCount,
      icon: FileText,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      label: "Utilisateurs",
      value: data.stats.usersCount,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Catégories",
      value: data.stats.categoriesCount,
      icon: FolderOpen,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "Avis",
      value: data.stats.reviewsCount,
      icon: Star,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      label: "Upvotes",
      value: data.stats.upvotesCount,
      icon: Heart,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];
</script>

<svelte:head>
  <title>Admin Dashboard - Productivité</title>
</svelte:head>

<div class="space-y-8">
  <h2 class="text-2xl font-bold text-neutral-900">Vue d'ensemble</h2>

  <!-- Stats Grid -->
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {#each statCards as stat}
      <Card.Root>
        <Card.Content class="p-4">
          <div class="flex items-center gap-4">
            <div class="rounded-lg p-3 {stat.bg}">
              <stat.icon class="h-6 w-6 {stat.color}" />
            </div>
            <div>
              <p class="text-2xl font-bold text-neutral-900">{stat.value}</p>
              <p class="text-sm text-neutral-500">{stat.label}</p>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    {/each}
  </div>

  <div class="grid gap-8 lg:grid-cols-2">
    <!-- Recent Tools -->
    <Card.Root>
      <Card.Header>
        <Card.Title>Outils récents</Card.Title>
      </Card.Header>
      <Card.Content>
        {#if data.recentTools.length > 0}
          <div class="space-y-4">
            {#each data.recentTools as tool}
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  {#if tool.logo}
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      class="h-10 w-10 rounded-lg object-cover"
                    />
                  {:else}
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                      <span class="font-bold text-neutral-400">{tool.name[0]}</span>
                    </div>
                  {/if}
                  <div>
                    <a
                      href="/admin/tools/{tool.id}"
                      class="font-medium text-neutral-900 hover:text-orange-600"
                    >
                      {tool.name}
                    </a>
                    <p class="text-xs text-neutral-500">{tool.category.name}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <Badge variant={tool.status === "PUBLISHED" ? "default" : "secondary"}>
                    {tool.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                  </Badge>
                  <span class="text-xs text-neutral-400">{formatDate(tool.createdAt)}</span>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-neutral-500">Aucun outil récent</p>
        {/if}
      </Card.Content>
    </Card.Root>

    <!-- Recent Reviews -->
    <Card.Root>
      <Card.Header>
        <Card.Title>Avis récents</Card.Title>
      </Card.Header>
      <Card.Content>
        {#if data.recentReviews.length > 0}
          <div class="space-y-4">
            {#each data.recentReviews as review}
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-neutral-900">
                      {review.user.name || "Anonyme"}
                    </span>
                    <span class="text-neutral-400">→</span>
                    <a
                      href="/tools/{review.tool.slug}"
                      class="text-orange-600 hover:underline"
                    >
                      {review.tool.name}
                    </a>
                  </div>
                  <div class="mt-1 flex items-center gap-1">
                    {#each Array(5) as _, i}
                      <Star
                        class="h-3 w-3 {i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-neutral-200'}"
                      />
                    {/each}
                  </div>
                  {#if review.content}
                    <p class="mt-1 text-sm text-neutral-600 line-clamp-1">
                      {review.content}
                    </p>
                  {/if}
                </div>
                <span class="text-xs text-neutral-400">{formatDate(review.createdAt)}</span>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-neutral-500">Aucun avis récent</p>
        {/if}
      </Card.Content>
    </Card.Root>
  </div>
</div>
