<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Badge } from "$lib/components/ui/badge";
  import * as Card from "$lib/components/ui/card";
  import * as Avatar from "$lib/components/ui/avatar";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import {
    Search,
    MoreVertical,
    Shield,
    ShieldOff,
    ChevronDown,
    Heart,
    Star,
  } from "@lucide/svelte";
  import { toast } from "svelte-sonner";

  let { data } = $props();

  let searchQuery = $state($page.url.searchParams.get("q") || "");
  let roleFilter = $state($page.url.searchParams.get("role") || "");

  function handleSearch(e: Event) {
    e.preventDefault();
    updateFilters({ q: searchQuery });
  }

  function updateFilters(updates: Record<string, string>) {
    const params = new URLSearchParams($page.url.searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    goto(`/admin/users?${params.toString()}`);
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

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

<svelte:head>
  <title>Gestion des utilisateurs - Admin</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-2xl font-bold text-neutral-900">Gestion des utilisateurs</h2>
    <Badge variant="outline">{data.users.length} utilisateurs</Badge>
  </div>

  <!-- Filters -->
  <Card.Root>
    <Card.Content class="p-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <form onsubmit={handleSearch} class="relative flex-1">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            type="search"
            placeholder="Rechercher par nom ou email..."
            class="pl-9"
            bind:value={searchQuery}
          />
        </form>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            {roleFilter === "ADMIN"
              ? "Admins"
              : roleFilter === "USER"
                ? "Utilisateurs"
                : "Tous les rôles"}
            <ChevronDown class="h-4 w-4" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item onclick={() => updateFilters({ role: "" })}>
              Tous les rôles
            </DropdownMenu.Item>
            <DropdownMenu.Item onclick={() => updateFilters({ role: "ADMIN" })}>
              Admins
            </DropdownMenu.Item>
            <DropdownMenu.Item onclick={() => updateFilters({ role: "USER" })}>
              Utilisateurs
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </Card.Content>
  </Card.Root>

  <!-- Users Table -->
  <Card.Root>
    <Card.Content class="p-0">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b bg-neutral-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600">Utilisateur</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600">Rôle</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600">Activité</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600">Inscrit le</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            {#each data.users as user}
              <tr class="hover:bg-neutral-50">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <Avatar.Root class="h-10 w-10">
                      {#if user.image}
                        <Avatar.Image src={user.image} alt={user.name || "Avatar"} />
                      {/if}
                      <Avatar.Fallback class="bg-gradient-to-br from-orange-500 to-rose-500 text-white">
                        {getInitials(user.name)}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <div>
                      <p class="font-medium text-neutral-900">
                        {user.name || "Utilisateur"}
                      </p>
                      <p class="text-sm text-neutral-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role === "ADMIN" ? "Admin" : "Utilisateur"}
                  </Badge>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-4 text-sm text-neutral-500">
                    <span class="flex items-center gap-1">
                      <Heart class="h-4 w-4" />
                      {user._count.upvotes}
                    </span>
                    <span class="flex items-center gap-1">
                      <Star class="h-4 w-4" />
                      {user._count.reviews}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-neutral-500">
                  {formatDate(user.createdAt)}
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end">
                    {#if user.id !== $page.data.user?.id}
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger
                          class="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                        >
                          <MoreVertical class="h-4 w-4" />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content align="end">
                          {#if user.role === "USER"}
                            <form
                              method="POST"
                              action="?/promote"
                              use:enhance={() => {
                                return async ({ result }) => {
                                  if (result.type === "success") {
                                    toast.success("Utilisateur promu admin");
                                    goto("/admin/users", { invalidateAll: true });
                                  }
                                };
                              }}
                            >
                              <input type="hidden" name="userId" value={user.id} />
                              <DropdownMenu.Item
                                onclick={(e) => {
                                  const form = e.currentTarget.closest("form");
                                  if (form) form.requestSubmit();
                                }}
                              >
                                <Shield class="mr-2 h-4 w-4" />
                                Promouvoir admin
                              </DropdownMenu.Item>
                            </form>
                          {:else}
                            <form
                              method="POST"
                              action="?/demote"
                              use:enhance={() => {
                                return async ({ result }) => {
                                  if (result.type === "success") {
                                    toast.success("Droits admin retirés");
                                    goto("/admin/users", { invalidateAll: true });
                                  }
                                };
                              }}
                            >
                              <input type="hidden" name="userId" value={user.id} />
                              <DropdownMenu.Item
                                onclick={(e) => {
                                  const form = e.currentTarget.closest("form");
                                  if (form) form.requestSubmit();
                                }}
                              >
                                <ShieldOff class="mr-2 h-4 w-4" />
                                Retirer admin
                              </DropdownMenu.Item>
                            </form>
                          {/if}
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    {:else}
                      <span class="text-xs text-neutral-400">Vous</span>
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>

        {#if data.users.length === 0}
          <div class="py-12 text-center">
            <p class="text-neutral-500">Aucun utilisateur trouvé</p>
          </div>
        {/if}
      </div>
    </Card.Content>
  </Card.Root>
</div>
