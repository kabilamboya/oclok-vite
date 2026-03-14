import mediaData from '../data/media.json';

/**
 * O!clok Media Service
 * Handles media content (videos and blogs) operations
 */

const mediaService = {
  /**
   * Get all media items
   * @returns {Array} All media items
   */
  getAll() {
    return mediaData;
  },

  /**
   * Get all videos
   * @returns {Array} All video items
   */
  getVideos() {
    return mediaData.filter(item => item.type === 'video');
  },

  /**
   * Get all blogs
   * @returns {Array} All blog items
   */
  getBlogs() {
    return mediaData.filter(item => item.type === 'blog');
  },

  /**
   * Get videos filtered by type (live, recorded, commissioned)
   * @param {string} videoType - Type of video: 'live', 'recorded', or 'commissioned'
   * @returns {Array} Filtered video items
   */
  getVideosByType(videoType) {
    return mediaData.filter(
      item => item.type === 'video' && item.videoType === videoType
    );
  },

  /**
   * Get a media item by ID
   * @param {number} id - Media item ID
   * @returns {Object|null} Media item or null if not found
   */
  getById(id) {
    return mediaData.find(item => item.id === id) || null;
  },

  /**
   * Search media by title, description, or tags
   * @param {string} query - Search query
   * @returns {Array} Search results
   */
  search(query) {
    const lowerQuery = query.toLowerCase();
    return mediaData.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(lowerQuery);
      const matchDescription = item.description.toLowerCase().includes(lowerQuery);
      const matchTags = item.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
      const matchAuthor = item.author?.toLowerCase().includes(lowerQuery);
      return matchTitle || matchDescription || matchTags || matchAuthor;
    });
  },

  /**
   * Get media filtered by category (for blogs)
   * @param {string} category - Category name
   * @returns {Array} Filtered items
   */
  filterByCategory(category) {
    return mediaData.filter(item => item.category === category);
  },

  /**
   * Get media sorted by date (newest first)
   * @param {Array} items - Items to sort (default: all)
   * @returns {Array} Sorted items
   */
  sortByNewest(items = mediaData) {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.publishedDate);
      const dateB = new Date(b.publishedDate);
      return dateB - dateA;
    });
  },

  /**
   * Get featured/latest media items
   * @param {number} limit - Number of items to return (default: 3)
   * @returns {Array} Featured items
   */
  getFeatured(limit = 3) {
    return this.sortByNewest().slice(0, limit);
  },

  /**
   * Get related media items based on tags
   * @param {number} itemId - Reference item ID
   * @param {number} limit - Number of related items (default: 5)
   * @returns {Array} Related items
   */
  getRelated(itemId, limit = 5) {
    const item = this.getById(itemId);
    if (!item) return [];

    return mediaData
      .filter(
        m =>
          m.id !== itemId &&
          m.type === item.type &&
          m.tags?.some(tag => item.tags?.includes(tag))
      )
      .slice(0, limit);
  },

  /**
   * Get unique categories (for blogs)
   * @returns {Array} Array of category names
   */
  getCategories() {
    const categories = Set();
    mediaData.forEach(item => {
      if (item.category) categories.add(item.category);
    });
    return Array.from(categories);
  },

  /**
   * Get unique video types
   * @returns {Array} Array of video type names
   */
  getVideoTypes() {
    const types = new Set();
    mediaData.forEach(item => {
      if (item.type === 'video' && item.videoType) {
        types.add(item.videoType);
      }
    });
    return Array.from(types);
  },

  /**
   * Cache recent views in localStorage
   * @param {number} itemId - Media item ID
   */
  addRecentView(itemId) {
    const recent = JSON.parse(localStorage.getItem('mediaRecentViews') || '[]');
    const filtered = recent.filter(id => id !== itemId);
    filtered.unshift(itemId);
    localStorage.setItem('mediaRecentViews', JSON.stringify(filtered.slice(0, 10)));
  },

  /**
   * Get recent views from localStorage
   * @returns {Array} Recent media items
   */
  getRecentViews() {
    const recent = JSON.parse(localStorage.getItem('mediaRecentViews') || '[]');
    return recent.map(id => this.getById(id)).filter(Boolean);
  }
};

export default mediaService;
