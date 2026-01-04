<script lang="ts">
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import {
    LayoutDashboard,
    Wrench,
    FolderOpen,
    Users,
    ArrowLeft,
  } from "@lucide/svelte";

  let { children } = $props();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/tools", label: "Outils", icon: Wrench },
    { href: "/admin/categories", label: "Catégories", icon: FolderOpen },
    { href: "/admin/users", label: "Utilisateurs", icon: Users },
  ];

  function isActive(href: string): boolean {
    if (href === "/admin") {
      return $page.url.pathname === "/admin";
    }
    return $page.url.pathname.startsWith(href);
  }
</script>

<div class="min-h-screen bg-neutral-50">
  <!-- Admin Header -->
  <header class="border-b bg-white">
    <div class="container mx-auto flex items-center justify-between px-4 py-4">
      <div class="flex items-center gap-4">
        <a href="/" class="text-neutral-500 hover:text-neutral-900">
          <ArrowLeft class="h-5 w-5" />
        </a>
        <h1 class="text-xl font-bold text-neutral-900">Admin Dashboard</h1>
      </div>
      <Button variant="outline" href="/">
        Retour au site
      </Button>
    </div>
  </header>

  <div class="container mx-auto flex gap-8 px-4 py-8">
    <!-- Sidebar -->
    <aside class="w-64 shrink-0">
      <nav class="space-y-1">
        {#each navItems as item}
          <a
            href={item.href}
            class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors {isActive(item.href)
              ? 'bg-orange-100 text-orange-700'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}"
          >
            <item.icon class="h-5 w-5" />
            {item.label}
          </a>
        {/each}
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1">
      {@render children()}
    </main>
  </div>
</div>
