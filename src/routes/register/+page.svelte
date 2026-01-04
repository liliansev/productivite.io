<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Separator } from "$lib/components/ui/separator";
  import { authClient } from "$lib/auth-client";
  import { toast } from "svelte-sonner";
  import { Mail, Lock, User, Loader2 } from "@lucide/svelte";

  let name = $state("");
  let email = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let isLoading = $state(false);
  let error = $state("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = "";

    if (password !== confirmPassword) {
      error = "Les mots de passe ne correspondent pas";
      return;
    }

    if (password.length < 8) {
      error = "Le mot de passe doit contenir au moins 8 caractères";
      return;
    }

    isLoading = true;

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        error = result.error.message || "Une erreur est survenue";
        return;
      }

      toast.success("Compte créé avec succès !");
      goto("/");
    } catch (err) {
      error = "Une erreur est survenue. Veuillez réessayer.";
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Inscription - Productivité</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
  <div class="w-full max-w-md">
    <div class="text-center">
      <a href="/" class="inline-flex items-center gap-2 font-semibold text-lg">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white">
          <span class="text-sm font-bold">P</span>
        </div>
      </a>
      <h1 class="mt-6 text-2xl font-bold text-neutral-900">Créer un compte</h1>
      <p class="mt-2 text-neutral-600">Rejoignez la communauté Productivité</p>
    </div>

    <form onsubmit={handleSubmit} class="mt-8 space-y-6">
      {#if error}
        <div class="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      {/if}

      <div class="space-y-4">
        <div>
          <Label for="name">Nom</Label>
          <div class="relative mt-1">
            <User class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              id="name"
              type="text"
              placeholder="Votre nom"
              class="pl-10"
              bind:value={name}
              required
            />
          </div>
        </div>

        <div>
          <Label for="email">Email</Label>
          <div class="relative mt-1">
            <Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.com"
              class="pl-10"
              bind:value={email}
              required
            />
          </div>
        </div>

        <div>
          <Label for="password">Mot de passe</Label>
          <div class="relative mt-1">
            <Lock class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              id="password"
              type="password"
              placeholder="Au moins 8 caractères"
              class="pl-10"
              bind:value={password}
              minlength={8}
              required
            />
          </div>
        </div>

        <div>
          <Label for="confirmPassword">Confirmer le mot de passe</Label>
          <div class="relative mt-1">
            <Lock class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirmez votre mot de passe"
              class="pl-10"
              bind:value={confirmPassword}
              minlength={8}
              required
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        class="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
        disabled={isLoading}
      >
        {#if isLoading}
          <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          Création...
        {:else}
          Créer mon compte
        {/if}
      </Button>

      <p class="text-center text-xs text-neutral-500">
        En créant un compte, vous acceptez nos
        <a href="/terms" class="text-orange-600 hover:underline">CGU</a>
        et notre
        <a href="/privacy" class="text-orange-600 hover:underline">Politique de confidentialité</a>.
      </p>

      <Separator />

      <p class="text-center text-sm text-neutral-600">
        Déjà un compte ?
        <a href="/login" class="font-medium text-orange-600 hover:underline">
          Se connecter
        </a>
      </p>
    </form>
  </div>
</div>
