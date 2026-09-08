import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Les Plumes de Sons',

  // Rempli automatiquement depuis .env (voir .env.example) une fois le
  // projet créé sur sanity.io/manage.
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'REMPLACER_PAR_VOTRE_PROJECT_ID',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
