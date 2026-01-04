<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { CheckCircle, Home, Send } from "@lucide/svelte";
</script>

<svelte:head>
  <title>Outil soumis - Productivité</title>
</svelte:head>

<div class="container mx-auto px-4 py-16">
  <div class="mx-auto max-w-md text-center">
    <Card.Root>
      <Card.Content class="pt-8 pb-8">
        <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle class="h-8 w-8" />
        </div>

        <h1 class="text-2xl font-bold text-neutral-900 mb-2">
          Merci pour votre soumission !
        </h1>

        <p class="text-neutral-600 mb-6">
          Votre outil a été soumis avec succès. Notre équipe va l'examiner et il sera publié prochainement si tout est en ordre.
        </p>

        <div class="flex flex-col gap-3">
          <Button
            href="/"
            class="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
          >
            <Home class="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>

          <Button variant="outline" href="/submit" class="w-full">
            <Send class="mr-2 h-4 w-4" />
            Soumettre un autre outil
          </Button>
        </div>
      </Card.Content>
    </Card.Root>
  </div>
</div>
