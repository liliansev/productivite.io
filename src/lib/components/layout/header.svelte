<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Avatar from "$lib/components/ui/avatar";
  import { Search, Menu, Plus, LogOut, User, Settings } from "@lucide/svelte";
  import { authClient } from "$lib/auth-client";
  import { toast } from "svelte-sonner";
  import MobileNav from "./mobile-nav.svelte";
  import SearchCommand from "$lib/components/search/search-command.svelte";

  let { user = null }: { user: { name?: string | null; email: string; image?: string | null } | null } = $props();

  let mobileNavOpen = $state(false);
  let searchOpen = $state(false);

  async function handleLogout() {
    try {
      await authClient.signOut();
      toast.success("Vous avez été déconnecté");
      goto("/");
    } catch {
      toast.error("Erreur lors de la déconnexion");
    }
  }

  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/tools", label: "Outils" },
    { href: "/categories", label: "Catégories" },
  ];

  function getInitials(name: string | null | undefined): string {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
</script>

<header class="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
  <div class="container mx-auto flex h-16 items-center justify-between px-4">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 font-semibold text-lg tracking-tight">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 text-white">
        <span class="text-sm font-bold">P</span>
      </div>
      <span class="hidden sm:inline-block">Productivité</span>
    </a>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center gap-6">
      {#each navItems as item}
        <a
          href={item.href}
          class="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          class:text-neutral-900={$page.url.pathname === item.href}
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <!-- Search Bar (Desktop) -->
    <button
      onclick={() => searchOpen = true}
      class="hidden md:flex relative max-w-sm flex-1 mx-8 items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-100 transition-colors"
    >
      <Search class="h-4 w-4" />
      <span>Rechercher un outil...</span>
      <kbd class="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-neutral-500">
        <span class="text-xs">⌘</span>K
      </kbd>
    </button>

    <!-- Right Side Actions -->
    <div class="flex items-center gap-3">
      <!-- Search Button (Mobile) -->
      <Button variant="ghost" size="icon" class="md:hidden" onclick={() => searchOpen = true}>
        <Search class="h-5 w-5" />
      </Button>

      {#if user}
        <!-- Submit Tool Button -->
        <Button variant="outline" size="sm" class="hidden sm:flex gap-2" href="/submit">
          <Plus class="h-4 w-4" />
          Soumettre
        </Button>

        <!-- User Menu -->
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Avatar.Root class="h-8 w-8 cursor-pointer">
              {#if user.image}
                <Avatar.Image src={user.image} alt={user.name || "Avatar"} />
              {/if}
              <Avatar.Fallback class="bg-gradient-to-br from-orange-500 to-rose-500 text-white text-xs">
                {getInitials(user.name)}
              </Avatar.Fallback>
            </Avatar.Root>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" class="w-56">
            <DropdownMenu.Label>
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-medium leading-none">{user.name || "Utilisateur"}</p>
                <p class="text-xs leading-none text-neutral-500">{user.email}</p>
              </div>
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onSelect={() => goto("/profile")}>
              <User class="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => goto("/profile")}>
              <Settings class="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item class="text-red-600" onSelect={handleLogout}>
              <LogOut class="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      {:else}
        <!-- Auth Buttons -->
        <Button variant="ghost" size="sm" href="/login">
          Connexion
        </Button>
        <Button size="sm" class="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600" href="/register">
          S'inscrire
        </Button>
      {/if}

      <!-- Mobile Menu Button -->
      <Button variant="ghost" size="icon" class="md:hidden" onclick={() => mobileNavOpen = true}>
        <Menu class="h-5 w-5" />
      </Button>
    </div>
  </div>
</header>

<MobileNav bind:open={mobileNavOpen} {navItems} {user} />
<SearchCommand bind:open={searchOpen} />
