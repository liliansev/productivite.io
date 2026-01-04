<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import * as Avatar from "$lib/components/ui/avatar";
  import { Badge } from "$lib/components/ui/badge";
  import { Separator } from "$lib/components/ui/separator";
  import { authClient } from "$lib/auth-client";
  import { toast } from "svelte-sonner";
  import {
    User,
    Mail,
    Calendar,
    Heart,
    Star,
    LogOut,
    Loader2,
    ExternalLink,
  } from "@lucide/svelte";

  let { data } = $props();
  const user = $derived($page.data.user);
  let isLoggingOut = $state(false);

  function getInitials(name: string | null | undefined): string {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  }

  async function handleLogout() {
    isLoggingOut = true;
    try {
      await authClient.signOut();
      toast.success("Vous avez été déconnecté");
      goto("/");
    } catch {
      toast.error("Erreur lors de la déconnexion");
    } finally {
      isLoggingOut = false;
    }
  }
</script>

<svelte:head>
  <title>Mon profil - Productivité</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mx-auto max-w-4xl">
    <!-- Profile Header -->
    <Card.Root class="mb-8">
      <Card.Content class="pt-6">
        <div class="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Avatar.Root class="h-24 w-24">
            {#if user?.image}
              <Avatar.Image src={user.image} alt={user.name || "Avatar"} />
            {/if}
            <Avatar.Fallback
              class="bg-gradient-to-br from-orange-500 to-rose-500 text-white text-2xl"
            >
              {getInitials(user?.name)}
            </Avatar.Fallback>
          </Avatar.Root>

          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-2xl font-bold text-neutral-900">
              {user?.name || "Utilisateur"}
            </h1>

            <div class="mt-2 flex flex-col gap-2 text-sm text-neutral-600 sm:flex-row sm:gap-4">
              <span class="inline-flex items-center gap-1">
                <Mail class="h-4 w-4" />
                {user?.email}
              </span>
              {#if user?.createdAt}
                <span class="inline-flex items-center gap-1">
                  <Calendar class="h-4 w-4" />
                  Membre depuis {formatDate(user.createdAt)}
                </span>
              {/if}
            </div>

            <div class="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge variant="secondary" class="gap-1">
                <Heart class="h-3 w-3" />
                {data.upvotedTools.length} upvotes
              </Badge>
              <Badge variant="secondary" class="gap-1">
                <Star class="h-3 w-3" />
                {data.reviews.length} avis
              </Badge>
            </div>
          </div>

          <Button
            variant="outline"
            class="text-red-600 hover:bg-red-50 hover:text-red-700"
            disabled={isLoggingOut}
            onclick={handleLogout}
          >
            {#if isLoggingOut}
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              Déconnexion...
            {:else}
              <LogOut class="mr-2 h-4 w-4" />
              Se déconnecter
            {/if}
          </Button>
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Upvoted Tools -->
    <section class="mb-8">
      <h2 class="mb-4 text-xl font-semibold text-neutral-900 flex items-center gap-2">
        <Heart class="h-5 w-5 text-orange-500" />
        Outils upvotés
      </h2>

      {#if data.upvotedTools.length > 0}
        <div class="grid gap-4 sm:grid-cols-2">
          {#each data.upvotedTools as tool}
            <Card.Root class="group transition-shadow hover:shadow-md">
              <Card.Content class="p-4">
                <a href={`/tools/${tool.slug}`} class="flex items-start gap-3">
                  {#if tool.logo}
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      class="h-12 w-12 rounded-lg object-cover"
                    />
                  {:else}
                    <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
                      <span class="text-lg font-bold">{tool.name[0]}</span>
                    </div>
                  {/if}

                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-neutral-900 group-hover:text-orange-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p class="text-sm text-neutral-500 truncate">
                      {tool.tagline || tool.category.name}
                    </p>
                    <div class="mt-1 flex items-center gap-2">
                      <Badge variant="outline" class="text-xs">
                        {tool.category.name}
                      </Badge>
                      <span class="text-xs text-neutral-400">
                        {tool.upvoteCount} votes
                      </span>
                    </div>
                  </div>

                  <ExternalLink class="h-4 w-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </Card.Content>
            </Card.Root>
          {/each}
        </div>
      {:else}
        <Card.Root>
          <Card.Content class="py-12 text-center">
            <Heart class="mx-auto h-12 w-12 text-neutral-300" />
            <p class="mt-4 text-neutral-500">
              Vous n'avez pas encore upvoté d'outils.
            </p>
            <Button variant="outline" href="/tools" class="mt-4">
              Découvrir les outils
            </Button>
          </Card.Content>
        </Card.Root>
      {/if}
    </section>

    <!-- Reviews -->
    {#if data.reviews.length > 0}
      <Separator class="my-8" />

      <section>
        <h2 class="mb-4 text-xl font-semibold text-neutral-900 flex items-center gap-2">
          <Star class="h-5 w-5 text-yellow-500" />
          Mes avis
        </h2>

        <div class="space-y-4">
          {#each data.reviews as review}
            <Card.Root>
              <Card.Content class="p-4">
                <div class="flex items-start gap-3">
                  {#if review.tool.logo}
                    <img
                      src={review.tool.logo}
                      alt={review.tool.name}
                      class="h-10 w-10 rounded-lg object-cover"
                    />
                  {:else}
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                      <span class="font-bold text-neutral-400">
                        {review.tool.name[0]}
                      </span>
                    </div>
                  {/if}

                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <a
                        href={`/tools/${review.tool.slug}`}
                        class="font-medium text-neutral-900 hover:text-orange-600"
                      >
                        {review.tool.name}
                      </a>
                      <div class="flex items-center gap-0.5">
                        {#each Array(5) as _, i}
                          <Star
                            class="h-4 w-4 {i < review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-neutral-200'}"
                          />
                        {/each}
                      </div>
                    </div>
                    {#if review.title}
                      <p class="mt-1 font-medium text-neutral-700">{review.title}</p>
                    {/if}
                    {#if review.content}
                      <p class="mt-1 text-sm text-neutral-600">{review.content}</p>
                    {/if}
                    <p class="mt-2 text-xs text-neutral-400">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
              </Card.Content>
            </Card.Root>
          {/each}
        </div>
      </section>
    {/if}
  </div>
</div>
