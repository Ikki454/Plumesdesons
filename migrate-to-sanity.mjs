// Script à lancer UNE SEULE FOIS, après avoir créé le projet Sanity, pour
// importer le contenu existant de data.json (créations + événements).
//
// Utilisation :
//   1. cd studio && npm install
//   2. cd .. (retour à la racine du site)
//   3. SANITY_STUDIO_PROJECT_ID=xxxx SANITY_WRITE_TOKEN=xxxx node migrate-to-sanity.mjs
//
// Le token s'obtient sur sanity.io/manage → votre projet → API → Tokens →
// "Add API token" avec les droits "Editor". Il ne sert qu'à cette migration
// unique, vous pouvez le supprimer ensuite.
//
// Les images ne sont pas importées automatiquement (upload binaire, plus
// simple à faire à la main) : après l'import, ouvrez le Studio et glissez les
// 2-3 images correspondantes sur chaque création.

import {createClient} from '@sanity/client'
import fs from 'node:fs'
import {fileURLToPath} from 'node:url'
import path from 'node:path'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !token) {
  console.error(
    'Définissez SANITY_STUDIO_PROJECT_ID et SANITY_WRITE_TOKEN avant de lancer ce script (voir les commentaires en haut du fichier).'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8'))

async function run() {
  for (const [i, c] of data.creations.entries()) {
    const doc = await client.create({
      _type: 'creation',
      title: c.title,
      description: c.description,
      imageAlt: c.image_alt,
      annee: c.annee,
      type: c.type,
      link: c.link,
      order: i,
    })
    console.log('Création importée :', c.title, '→', doc._id)
  }

  for (const [i, e] of data.events.entries()) {
    const doc = await client.create({
      _type: 'event',
      title: e.title,
      description: e.description,
      jourMois: e.jour_mois,
      lieu: e.lieu,
      heure: e.heure,
      link: e.link,
      order: i,
    })
    console.log('Événement importé :', e.title, '→', doc._id)
  }

  console.log('\nImport terminé.')
  console.log('Prochaine étape : ouvrez le Studio et ajoutez les images sur chaque création.')
}

run().catch((err) => {
  console.error("Échec de l'import :", err)
  process.exit(1)
})
