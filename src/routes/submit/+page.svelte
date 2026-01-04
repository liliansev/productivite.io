<script lang="ts">
  import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Card from "$lib/components/ui/card";
  import { Separator } from "$lib/components/ui/separator";
  import {
    Sparkles,
    Globe,
    Tag,
    FolderOpen,
    DollarSign,
    Monitor,
    Smartphone,
    Chrome,
    Loader2,
  } from "@lucide/svelte";

  let { data, form } = $props();
  let isSubmitting = $state(false);

  const pricingOptions = [
    { value: "FREE", label: "Gratuit", description: "Complètement gratuit" },
    { value: "FREEMIUM", label: "Freemium", description: "Version gratuite + options payantes" },
    { value: "PAID", label: "Payant", description: "Abonnement ou achat requis" },
    { value: "ENTERPRISE", label: "Entreprise", description: "Tarification sur mesure" },
  ];

  const platformOptions = [
    { value: "WEB", label: "Web", icon: Globe },
    { value: "DESKTOP", label: "Desktop", icon: Monitor },
    { value: "MOBILE", label: "Mobile", icon: Smartphone },
    { value: "CHROME", label: "Extension Chrome", icon: Chrome },
  ];
</script>

<svelte:head>
  <title>Soumettre un outil - Productivité</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mx-auto max-w-2xl">
    <!-- Header -->
    <div class="mb-8 text-center">
      <div class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white mb-4">
        <Sparkles class="h-7 w-7" />
      </div>
      <h1 class="text-2xl font-bold text-neutral-900">Soumettre un outil</h1>
      <p class="mt-2 text-neutral-600">
        Partagez un outil qui vous aide à être plus productif
      </p>
    </div>

    <Card.Root>
      <Card.Content class="pt-6">
        <form
          method="POST"
          use:enhance={() => {
            isSubmitting = true;
            return async ({ update }) => {
              await update();
              isSubmitting = false;
            };
          }}
          class="space-y-6"
        >
          <!-- Name -->
          <div class="space-y-2">
            <Label for="name" class="flex items-center gap-2">
              <Sparkles class="h-4 w-4 text-neutral-400" />
              Nom de l'outil *
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Notion, Figma, Slack..."
              value={form?.data?.name || ""}
              class={form?.errors?.name ? "border-red-500" : ""}
              required
            />
            {#if form?.errors?.name}
              <p class="text-sm text-red-600">{form.errors.name}</p>
            {/if}
          </div>

          <!-- Website -->
          <div class="space-y-2">
            <Label for="website" class="flex items-center gap-2">
              <Globe class="h-4 w-4 text-neutral-400" />
              Site web *
            </Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://exemple.com"
              value={form?.data?.website || ""}
              class={form?.errors?.website ? "border-red-500" : ""}
              required
            />
            {#if form?.errors?.website}
              <p class="text-sm text-red-600">{form.errors.website}</p>
            {/if}
          </div>

          <!-- Tagline -->
          <div class="space-y-2">
            <Label for="tagline" class="flex items-center gap-2">
              <Tag class="h-4 w-4 text-neutral-400" />
              Description courte *
            </Label>
            <Input
              id="tagline"
              name="tagline"
              placeholder="Une phrase pour décrire l'outil"
              value={form?.data?.tagline || ""}
              class={form?.errors?.tagline ? "border-red-500" : ""}
              required
            />
            {#if form?.errors?.tagline}
              <p class="text-sm text-red-600">{form.errors.tagline}</p>
            {/if}
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <Label for="description" class="flex items-center gap-2">
              Description détaillée
            </Label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Décrivez les fonctionnalités principales, les cas d'usage..."
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >{form?.data?.description || ""}</textarea>
          </div>

          <Separator />

          <!-- Category -->
          <div class="space-y-2">
            <Label class="flex items-center gap-2">
              <FolderOpen class="h-4 w-4 text-neutral-400" />
              Catégorie *
            </Label>
            <select
              name="categoryId"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 {form?.errors
                ?.categoryId
                ? 'border-red-500'
                : ''}"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {#each data.categories as category}
                <option
                  value={category.id}
                  selected={form?.data?.categoryId === category.id}
                >
                  {category.name}
                </option>
              {/each}
            </select>
            {#if form?.errors?.categoryId}
              <p class="text-sm text-red-600">{form.errors.categoryId}</p>
            {/if}
          </div>

          <!-- Pricing -->
          <div class="space-y-3">
            <Label class="flex items-center gap-2">
              <DollarSign class="h-4 w-4 text-neutral-400" />
              Modèle tarifaire *
            </Label>
            <div class="grid grid-cols-2 gap-3">
              {#each pricingOptions as option}
                <label
                  class="relative flex cursor-pointer flex-col rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50"
                >
                  <input
                    type="radio"
                    name="pricing"
                    value={option.value}
                    class="sr-only"
                    checked={form?.data?.pricing === option.value}
                    required
                  />
                  <span class="font-medium text-neutral-900">{option.label}</span>
                  <span class="text-xs text-neutral-500">{option.description}</span>
                </label>
              {/each}
            </div>
            {#if form?.errors?.pricing}
              <p class="text-sm text-red-600">{form.errors.pricing}</p>
            {/if}
          </div>

          <!-- Platforms -->
          <div class="space-y-3">
            <Label class="flex items-center gap-2">
              <Monitor class="h-4 w-4 text-neutral-400" />
              Plateformes disponibles
            </Label>
            <div class="grid grid-cols-2 gap-3">
              {#each platformOptions as option}
                <label
                  class="relative flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50"
                >
                  <input
                    type="checkbox"
                    name="platforms"
                    value={option.value}
                    class="rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
                    checked={form?.data?.platforms?.includes(option.value)}
                  />
                  <option.icon class="h-4 w-4 text-neutral-600" />
                  <span class="text-sm font-medium text-neutral-900">
                    {option.label}
                  </span>
                </label>
              {/each}
            </div>
          </div>

          <Separator />

          <!-- Submit Button -->
          <div class="flex flex-col gap-3">
            <Button
              type="submit"
              class="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
              disabled={isSubmitting}
            >
              {#if isSubmitting}
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                Soumission en cours...
              {:else}
                <Sparkles class="mr-2 h-4 w-4" />
                Soumettre l'outil
              {/if}
            </Button>
            <p class="text-center text-xs text-neutral-500">
              L'outil sera examiné avant publication
            </p>
          </div>
        </form>
      </Card.Content>
    </Card.Root>
  </div>
</div>
