export default {
  name: 'event',
  title: 'Représentation à venir',
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
      rows: 2,
    },
    {
      name: 'jourMois',
      title: 'Jour et mois',
      type: 'string',
      description: 'Format libre affiché tel quel sur le site, ex : "19 nov" ou "03 dec."',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'lieu',
      title: 'Lieu',
      type: 'string',
    },
    {
      name: 'heure',
      title: 'Heure',
      type: 'string',
      description: 'Ex : "10h" ou "9h30"',
    },
    {
      name: 'link',
      title: 'Page du spectacle liée',
      type: 'string',
      description: 'Nom du fichier .html vers lequel pointe le bouton "voir details" (ex : "oemm.html").',
    },
    {
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      description: 'Les événements sont affichés du plus petit au plus grand numéro.',
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
    select: {title: 'title', subtitle: 'jourMois'},
  },
}
