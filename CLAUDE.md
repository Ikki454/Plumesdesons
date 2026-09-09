# Plumes de Sons — site web

Site vitrine statique pour **Les Plumes de Sons**, duo (Nathalie Chameau & Nathalie
Chaplin) qui crée des spectacles musicaux et sensoriels pour le très jeune public
(0-3 ans). Ce fichier oriente toute session Claude qui travaille dans ce dossier.

## Stack technique

- HTML / CSS / JS **vanilla**, aucun framework, aucun build step, aucune dépendance
  npm. Ne pas introduire de framework, bundler ou build tool sans demande explicite.
- Polices chargées via Google Fonts (`<link>` dans le `<head>` de chaque page).
- Le contenu (créations, événements) vit dans **Sanity** (voir la section dédiée
  plus bas) ; `data.json` reste comme filet de secours et n'a plus de rôle
  d'authentification. `script.js` génère dynamiquement la grille "Nos créations"
  et la liste "Représentations à venir" au chargement de `index.html`.

## Carte du dossier

| Fichier | Rôle |
|---|---|
| `index.html` / `index.css` | Page d'accueil (héros, bio, à propos, créations, actualité, événements) |
| `styles.css` | Styles partagés par toutes les pages : header, footer, typographie de base, boutons, `.img`, variables de marque (`:root`) |
| `nrl.html` / `nrl.css` | Page du spectacle "Noël au rythme des lutins" |
| `oemm.html` / `oemm.css` | Page du spectacle "Où est ma main" |
| `script.js` | Charge le contenu depuis **Sanity** (voir plus bas) et génère `.grid_container` (créations) et `.future_events_container` (événements). Retombe sur `data.json` tant que Sanity n'est pas configuré. |
| `data.json` | Contenu d'origine (créations, événements) — sert de filet de secours à `script.js`, plus la source de vérité une fois Sanity branché. Ne contient plus d'identifiants. |
| `studio/` | Sanity Studio (schémas `creation` et `event`) — l'espace d'édition du contenu, déployé sur `plumesdesons.sanity.studio` |
| `PROPOSITION-STOCKAGE-DONNEES.md` | Comparatif des options de stockage envisagées et pourquoi Sanity a été choisi |
| `images/`, `video/` | Médias du site |

`login.html`, `login.js` et `migrate-to-sanity.mjs` ont été supprimés du
projet (prototype d'admin non fonctionnel et script de migration à usage
unique, tous deux remplacés par le Sanity Studio ci-dessus).

`styles.css` est chargé sur **toutes** les pages avant la feuille de style
spécifique à la page — les variables et règles de base doivent donc y rester
génériques et sans dépendance à une page en particulier.

## Identité visuelle — "Duvet Sonore"

L'identité du site s'appuie sur la philosophie de design **Duvet Sonore** (voir
`affiche-duvet-sonore/duvet-sonore-design-philosophy.md` et l'affiche associée
dans le même dossier) : le son perçu comme quelque chose d'aussi doux et délicat
qu'une plume. Pour le web, cette philosophie est traduite en une palette chaude
et feutrée plutôt que la palette froide/violette d'origine, tout en gardant la
chaleur et la vivacité nécessaires à un site pour jeune public.

Jetons de marque définis dans `:root` (`styles.css`), à réutiliser partout au
lieu de couleurs codées en dur :

```css
--bone / --bone-deep / --cream-card / --header-bg   /* fonds chauds, neutres */
--ink / --ink-soft                                   /* texte */
--rose / --rose-deep / --rose-tint                    /* accent principal */
--moss / --moss-deep / --moss-tint                    /* accent secondaire */
--ochre / --ochre-deep / --ochre-tint                 /* accent tertiaire */
--shadow / --shadow-strong                             /* ombres chaudes (jamais noir pur) */
```

Typographie :
- Titres (`h1`, `h2`, `h3`) : **Instrument Serif** (élégant, chaleureux, littéraire —
  cohérent avec la planche "Duvet Sonore"). Cette police n'existe qu'en graisse
  400 : ne pas lui appliquer de `font-weight` fort (pas de faux gras).
  Le lien Google Fonts est déjà présent dans le `<head>` de chaque page publique.
- Texte courant : **Nunito** (déjà en place, chaleureuse et très lisible pour
  un site destiné aux familles — conservée telle quelle).

Trois couleurs d'accent (rose / ochre / moss) sont utilisées en rotation pour
distinguer visuellement les cartes (événements, statistiques, étiquettes) tout
en restant dans la même famille chromatique — éviter d'introduire une nouvelle
couleur hors de cette palette sans raison de marque.

## Contenu — Sanity CMS

Le contenu (créations, événements) est géré depuis un **Sanity Studio**
(dossier `studio/`), plutôt qu'en éditant `data.json` à la main. C'est ce qui
remplace l'ancien système `login.html`/`login.js` (prototype non fonctionnel,
identifiants en clair — supprimés de `data.json`, fichiers retirés du projet).

- Schémas : `studio/schemaTypes/creation.js` et `event.js`.
- Le site (`script.js`) lit le contenu public via l'API CDN de Sanity
  (`https://<projectId>.apicdn.sanity.io/...`), sans authentification requise
  côté site (dataset public en lecture).
- **État actuel : migration effectuée et Studio déployé.** Projet Sanity
  `0udv7977` (dataset `production`), `SANITY_PROJECT_ID` dans `script.js` et
  `studio/sanity.config.js` déjà renseigné, les 3 créations et 3 événements de
  `data.json` sont importés dans Sanity avec leurs images. Le site public lit
  désormais Sanity en premier et ne retombe sur `data.json` qu'en cas
  d'indisponibilité de Sanity.
- Studio déployé sur **https://plumesdesons.sanity.studio**.
- Édition du contenu au quotidien : Nathalie & Nathalie se connectent au
  Studio (https://plumesdesons.sanity.studio) avec un compte Sanity (à inviter
  depuis sanity.io/manage → Plumedesons → Members) — plus besoin du login
  maison. Pour republier le Studio après un changement de schéma :
  `cd studio && npm run deploy`.

## Règles pour les prochaines sessions

- **Ne jamais réécrire, raccourcir ou inventer le contenu visible** (textes,
  descriptions de spectacles, dates, lieux, coordonnées, `data.json`) sauf
  demande explicite de l'utilisateur. Les modifications par défaut portent sur
  la présentation (CSS), la structure technique ou le comportement — jamais sur
  le fond, sauf instruction claire.
- Garder les noms de classes/ids existants intacts : `script.js` s'appuie sur
  `.grid_container`, `.future_events_container`, `.event` + index, etc.
- Respecter les deux points de rupture responsive déjà en place : `1400px` et
  `768px`.
- `login.html`/`login.js` ont été retirés du projet (voir section Sanity CMS
  ci-dessus) — ne pas les recréer sans demande explicite.
