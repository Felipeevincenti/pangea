function sortEntries(modules) {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => ({
      type: 'image',
      src: mod.default.src,
    }));
}

const ronnieImages = import.meta.glob('/src/media/ronnie/*.{jpg,jpeg,png,webp}', { eager: true });
const teRecuerdoImages = import.meta.glob('/src/media/te-recuerdo/*.{jpg,jpeg,png,webp}', { eager: true });

export const projects = [
  {
    slug: 'ronnie',
    title: 'Ronnie',
    tags: 'Branding | Ilustración',
    stories: sortEntries(ronnieImages),
  },
  {
    slug: 'te-recuerdo',
    title: 'Te Recuerdo',
    tags: 'Branding | Ilustración',
    stories: sortEntries(teRecuerdoImages),
  },
];
