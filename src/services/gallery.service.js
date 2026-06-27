import galleryData from '../data/gallery.json';

const normalizeGalleryItems = (items = []) =>
  (Array.isArray(items) ? items : []).map((item) => ({
    ...item,
    id: item.id ?? item.name ?? item.title,
    category: item.category || 'General',
    title: item.title || item.name || 'Untitled item',
    image: item.image || item.url || '',
  }));

const galleryService = {
  getAll() {
    return normalizeGalleryItems(galleryData);
  },

  getByCategory(category) {
    return this.getAll().filter((item) => item.category === category);
  },

  getById(id) {
    return this.getAll().find((item) => String(item.id) === String(id)) || null;
  },

  search(query = '') {
    const normalizedQuery = String(query).trim().toLowerCase();
    if (!normalizedQuery) return this.getAll();

    return this.getAll().filter((item) => {
      const haystack = [item.title, item.category, item.description].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  },
};

export default galleryService;
