<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Badge } from "$lib/components/ui/badge";
  import * as Card from "$lib/components/ui/card";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import {
    Search,
    MoreVertical,
    Eye,
    EyeOff,
    Trash2,
    ExternalLink,
    ChevronDown,
  } from "@lucide/svelte";
  import { toast } from "svelte-sonner";

  let { data } = $props();

  let searchQuery = $state($page.url.searchParams.get("q") || "");
  let statusFilter = $state($page.url.searchParams.get("status") || "");

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
    goto(`/admin/tools?${params.toString()}`);
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }
</script>

<svelte:head>
  <title>Gestion des outils - Admin</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-2xl font-bold text-neutral-900">Gestion des outils</h2>
    <Badge variant="outline">{data.tools.length} outils</Badge>
  </div>

  <!-- Filters -->
  <Card.Root>
    <Card.Content class="p-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <form onsubmit={handleSearch} class="relative flex-1">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            type="search"
            placeholder="Rechercher un outil..."
            class="pl-9"
            bind:value={searchQuery}
          />
        </form>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            {statusFilter === "PUBLISHED"
              ? "Publiés"
              : statusFilter === "DRAFT"
                ? "Brouillons"
                : "Tous les statuts"}
            <ChevronDown class="h-4 w-4" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item onclick={() => updateFilters({ status: "" })}>
              Tous les statuts
            </DropdownMenu.Item>
            <DropdownMenu.Item onclick={() => updateFilters({ status: "PUBLISHED" })}>
              Publiés
            </DropdownMenu.Item>
            <DropdownMenu.Item onclick={() => updateFilters({ status: "DRAFT" })}>
              Brouillons
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </Card.Content>
  </Card.Root>

  <!-- Tools Table -->
  <Card.Root>
    <Card.Content class="p-0">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b bg-neutral-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600">Outil</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600">Catégorie</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600">Statut</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600">Votes</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600">Avis</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600">Créé le</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            {#each data.tools as tool}
              <tr class="hover:bg-neutral-50">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    {#if tool.logo}
                      <img
                        src={tool.logo}
                        alt={tool.name}
                        class="h-10 w-10 rounded-lg object-cover"
                      />
                    {:else}
                      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                        <span class="font-bold text-neutral-400">{tool.name[0]}</span>
                      </div>
                    {/if}
                    <div>
                      <a
                        href="/tools/{tool.slug}"
                        target="_blank"
                        class="font-medium text-neutral-900 hover:text-orange-600"
                      >
                        {tool.name}
                      </a>
                      {#if tool.tagline}
                        <p class="text-sm text-neutral-500 truncate max-w-[200px]">
                          {tool.tagline}
                        </p>
                      {/if}
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <Badge variant="outline" style="border-color: {tool.category.color}">
                    {tool.category.name}
                  </Badge>
                </td>
                <td class="px-4 py-3">
                  <Badge variant={tool.status === "PUBLISHED" ? "default" : "secondary"}>
                    {tool.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                  </Badge>
                </td>
                <td class="px-4 py-3 text-sm text-neutral-600">
                  {tool._count.upvotes}
                </td>
                <td class="px-4 py-3 text-sm text-neutral-600">
                  {tool._count.reviews}
                </td>
                <td class="px-4 py-3 text-sm text-neutral-500">
                  {formatDate(tool.createdAt)}
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end gap-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger
                        class="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                      >
                        <MoreVertical class="h-4 w-4" />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content align="end">
                        <DropdownMenu.Item
                          onclick={() => window.open(`/tools/${tool.slug}`, "_blank")}
                        >
                          <ExternalLink class="mr-2 h-4 w-4" />
                          Voir
                        </DropdownMenu.Item>

                        {#if tool.status === "DRAFT"}
                          <form
                            method="POST"
                            action="?/publish"
                            use:enhance={() => {
                              return async ({ result }) => {
                                if (result.type === "success") {
                                  toast.success("Outil publié");
                                  goto("/admin/tools", { invalidateAll: true });
                                }
                              };
                            }}
                          >
                            <input type="hidden" name="toolId" value={tool.id} />
                            <DropdownMenu.Item
                              onclick={(e) => {
                                const form = e.currentTarget.closest("form");
                                if (form) form.requestSubmit();
                              }}
                            >
                              <Eye class="mr-2 h-4 w-4" />
                              Publier
                            </DropdownMenu.Item>
                          </form>
                        {:else}
                          <form
                            method="POST"
                            action="?/unpublish"
                            use:enhance={() => {
                              return async ({ result }) => {
                                if (result.type === "success") {
                                  toast.success("Outil dépublié");
                                  goto("/admin/tools", { invalidateAll: true });
                                }
                              };
                            }}
                          >
                            <input type="hidden" name="toolId" value={tool.id} />
                            <DropdownMenu.Item
                              onclick={(e) => {
                                const form = e.currentTarget.closest("form");
                                if (form) form.requestSubmit();
                              }}
                            >
                              <EyeOff class="mr-2 h-4 w-4" />
                              Dépublier
                            </DropdownMenu.Item>
                          </form>
                        {/if}

                        <DropdownMenu.Separator />

                        <form
                          method="POST"
                          action="?/delete"
                          use:enhance={() => {
                            if (!confirm("Supprimer cet outil ?")) {
                              return () => {};
                            }
                            return async ({ result }) => {
                              if (result.type === "success") {
                                toast.success("Outil supprimé");
                                goto("/admin/tools", { invalidateAll: true });
                              }
                            };
                          }}
                        >
                          <input type="hidden" name="toolId" value={tool.id} />
                          <DropdownMenu.Item
                            class="text-red-600"
                            onclick={(e) => {
                              const form = e.currentTarget.closest("form");
                              if (form) form.requestSubmit();
                            }}
                          >
                            <Trash2 class="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenu.Item>
                        </form>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>

        {#if data.tools.length === 0}
          <div class="py-12 text-center">
            <p class="text-neutral-500">Aucun outil trouvé</p>
          </div>
        {/if}
      </div>
    </Card.Content>
  </Card.Root>
</div>
