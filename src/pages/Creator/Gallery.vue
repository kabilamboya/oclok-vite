<template>
  <RteLayout :zoom="zoom">
    <template #toolbar>
      <CreatorToolbar
        :initial-zoom="zoom"
        current-page="gallery"
        @zoom-change="handleZoomChange"
      />
    </template>

    <template #main>
      <section class="gallery-page">
        <div class="header">
          <h2>Branding Gallery</h2>
          <p>Published mockups and approved outputs for campaigns.</p>
          <button @click="loadGallery" :disabled="loading">{{ loading ? 'Loading...' : 'Refresh' }}</button>
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <div class="gallery-grid">
          <article v-for="item in gallery" :key="item.id" class="gallery-item">
            <img :src="item.url" :alt="item.name" />
            <div class="caption">
              <h4>{{ item.name }}</h4>
              <p>{{ item.category || 'general' }}</p>
              <small>Status: {{ item.status }}</small>
            </div>
          </article>
          <p v-if="!loading && gallery.length === 0" class="empty">No approved mockups yet.</p>
        </div>
      </section>
    </template>
  </RteLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import CreatorToolbar from '@/components/TopToolbar.vue';
import RteLayout from '@/layouts/RteLayout.vue';
import { listCyberMockups } from '@/services/cyber.service';

const loading = ref(false);
const errorMessage = ref('');
const gallery = ref([]);
const zoom = ref(100);

const baseUrl = import.meta.env.BASE_URL || '/';
const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
const galleryBase = `${normalizedBase}gallery/`;

const toTitle = (filename = '') => {
  const base = filename.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
  return base.replace(/\b\w/g, (char) => char.toUpperCase());
};

const loadLocalGallery = async () => {
  try {
    const response = await fetch(`${galleryBase}manifest.json`, { cache: 'no-store' });
    if (!response.ok) return [];
    const files = await response.json();
    if (!Array.isArray(files)) return [];
    return files.map((file) => ({
      id: `gallery-${file}`,
      name: toTitle(file),
      category: 'Gallery',
      status: 'approved',
      url: `${galleryBase}${file}`,
    }));
  } catch {
    return [];
  }
};

const mergeGallery = (items = []) => {
  const merged = new Map();
  items.forEach((item) => {
    const key = item.url || item.id;
    merged.set(key, { ...item, id: item.id || key });
  });
  return Array.from(merged.values());
};

const loadGallery = async () => {
  loading.value = true;
  errorMessage.value = '';
  const localItems = await loadLocalGallery();

  try {
    const data = await listCyberMockups({ status: 'approved' });
    gallery.value = mergeGallery([...localItems, ...data]);
  } catch (error) {
    errorMessage.value = error.message || 'Unable to load gallery';
    gallery.value = mergeGallery(localItems);
  } finally {
    loading.value = false;
  }
};

const handleZoomChange = (newZoom) => {
  zoom.value = newZoom;
};

onMounted(loadGallery);
</script>

<style scoped>
.gallery-page {
  display: grid;
  gap: 1rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.header p {
  color: #9ca3af;
  margin: 0;
}

button {
  border: 1px solid #ffd600;
  color: #ffd600;
  border-radius: 8px;
  padding: 0.55rem 0.9rem;
  background: transparent;
  cursor: pointer;
  font-weight: 700;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.8rem;
}

.gallery-item {
  background: #111111;
  border: 1px solid #2e2e2e;
  border-radius: 10px;
  overflow: hidden;
}

.gallery-item img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.caption {
  padding: 0.7rem;
}

.caption p,
.caption small {
  color: #9ca3af;
}

.error {
  color: #fca5a5;
}

.empty {
  color: #9ca3af;
}
</style>
