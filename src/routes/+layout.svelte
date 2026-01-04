<script lang="ts">
  import "../app.css";
  import { Header, Footer } from "$lib/components/layout";
  import { Toaster } from "$lib/components/ui/sonner";

  let { children, data } = $props();
</script>

<svelte:head>
  <!-- Default SEO - overridden by pages -->
  <title>Productivité - Les meilleurs outils SaaS</title>
  <meta name="description" content="Découvrez les meilleurs outils SaaS pour booster votre productivité. Reviews, comparatifs et recommandations par la communauté." />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Productivité" />
  <meta property="og:title" content="Productivité - Les meilleurs outils SaaS" />
  <meta property="og:description" content="Découvrez les meilleurs outils SaaS pour booster votre productivité. Reviews, comparatifs et recommandations par la communauté." />
  <meta property="og:locale" content="fr_FR" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Productivité - Les meilleurs outils SaaS" />
  <meta name="twitter:description" content="Découvrez les meilleurs outils SaaS pour booster votre productivité." />

  <!-- Favicon & Theme -->
  <meta name="theme-color" content="#f97316" />
  <link rel="icon" href="/favicon.ico" sizes="any" />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="flex min-h-screen flex-col">
  <Header user={data.user} />

  <main class="flex-1">
    {@render children()}
  </main>

  <Footer />
</div>

<Toaster position="bottom-right" richColors />
