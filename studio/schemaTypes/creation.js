export default {
  name: 'creation',
  title: 'Création (spectacle)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'imageAlt',
      title: "Texte alternatif de l'image",
      type: 'string',
      description: 'Décrit l\'image pour les lecteurs d\'écran (accessibilité).',
    },
    {
      name: 'annee',
      title: 'Année',
      type: 'number',
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      initialValue: 'spectacle musical',
    },
    {
      name: 'link',
      title: 'Page du spectacle',
      type: 'string',
      description:
        'Nom du fichier .html de la page dédiée (ex : "oemm.html"). Laisser vide ou mettre "#noscreations" si la page n\'existe pas encore.',
    },
    {
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      description: 'Les créations sont affichées du plus petit au plus grand numéro.',
    },
  ],
  orderings: [
    {
      title: "Ordre d'affichage",
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', media: 'image', subtitle: 'annee'},
  },
}
