# User Stories - productivite.io

## Vision produit

**productivite.io** est un annuaire communautaire d'outils SaaS de productivité. Les utilisateurs peuvent découvrir, comparer, voter et commenter des outils pour optimiser leur workflow.

---

## Personas

| Persona | Description |
|---------|-------------|
| **Visiteur** | Personne non connectée qui découvre et explore |
| **Utilisateur** | Membre inscrit qui interagit activement |
| **Admin** | Gestionnaire qui modère et enrichit le contenu |

---

## 1. Visiteur (non connecté)

### US-1.1 - Voir tous les outils
**En tant que** visiteur
**Je veux** voir la liste de tous les outils
**Afin de** découvrir les outils disponibles

**Critères d'acceptation :**
- [x] Page `/tools` affiche tous les outils publiés
- [x] Chaque outil affiche : nom, logo, tagline, catégorie, upvotes
- [x] Tri par popularité / récent / alphabétique
- [x] Pagination ou infinite scroll

---

### US-1.2 - Rechercher un outil
**En tant que** visiteur
**Je veux** rechercher un outil via la barre de recherche
**Afin de** trouver rapidement ce que je cherche

**Critères d'acceptation :**
- [x] Barre de recherche visible dans le header
- [x] Raccourci clavier `Cmd+K` / `Ctrl+K`
- [x] Résultats en temps réel (Algolia)
- [x] Affichage nom + tagline + catégorie dans les résultats
- [x] Clic sur un résultat redirige vers la page outil

---

### US-1.3 - Accéder à un outil et lire le contenu
**En tant que** visiteur
**Je veux** voir les détails complets d'un outil
**Afin d'** évaluer s'il répond à mes besoins

**Critères d'acceptation :**
- [x] Page `/tools/[slug]` accessible
- [x] Affichage : nom, logo, tagline, description complète
- [x] Catégorie cliquable (lien vers la catégorie)
- [x] Pricing affiché (gratuit, freemium, payant, entreprise)
- [x] Plateformes supportées (web, mobile, desktop, extension)
- [x] Bouton "Visiter le site" (lien externe)
- [x] Compteur d'upvotes visible
- [x] Section commentaires visible (lecture seule)

---

### US-1.4 - Voir les boutons de vote
**En tant que** visiteur
**Je veux** voir les boutons permettant de voter
**Afin de** savoir que je peux interagir après connexion

**Critères d'acceptation :**
- [x] Bouton upvote visible sur chaque card outil
- [x] Bouton upvote visible sur la page détail
- [x] Compteur de votes affiché à côté du bouton
- [x] Style différent (désactivé ou avec icône "login")

---

### US-1.5 - Redirection si action non autorisée
**En tant que** visiteur
**Je veux** être redirigé vers la connexion si j'essaie une action réservée
**Afin de** comprendre que je dois me connecter

**Critères d'acceptation :**
- [x] Clic sur upvote → redirection vers `/login` (via toast avec bouton)
- [x] Clic sur "commenter" → redirection vers `/login`
- [x] Clic sur "soumettre un outil" → redirection vers `/login`
- [x] Message explicatif "Connectez-vous pour voter"
- [ ] Après connexion, retour à la page d'origine

---

### US-1.6 - Navigation par catégories
**En tant que** visiteur
**Je veux** explorer les outils par catégorie
**Afin de** trouver des outils dans mon domaine

**Critères d'acceptation :**
- [x] Page `/categories` liste toutes les catégories
- [x] Chaque catégorie affiche : icône, nom, description, nombre d'outils
- [x] Page `/categories/[slug]` affiche les outils de la catégorie
- [x] Tri disponible sur la page catégorie

---

## 2. Utilisateur connecté

### US-2.1 - Toutes les actions visiteur
**En tant que** utilisateur connecté
**Je veux** faire toutes les actions d'un visiteur
**Afin de** naviguer librement

**Critères d'acceptation :**
- [x] Accès à toutes les pages publiques
- [x] Recherche fonctionnelle
- [x] Navigation par catégories

---

### US-2.2 - Voter pour un outil
**En tant que** utilisateur connecté
**Je veux** voter (upvote) pour un outil
**Afin de** montrer mon appréciation

**Critères d'acceptation :**
- [x] Clic sur upvote → incrémente le compteur
- [x] Clic à nouveau → retire le vote (toggle)
- [x] Feedback visuel (bouton actif/inactif)
- [x] Persistance en base de données
- [x] Un seul vote par utilisateur/outil
- [x] Mise à jour en temps réel (optimistic UI)

---

### US-2.3 - Commenter un outil
**En tant que** utilisateur connecté
**Je veux** commenter un outil
**Afin de** partager mon avis

**Critères d'acceptation :**
- [x] Zone de commentaire sur la page outil
- [x] Champ texte avec validation (min 10 caractères)
- [x] Bouton "Publier"
- [x] Commentaire affiché immédiatement après publication
- [x] Affichage : avatar, nom, date, contenu
- [x] Modification de son propre commentaire
- [x] Suppression de son propre commentaire

---

### US-2.4 - Répondre à un commentaire
**En tant que** utilisateur connecté
**Je veux** répondre à un commentaire existant
**Afin de** engager la discussion

**Critères d'acceptation :**
- [ ] Bouton "Répondre" sur chaque commentaire
- [ ] Formulaire de réponse inline
- [ ] Réponses indentées sous le commentaire parent
- [ ] Notification à l'auteur du commentaire parent
- [ ] Limite de profondeur (2 niveaux max)

---

### US-2.5 - Liker un commentaire
**En tant que** utilisateur connecté
**Je veux** liker un commentaire
**Afin de** montrer mon accord

**Critères d'acceptation :**
- [x] Bouton like sur chaque commentaire
- [x] Compteur de likes affiché
- [x] Toggle like/unlike
- [x] Un seul like par utilisateur/commentaire
- [x] Tri des commentaires par likes possible

---

### US-2.6 - Soumettre un outil
**En tant que** utilisateur connecté
**Je veux** soumettre un nouvel outil
**Afin de** le partager avec la communauté

**Critères d'acceptation :**
- [x] Page `/submit` accessible
- [x] Formulaire : nom, website, tagline, description
- [x] Sélection catégorie (dropdown)
- [x] Sélection pricing (radio)
- [x] Sélection plateformes (checkboxes)
- [x] Upload logo (optionnel)
- [x] Validation des champs
- [x] Confirmation après soumission
- [x] Outil créé en statut DRAFT

---

### US-2.7 - Gérer son profil
**En tant que** utilisateur connecté
**Je veux** voir et modifier mon profil
**Afin de** gérer mes informations

**Critères d'acceptation :**
- [x] Page `/profile` accessible
- [x] Affichage : nom, email, avatar
- [x] Modification du nom
- [ ] Upload/modification de l'avatar
- [x] Liste de mes upvotes
- [x] Liste de mes commentaires
- [x] Suppression de compte (avec confirmation)

---

## 3. Administrateur

### US-3.1 - CRUD Outils
**En tant qu'** admin
**Je veux** gérer tous les outils
**Afin de** maintenir la qualité du contenu

**Critères d'acceptation :**
- [x] Dashboard admin `/admin`
- [x] Liste de tous les outils (DRAFT + PUBLISHED)
- [ ] Création d'un outil
- [ ] Modification de tout outil
- [x] Suppression d'un outil (soft delete ?)
- [x] Publication (DRAFT → PUBLISHED)
- [x] Dépublication (PUBLISHED → DRAFT)

---

### US-3.2 - CRUD Catégories
**En tant qu'** admin
**Je veux** gérer les catégories
**Afin d'** organiser le contenu

**Critères d'acceptation :**
- [x] Liste des catégories dans le dashboard
- [ ] Création d'une catégorie (nom, slug, icône, couleur)
- [ ] Modification d'une catégorie
- [ ] Suppression (seulement si vide)
- [ ] Réordonner les catégories (drag & drop)

---

### US-3.3 - CRUD Utilisateurs
**En tant qu'** admin
**Je veux** gérer les utilisateurs
**Afin de** modérer la communauté

**Critères d'acceptation :**
- [x] Liste des utilisateurs
- [x] Voir le profil d'un utilisateur
- [ ] Désactiver/Bannir un utilisateur
- [x] Promouvoir un utilisateur en admin
- [x] Voir l'activité (upvotes, commentaires)

---

### US-3.4 - Modération des commentaires
**En tant qu'** admin
**Je veux** modérer les commentaires
**Afin de** maintenir un contenu approprié

**Critères d'acceptation :**
- [x] Liste des commentaires récents
- [ ] Signalements visibles
- [ ] Suppression d'un commentaire
- [ ] Avertissement à l'utilisateur

---

### US-3.5 - Modération des soumissions
**En tant qu'** admin
**Je veux** valider les outils soumis
**Afin de** garantir la qualité

**Critères d'acceptation :**
- [x] Liste des outils en DRAFT
- [ ] Prévisualisation avant publication
- [x] Bouton Publier
- [ ] Bouton Rejeter avec motif
- [ ] Email de notification à l'utilisateur

---

## 4. Fonctionnalités techniques

### US-4.1 - Authentification
- [x] Inscription email/password
- [x] Connexion email/password
- [ ] OAuth Google
- [ ] OAuth GitHub
- [ ] Mot de passe oublié
- [ ] Vérification email

### US-4.2 - SEO
- [x] Meta tags dynamiques
- [x] Open Graph
- [x] Sitemap XML
- [ ] Schema.org (SoftwareApplication)
- [ ] URLs canoniques

### US-4.3 - Performance
- [x] SSR avec SvelteKit
- [ ] Lazy loading images
- [ ] Cache des requêtes
- [ ] Core Web Vitals > 90

---

## 5. Roadmap

### Phase 1 - MVP (actuel)
- [x] Navigation outils/catégories
- [x] Recherche Algolia
- [x] Auth email/password
- [x] Upvotes
- [x] Soumission d'outils
- [x] Avis/Reviews

### Phase 2 - Engagement
- [ ] Réponses aux commentaires
- [ ] Likes sur commentaires
- [x] Profil utilisateur complet
- [ ] Notifications

### Phase 3 - Administration
- [x] Dashboard admin
- [x] Modération outils
- [x] Liste commentaires récents
- [x] Gestion utilisateurs

### Phase 4 - Croissance
- [ ] OAuth (Google, GitHub)
- [ ] Comparateur d'outils
- [ ] Alternatives suggérées
- [ ] Collections personnelles
- [ ] API publique
