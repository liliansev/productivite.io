<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Separator } from "$lib/components/ui/separator";
  import { authClient } from "$lib/auth-client";
  import { toast } from "svelte-sonner";
  import { Mail, Lock, Loader2 } from "@lucide/svelte";

  let email = $state("");
  let password = $state("");
  let isLoading = $state(false);
  let error = $state("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = "";
    isLoading = true;

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        error = result.error.message || "Identifiants incorrects";
        return;
      }

      toast.success("Connexion réussie !");
      goto("/");
    } catch (err) {
      error = "Une erreur est survenue. Veuillez réessayer.";
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Connexion - Productivité</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
  <div class="w-full max-w-md">
    <div class="text-center">
      <a href="/" class="inline-flex items-center gap-2 font-semibold text-lg">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white">
          <span class="text-sm font-bold">P</span>
        </div>
      </a>
      <h1 class="mt-6 text-2xl font-bold text-neutral-900">Bon retour !</h1>
      <p class="mt-2 text-neutral-600">Connectez-vous à votre compte</p>
    </div>

    <form onsubmit={handleSubmit} class="mt-8 space-y-6">
      {#if error}
        <div class="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      {/if}

      <div class="space-y-4">
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
          <div class="flex items-center justify-between">
            <Label for="password">Mot de passe</Label>
            <a href="/forgot-password" class="text-sm text-orange-600 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
          <div class="relative mt-1">
            <Lock class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              class="pl-10"
              bind:value={password}
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
          Connexion...
        {:else}
          Se connecter
        {/if}
      </Button>

      <Separator />

      <p class="text-center text-sm text-neutral-600">
        Pas encore de compte ?
        <a href="/register" class="font-medium text-orange-600 hover:underline">
          S'inscrire
        </a>
      </p>
    </form>
  </div>
</div>
