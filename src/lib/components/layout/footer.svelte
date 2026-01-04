<script lang="ts">
  import { Separator } from "$lib/components/ui/separator";
  import { Twitter, Github, Linkedin, Mail } from "@lucide/svelte";

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { href: "/tools", label: "Outils" },
      { href: "/categories", label: "Catégories" },
      { href: "/submit", label: "Soumettre un outil" },
    ],
    resources: [
      { href: "/blog", label: "Blog" },
      { href: "/newsletter", label: "Newsletter" },
      { href: "/about", label: "À propos" },
    ],
    legal: [
      { href: "/privacy", label: "Confidentialité" },
      { href: "/terms", label: "CGU" },
      { href: "/contact", label: "Contact" },
    ],
  };

  const socialLinks = [
    { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
    { href: "https://github.com", icon: Github, label: "GitHub" },
    { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
    { href: "mailto:hello@productivite.io", icon: Mail, label: "Email" },
  ];
</script>

<footer class="border-t border-neutral-200 bg-neutral-50">
  <div class="container mx-auto px-4 py-12">
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
      <!-- Brand -->
      <div class="lg:col-span-2">
        <a href="/" class="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 text-white">
            <span class="text-sm font-bold">P</span>
          </div>
          <span>Productivité</span>
        </a>
        <p class="mt-4 max-w-xs text-sm text-neutral-600">
          Découvrez les meilleurs outils SaaS pour booster votre productivité. Reviews, comparatifs et recommandations.
        </p>

        <!-- Social Links -->
        <div class="mt-6 flex gap-4">
          {#each socialLinks as social}
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-300 hover:text-neutral-900"
              aria-label={social.label}
            >
              <social.icon class="h-4 w-4" />
            </a>
          {/each}
        </div>
      </div>

      <!-- Product Links -->
      <div>
        <h3 class="font-semibold text-neutral-900">Produit</h3>
        <ul class="mt-4 space-y-3">
          {#each footerLinks.product as link}
            <li>
              <a
                href={link.href}
                class="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Resources Links -->
      <div>
        <h3 class="font-semibold text-neutral-900">Ressources</h3>
        <ul class="mt-4 space-y-3">
          {#each footerLinks.resources as link}
            <li>
              <a
                href={link.href}
                class="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Legal Links -->
      <div>
        <h3 class="font-semibold text-neutral-900">Légal</h3>
        <ul class="mt-4 space-y-3">
          {#each footerLinks.legal as link}
            <li>
              <a
                href={link.href}
                class="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <Separator class="my-8" />

    <!-- Copyright -->
    <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p class="text-sm text-neutral-500">
        © {currentYear} Productivité. Tous droits réservés.
      </p>
      <p class="text-sm text-neutral-500">
        Fait avec ❤️ en France
      </p>
    </div>
  </div>
</footer>
