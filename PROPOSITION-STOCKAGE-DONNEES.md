# Stockage des données — proposition

État des lieux et options pour remplacer/compléter `data.json`, dans le contexte
réel du projet : site statique (HTML/CSS/JS vanilla, sans build), dépôt GitHub
`Ikki454/Plumesdesons`, déployé sur **Vercel**.

## Constat sur l'existant

`data.json` sert aujourd'hui deux rôles très différents :

1. **Contenu public** (`creations`, `events`) — lu par `script.js` pour générer
   la grille "Nos créations" et les représentations à venir. Volume très
   faible (2-3 créations, quelques dates par saison) et changements peu
   fréquents.
2. **Identifiants de connexion** (`login`) — un tableau `id` / `mdp` **en clair**
   (`admin123`, `client123`), servant à `login.html` / `login.js`.

Le point 2 est un vrai problème, indépendamment de la suite : `data.json` est
un fichier statique public, servi tel quel par Vercel. N'importe qui peut
l'ouvrir (`votre-site.vercel.app/data.json`) et lire les mots de passe en
clair. `login.js` a par ailleurs un bug (`logInfo` non défini dans `login()`)
et ne fait au final que stocker l'état de connexion en mémoire — il n'y a pas
encore de vraie zone admin derrière. Ce login semble être une intention de
départ (permettre à Nathalie & Nathalie de modifier le contenu elles-mêmes)
jamais terminée.

**Recommandation immédiate, quelle que soit la suite choisie** : sortir les
identifiants de `data.json` (et donc de tout fichier public) — au minimum les
supprimer si ce login n'est pas utilisé, ou les déplacer vers une vraie
solution d'auth si vous voulez le finir. Je n'ai rien supprimé sans vous le
demander, mais c'est à traiter en priorité.

## Les options, du plus simple au plus outillé

### A — CMS Git, on garde des fichiers (recommandé)

Un petit outil (Decap CMS, ou son fork actif Sveltia CMS — gratuits, open
source) ajoute une page `/admin` avec un formulaire simple : "ajouter une
création", "ajouter une date de représentation". Chaque sauvegarde crée un
commit sur `data.json` (ou des fichiers de contenu équivalents) directement
sur GitHub ; Vercel redéploie automatiquement (30s-1min) et le site est à
jour.

- Coût : 0€, aucune base de données à gérer.
- Le site reste 100% statique, exactement dans l'esprit actuel (pas de build,
  pas de framework).
- Nathalie & Nathalie éditent via un formulaire, sans toucher au code ni au
  JSON à la main.
- Historique complet et sauvegardes gratuites (c'est juste des commits Git).
- Limite : légère install initiale (une page `/admin` + une petite fonction
  serverless pour l'authentification GitHub), et un court délai (le temps du
  redéploiement) après chaque modification — pas de mise à jour instantanée.

### B — Vraie base de données + petite API (Vercel Postgres/KV)

On construit ce que `login.html` esquissait : une vraie authentification
(mot de passe haché, session), une base (Vercel Postgres via Neon, ou Vercel
KV) et des fonctions serverless (`/api/...`) pour lire/écrire les créations et
événements. Les changements sont instantanés, sans redéploiement.

- Corrige proprement le problème de sécurité (plus de mot de passe en clair).
- Ouvre la porte à des fonctionnalités futures (espace membre, réservations,
  formulaire de contact stocké, etc.).
- Limite : plus de pièces mobiles à maintenir (variables d'environnement,
  API, gestion des sessions) pour un site dont le contenu change en réalité
  très peu de fois par an — c'est probablement plus d'outillage que ce dont
  vous avez besoin aujourd'hui, sauf si vous avez d'autres projets pour cet
  espace admin.

### C — CMS externe (Sanity.io, gratuit à ce volume)

Un studio d'édition très abouti (glisser-déposer d'images, aperçu en direct),
hébergé par Sanity, gratuit sur le plan actuel. Le site va chercher le
contenu via une petite requête. Meilleure expérience d'édition des trois,
mais ajoute une dépendance à un service tiers (gratuit, mais externe).

## Sur la structure/l'outillage du projet

Vous demandiez aussi si changer de structure ou d'outil serait plus cohérent.
Mon avis : **non, pas de passage à un framework (Next.js, etc.)**. Le site
actuel — HTML/CSS/JS sans étape de build — colle exactement à ce que Vercel
fait le mieux en zéro-configuration, il est rapide, et il n'y a aucune
dépendance à maintenir. Passer à un framework ajouterait du `npm install`,
une étape de build, et des connaissances React à avoir pour la moindre
modification, sans bénéfice réel vu le volume de contenu du site. La seule
brique technique que je recommande d'ajouter est ciblée : une page `/admin`
et éventuellement une fonction serverless — les deux s'intègrent très bien
dans le projet actuel sans le transformer.

## Ma recommandation

Option **A** : elle règle le vrai besoin (Nathalie & Nathalie ajoutent une
date ou un spectacle sans toucher au code), coûte 0€, et ne complexifie pas
un projet qui n'en a pas besoin. L'option B devient pertinente seulement si
vous envisagez d'autres usages pour l'espace admin (réservations, espace
client...). L'option C est un bon compromis si le confort d'édition des
images compte plus que de tout garder "maison".

Je n'ai encore rien implémenté côté données — je préfère qu'on choisisse la
direction ensemble avant de toucher à l'authentification ou à la structure du
contenu.
