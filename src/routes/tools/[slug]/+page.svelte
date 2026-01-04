<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Separator } from "$lib/components/ui/separator";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Avatar from "$lib/components/ui/avatar";
  import { ToolCard } from "$lib/components/tools";
  import {
    ChevronUp,
    ExternalLink,
    Star,
    Check,
    X,
    Monitor,
    Smartphone,
    Apple,
    Globe,
    Loader2,
    Trash2,
    Edit3,
    ThumbsUp,
  } from "@lucide/svelte";
  import { toast } from "svelte-sonner";
  import type { Pricing } from "@prisma/client";

  let { data } = $props();

  // Check if user is logged in
  const isLoggedIn = $derived(!!$page.data.user);

  // Local state for main tool upvote with override pattern
  let isUpvotedOverride = $state<boolean | null>(null);
  let upvoteCountOverride = $state<number | null>(null);
  let isLoading = $state(false);

  // Computed values that respect both props and local overrides
  const isUpvoted = $derived(isUpvotedOverride !== null ? isUpvotedOverride : data.isUpvoted);
  const upvoteCount = $derived(upvoteCountOverride !== null ? upvoteCountOverride : data.tool.upvoteCount);

  // Reset overrides when data changes
  $effect(() => {
    const _ = data.isUpvoted;
    isUpvotedOverride = null;
  });

  $effect(() => {
    const _ = data.tool.upvoteCount;
    upvoteCountOverride = null;
  });

  // Track upvotes for related tools with override pattern
  const initialRelatedUpvotes = $derived(new Set(data.relatedUpvotes));
  let relatedUpvoteOverrides = $state<Map<string, boolean>>(new Map());

  const relatedUpvotes = $derived.by(() => {
    const combined = new Set(initialRelatedUpvotes);
    for (const [toolId, upvoted] of relatedUpvoteOverrides) {
      if (upvoted) {
        combined.add(toolId);
      } else {
        combined.delete(toolId);
      }
    }
    return combined;
  });

  $effect(() => {
    const _ = data.relatedUpvotes;
    relatedUpvoteOverrides = new Map();
  });

  async function handleUpvote() {
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
    const previousUpvoted = isUpvoted;
    const previousCount = upvoteCount;
    isUpvotedOverride = !isUpvoted;
    upvoteCountOverride = isUpvotedOverride ? upvoteCount + 1 : upvoteCount - 1;

    try {
      const response = await fetch("/api/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: data.tool.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors du vote");
      }

      const result = await response.json();
      isUpvotedOverride = result.upvoted;
      upvoteCountOverride = result.upvoteCount;
    } catch (err) {
      // Revert optimistic update
      isUpvotedOverride = previousUpvoted;
      upvoteCountOverride = previousCount;
      toast.error(err instanceof Error ? err.message : "Erreur lors du vote");
    } finally {
      isLoading = false;
    }
  }

  function handleRelatedUpvoteChange(toolId: string, upvoted: boolean) {
    relatedUpvoteOverrides.set(toolId, upvoted);
    relatedUpvoteOverrides = new Map(relatedUpvoteOverrides);
  }

  const pricingLabels: Record<Pricing, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    FREE: { label: "Gratuit", variant: "secondary" },
    FREEMIUM: { label: "Freemium", variant: "outline" },
    PAID: { label: "Payant", variant: "default" },
    ENTERPRISE: { label: "Enterprise", variant: "destructive" },
  };

  const platformIcons: Record<string, typeof Globe> = {
    web: Globe,
    mac: Apple,
    windows: Monitor,
    ios: Smartphone,
    android: Smartphone,
    linux: Monitor,
  };

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
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  }

  // Review form state
  let showReviewForm = $state(false);
  let reviewRating = $state(5);
  let reviewTitle = $state("");
  let reviewContent = $state("");
  let isSubmittingReview = $state(false);
  let editingReviewId = $state<string | null>(null);

  // Check if current user has already reviewed
  const userReview = $derived(
    data.tool.reviews.find((r) => r.user.id === $page.data.user?.id)
  );

  function openReviewForm() {
    if (!isLoggedIn) {
      toast.error("Connectez-vous pour laisser un avis", {
        action: {
          label: "Se connecter",
          onClick: () => goto("/login"),
        },
      });
      return;
    }

    if (userReview) {
      // Pre-fill form for editing
      editingReviewId = userReview.id;
      reviewRating = userReview.rating;
      reviewTitle = userReview.title || "";
      reviewContent = userReview.content || "";
    } else {
      editingReviewId = null;
      reviewRating = 5;
      reviewTitle = "";
      reviewContent = "";
    }
    showReviewForm = true;
  }

  function closeReviewForm() {
    showReviewForm = false;
    editingReviewId = null;
    reviewRating = 5;
    reviewTitle = "";
    reviewContent = "";
  }

  async function submitReview() {
    if (reviewContent && reviewContent.length < 10) {
      toast.error("Le contenu doit faire au moins 10 caractères");
      return;
    }

    isSubmittingReview = true;
    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: data.tool.id,
          rating: reviewRating,
          title: reviewTitle || null,
          content: reviewContent || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de l'envoi");
      }

      const result = await response.json();
      toast.success(result.updated ? "Avis modifié !" : "Avis publié !");
      closeReviewForm();
      // Refresh the page to show new review
      goto(`/tools/${data.tool.slug}`, { invalidateAll: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      isSubmittingReview = false;
    }
  }

  async function deleteReview(reviewId: string) {
    if (!confirm("Voulez-vous vraiment supprimer votre avis ?")) return;

    try {
      const response = await fetch("/api/review", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la suppression");
      }

      toast.success("Avis supprimé");
      goto(`/tools/${data.tool.slug}`, { invalidateAll: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  }

  // Review likes state
  const initialLikedReviews = $derived(new Set(data.likedReviewIds));
  let likedReviewOverrides = $state<Map<string, { liked: boolean; count: number }>>(new Map());

  function getReviewLikeState(reviewId: string, originalCount: number) {
    const override = likedReviewOverrides.get(reviewId);
    if (override) {
      return { liked: override.liked, count: override.count };
    }
    return { liked: initialLikedReviews.has(reviewId), count: originalCount };
  }

  $effect(() => {
    const _ = data.likedReviewIds;
    likedReviewOverrides = new Map();
  });

  async function handleReviewLike(reviewId: string, currentLiked: boolean, currentCount: number) {
    if (!isLoggedIn) {
      toast.error("Connectez-vous pour aimer cet avis", {
        action: {
          label: "Se connecter",
          onClick: () => goto("/login"),
        },
      });
      return;
    }

    // Optimistic update
    const newLiked = !currentLiked;
    const newCount = newLiked ? currentCount + 1 : currentCount - 1;
    likedReviewOverrides.set(reviewId, { liked: newLiked, count: newCount });
    likedReviewOverrides = new Map(likedReviewOverrides);

    try {
      const response = await fetch("/api/review/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors du like");
      }

      const result = await response.json();
      likedReviewOverrides.set(reviewId, { liked: result.liked, count: result.likeCount });
      likedReviewOverrides = new Map(likedReviewOverrides);
    } catch {
      // Revert on error
      likedReviewOverrides.set(reviewId, { liked: currentLiked, count: currentCount });
      likedReviewOverrides = new Map(likedReviewOverrides);
      toast.error("Erreur lors du like");
    }
  }
</script>

<svelte:head>
  <title>{data.tool.name} - Avis et Test | Productivité</title>
  <meta name="description" content={data.tool.tagline || data.tool.description || `Découvrez ${data.tool.name}, ses fonctionnalités, tarifs et avis utilisateurs.`} />
  <meta property="og:title" content="{data.tool.name} - Avis et Test | Productivité" />
  <meta property="og:description" content={data.tool.tagline || `Découvrez ${data.tool.name} et boostez votre productivité.`} />
  {#if data.tool.logo}
    <meta property="og:image" content={data.tool.logo} />
  {/if}
  <meta property="og:type" content="product" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <!-- Breadcrumb -->
  <nav class="mb-6 text-sm text-neutral-500">
    <a href="/" class="hover:text-neutral-900">Accueil</a>
    <span class="mx-2">/</span>
    <a href="/tools" class="hover:text-neutral-900">Outils</a>
    <span class="mx-2">/</span>
    <a href="/categories/{data.tool.category.slug}" class="hover:text-neutral-900">{data.tool.category.name}</a>
    <span class="mx-2">/</span>
    <span class="text-neutral-900">{data.tool.name}</span>
  </nav>

  <div class="grid gap-8 lg:grid-cols-3">
    <!-- Main Content -->
    <div class="lg:col-span-2">
      <!-- Header -->
      <div class="flex items-start gap-6">
        <!-- Logo -->
        <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {#if data.tool.logo}
            <img src={data.tool.logo} alt={data.tool.name} class="h-14 w-14 object-contain" />
          {:else}
            <span class="text-2xl font-bold text-neutral-400">{getInitials(data.tool.name)}</span>
          {/if}
        </div>

        <div class="flex-1">
          <div class="flex items-center gap-3 flex-wrap">
            <h1 class="text-3xl font-bold text-neutral-900">{data.tool.name}</h1>
            <Badge variant={pricingLabels[data.tool.pricing].variant}>
              {pricingLabels[data.tool.pricing].label}
            </Badge>
          </div>
          <p class="mt-2 text-lg text-neutral-600">{data.tool.tagline}</p>
          <div class="mt-4 flex items-center gap-4">
            <a
              href="/categories/{data.tool.category.slug}"
              class="text-sm font-medium hover:underline"
              style="color: {data.tool.category.color}"
            >
              {data.tool.category.name}
            </a>
            {#if data.avgRating > 0}
              <div class="flex items-center gap-1">
                <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span class="text-sm font-medium">{data.avgRating.toFixed(1)}</span>
                <span class="text-sm text-neutral-500">({data.tool._count.reviews} avis)</span>
              </div>
            {/if}
          </div>
        </div>

        <!-- Upvote Button -->
        <Button
          variant="outline"
          size="lg"
          class="flex h-auto flex-col gap-0 px-6 py-3 transition-all {isUpvoted
            ? 'border-orange-500 bg-orange-50 text-orange-600'
            : 'hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600'}"
          onclick={handleUpvote}
          disabled={isLoading}
        >
          {#if isLoading}
            <Loader2 class="h-5 w-5 animate-spin" />
          {:else}
            <ChevronUp class="h-5 w-5 {isUpvoted ? 'fill-orange-600' : ''}" />
          {/if}
          <span class="text-lg font-bold">{upvoteCount}</span>
        </Button>
      </div>

      <!-- Actions -->
      <div class="mt-8 flex gap-4">
        {#if data.tool.website}
          <Button class="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600" href={data.tool.website} target="_blank" rel="noopener noreferrer">
            Visiter le site
            <ExternalLink class="ml-2 h-4 w-4" />
          </Button>
        {/if}
      </div>

      <Separator class="my-8" />

      <!-- Description -->
      <section>
        <h2 class="text-xl font-bold text-neutral-900">Description</h2>
        <p class="mt-4 text-neutral-600 leading-relaxed whitespace-pre-line">
          {data.tool.description || "Aucune description disponible."}
        </p>
      </section>

      <!-- Features -->
      {#if data.tool.features.length > 0}
        <section class="mt-8">
          <h2 class="text-xl font-bold text-neutral-900">Fonctionnalités</h2>
          <ul class="mt-4 grid gap-2 sm:grid-cols-2">
            {#each data.tool.features as feature}
              <li class="flex items-center gap-2 text-neutral-600">
                <Check class="h-4 w-4 text-green-500" />
                {feature}
              </li>
            {/each}
          </ul>
        </section>
      {/if}

      <!-- Pros & Cons -->
      {#if data.tool.pros.length > 0 || data.tool.cons.length > 0}
        <section class="mt-8">
          <h2 class="text-xl font-bold text-neutral-900">Avantages & Inconvénients</h2>
          <div class="mt-4 grid gap-6 sm:grid-cols-2">
            {#if data.tool.pros.length > 0}
              <div class="rounded-xl border border-green-200 bg-green-50 p-4">
                <h3 class="font-semibold text-green-800">Avantages</h3>
                <ul class="mt-3 space-y-2">
                  {#each data.tool.pros as pro}
                    <li class="flex items-start gap-2 text-sm text-green-700">
                      <Check class="mt-0.5 h-4 w-4 shrink-0" />
                      {pro}
                    </li>
                  {/each}
                </ul>
              </div>
            {/if}
            {#if data.tool.cons.length > 0}
              <div class="rounded-xl border border-red-200 bg-red-50 p-4">
                <h3 class="font-semibold text-red-800">Inconvénients</h3>
                <ul class="mt-3 space-y-2">
                  {#each data.tool.cons as con}
                    <li class="flex items-start gap-2 text-sm text-red-700">
                      <X class="mt-0.5 h-4 w-4 shrink-0" />
                      {con}
                    </li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>
        </section>
      {/if}

      <!-- Reviews -->
      <section class="mt-8">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-neutral-900">Avis ({data.tool._count.reviews})</h2>
          <Button variant="outline" onclick={openReviewForm}>
            {userReview ? "Modifier mon avis" : "Laisser un avis"}
          </Button>
        </div>

        <!-- Review Form -->
        {#if showReviewForm}
          <div class="mt-6 rounded-xl border border-neutral-200 bg-white p-6">
            <h3 class="text-lg font-semibold text-neutral-900">
              {editingReviewId ? "Modifier votre avis" : "Donnez votre avis"}
            </h3>

            <!-- Rating -->
            <div class="mt-4">
              <Label>Note</Label>
              <div class="mt-2 flex items-center gap-1">
                {#each Array(5) as _, i}
                  <button
                    type="button"
                    onclick={() => reviewRating = i + 1}
                    class="transition-transform hover:scale-110"
                  >
                    <Star
                      class="h-8 w-8 cursor-pointer {i < reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300 hover:text-yellow-300'}"
                    />
                  </button>
                {/each}
                <span class="ml-2 text-sm text-neutral-500">{reviewRating}/5</span>
              </div>
            </div>

            <!-- Title -->
            <div class="mt-4">
              <Label for="review-title">Titre (optionnel)</Label>
              <Input
                id="review-title"
                bind:value={reviewTitle}
                placeholder="Un titre pour votre avis..."
                class="mt-1"
              />
            </div>

            <!-- Content -->
            <div class="mt-4">
              <Label for="review-content">Votre avis (optionnel, min. 10 caractères)</Label>
              <textarea
                id="review-content"
                bind:value={reviewContent}
                placeholder="Partagez votre expérience avec cet outil..."
                rows="4"
                class="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              ></textarea>
              {#if reviewContent && reviewContent.length > 0 && reviewContent.length < 10}
                <p class="mt-1 text-sm text-red-500">Minimum 10 caractères ({reviewContent.length}/10)</p>
              {/if}
            </div>

            <!-- Actions -->
            <div class="mt-6 flex items-center gap-3">
              <Button onclick={submitReview} disabled={isSubmittingReview}>
                {#if isSubmittingReview}
                  <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                {/if}
                {editingReviewId ? "Modifier" : "Publier"}
              </Button>
              <Button variant="outline" onclick={closeReviewForm}>
                Annuler
              </Button>
            </div>
          </div>
        {/if}

        {#if data.tool.reviews.length > 0}
          <div class="mt-6 space-y-4">
            {#each data.tool.reviews as review}
              {@const likeState = getReviewLikeState(review.id, review.likeCount)}
              <div class="rounded-xl border border-neutral-200 bg-white p-4">
                <div class="flex items-center gap-3">
                  <Avatar.Root class="h-10 w-10">
                    {#if review.user.image}
                      <Avatar.Image src={review.user.image} alt={review.user.name || "Utilisateur"} />
                    {/if}
                    <Avatar.Fallback class="bg-gradient-to-br from-orange-500 to-rose-500 text-white text-sm">
                      {getInitials(review.user.name)}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div>
                    <div class="font-medium text-neutral-900">{review.user.name || "Utilisateur"}</div>
                    <div class="text-sm text-neutral-500">{formatDate(review.createdAt)}</div>
                  </div>
                  <div class="ml-auto flex items-center gap-2">
                    <div class="flex items-center gap-1">
                      {#each Array(5) as _, i}
                        <Star
                          class="h-4 w-4 {i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-200'}"
                        />
                      {/each}
                    </div>
                    {#if review.user.id === $page.data.user?.id}
                      <Button variant="ghost" size="sm" onclick={openReviewForm}>
                        <Edit3 class="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" class="text-red-500 hover:text-red-600" onclick={() => deleteReview(review.id)}>
                        <Trash2 class="h-4 w-4" />
                      </Button>
                    {/if}
                  </div>
                </div>
                {#if review.title}
                  <h4 class="mt-3 font-medium text-neutral-900">{review.title}</h4>
                {/if}
                {#if review.content}
                  <p class="mt-2 text-sm text-neutral-600">{review.content}</p>
                {/if}
                <!-- Like button -->
                <div class="mt-3 flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="gap-1.5 text-neutral-500 hover:text-orange-600 {likeState.liked ? 'text-orange-600' : ''}"
                    onclick={() => handleReviewLike(review.id, likeState.liked, likeState.count)}
                  >
                    <ThumbsUp class="h-4 w-4 {likeState.liked ? 'fill-orange-600' : ''}" />
                    <span class="text-sm">{likeState.count}</span>
                    <span class="text-sm">Utile</span>
                  </Button>
                </div>
              </div>
            {/each}
          </div>
        {:else if !showReviewForm}
          <div class="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center">
            <p class="text-neutral-500">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
          </div>
        {/if}
      </section>
    </div>

    <!-- Sidebar -->
    <div class="lg:col-span-1">
      <div class="sticky top-24 space-y-6">
        <!-- Info Card -->
        <div class="rounded-xl border border-neutral-200 bg-white p-6">
          <h3 class="font-semibold text-neutral-900">Informations</h3>

          <!-- Platforms -->
          {#if data.tool.platforms.length > 0}
            <div class="mt-4">
              <div class="text-sm font-medium text-neutral-500">Plateformes</div>
              <div class="mt-2 flex flex-wrap gap-2">
                {#each data.tool.platforms as platform}
                  <Badge variant="secondary" class="capitalize">
                    {platform}
                  </Badge>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Website -->
          {#if data.tool.website}
            <div class="mt-4">
              <div class="text-sm font-medium text-neutral-500">Site web</div>
              <a
                href={data.tool.website}
                target="_blank"
                rel="noopener noreferrer"
                class="mt-1 flex items-center gap-1 text-sm text-orange-600 hover:underline"
              >
                {new URL(data.tool.website).hostname}
                <ExternalLink class="h-3 w-3" />
              </a>
            </div>
          {/if}

          <!-- Pricing -->
          <div class="mt-4">
            <div class="text-sm font-medium text-neutral-500">Tarification</div>
            <Badge variant={pricingLabels[data.tool.pricing].variant} class="mt-1">
              {pricingLabels[data.tool.pricing].label}
            </Badge>
          </div>
        </div>

        <!-- Related Tools -->
        {#if data.relatedTools.length > 0}
          <div class="rounded-xl border border-neutral-200 bg-white p-6">
            <h3 class="font-semibold text-neutral-900">Outils similaires</h3>
            <div class="mt-4 space-y-3">
              {#each data.relatedTools as tool}
                <a
                  href="/tools/{tool.slug}"
                  class="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-neutral-50"
                >
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
                    {#if tool.logo}
                      <img src={tool.logo} alt={tool.name} class="h-6 w-6 object-contain" />
                    {:else}
                      <span class="text-xs font-bold text-neutral-400">{getInitials(tool.name)}</span>
                    {/if}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-neutral-900 truncate">{tool.name}</div>
                    <div class="text-xs text-neutral-500 truncate">{tool.tagline}</div>
                  </div>
                  <div class="flex items-center gap-1 text-sm text-neutral-400">
                    <ChevronUp class="h-4 w-4" />
                    {tool.upvoteCount}
                  </div>
                </a>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
