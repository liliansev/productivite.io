<script lang="ts">
  import { goto } from "$app/navigation";
  import * as Sheet from "$lib/components/ui/sheet";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Separator } from "$lib/components/ui/separator";
  import { Search, X, LogOut, User, Settings, Plus } from "@lucide/svelte";
  import { authClient } from "$lib/auth-client";
  import { toast } from "svelte-sonner";

  let {
    open = $bindable(false),
    navItems = [],
    user = null,
  }: {
    open: boolean;
    navItems: { href: string; label: string }[];
    user: { name?: string | null; email: string; image?: string | null } | null;
  } = $props();

  let searchQuery = $state("");

  function handleSearch(e: Event) {
    e.preventDefault();
    if (searchQuery.trim()) {
      open = false;
      window.location.href = `/tools?q=${encodeURIComponent(searchQuery)}`;
    }
  }

  async function handleLogout() {
    try {
      await authClient.signOut();
      toast.success("Vous avez été déconnecté");
      open = false;
      goto("/");
    } catch {
      toast.error("Erreur lors de la déconnexion");
    }
  }
</script>

<Sheet.Root bind:open>
  <Sheet.Content side="right" class="w-full sm:max-w-sm">
    <Sheet.Header>
      <Sheet.Title class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 text-white">
          <span class="text-sm font-bold">P</span>
        </div>
        Productivité
      </Sheet.Title>
    </Sheet.Header>

    <div class="flex flex-col gap-6 py-6">
      <!-- Search -->
      <form onsubmit={handleSearch} class="relative">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          type="search"
          placeholder="Rechercher un outil..."
          class="pl-9"
          bind:value={searchQuery}
        />
      </form>

      <Separator />

      <!-- Navigation Links -->
      <nav class="flex flex-col gap-2">
        {#each navItems as item}
          <a
            href={item.href}
            class="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            onclick={() => open = false}
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <Separator />

      <!-- User Section -->
      {#if user}
        <div class="flex flex-col gap-2">
          <div class="px-3 py-2">
            <p class="text-sm font-medium">{user.name || "Utilisateur"}</p>
            <p class="text-xs text-neutral-500">{user.email}</p>
          </div>

          <a
            href="/submit"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
            onclick={() => open = false}
          >
            <Plus class="h-4 w-4" />
            Soumettre un outil
          </a>
          <a
            href="/profile"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
            onclick={() => open = false}
          >
            <User class="h-4 w-4" />
            Profil
          </a>
          <a
            href="/settings"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
            onclick={() => open = false}
          >
            <Settings class="h-4 w-4" />
            Paramètres
          </a>

          <Separator />

          <button
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            onclick={handleLogout}
          >
            <LogOut class="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      {:else}
        <div class="flex flex-col gap-3 px-3">
          <Button variant="outline" href="/login" onclick={() => open = false}>
            Connexion
          </Button>
          <Button
            class="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
            href="/register"
            onclick={() => open = false}
          >
            S'inscrire
          </Button>
        </div>
      {/if}
    </div>
  </Sheet.Content>
</Sheet.Root>
