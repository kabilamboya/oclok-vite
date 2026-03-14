<template>
  <section class="hero" aria-hidden="false">
    <div class="hero-text">
      <h1>Stories that makes you wanna live some more!</h1>
      <p>Tell It or Tell Us!</p>
    </div>
  </section>

  <div class="media-page">
    <!-- Featured Video Section -->
    <header class="media-header">
      <section class="youtube-section">
        <h2>Featured Content</h2>
        <div class="youtube-wrapper">
          <iframe
            :src="featuredVideo?.videoUrl"
            title="O!clok Media featured video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </section>

      <section class="media-intro">
        <h1>Media Hub</h1>
        <p>
          Explore our tech podcasts, blogs, and digital media services.
          We blend storytelling with technology to amplify your voice.
          Stay connected, informed, and inspired with O!clok Media.
        </p>
        <a
          :href="featuredVideo?.youtubeLink"
          target="_blank"
          rel="noopener noreferrer"
          class="watch-button"
        >
          Watch on YouTube
        </a>
      </section>
    </header>

    <!-- Videos Section with Tabs -->
    <section class="videos-section">
      <h2 class="section-title">VIDEO CONTENT</h2>
      
      <div class="video-tabs">
        <button
          v-for="tab in videoTabs"
          :key="tab"
          @click="selectedVideoTab = tab"
          :class="['tab-button', { active: selectedVideoTab === tab }]"
        >
          {{ capitalizeTab(tab) }}
        </button>
      </div>

      <div class="video-grid">
        <div v-if="filteredVideos.length === 0" class="empty-state">
          <p>No {{ selectedVideoTab }} videos available yet.</p>
        </div>
        <div v-for="video in filteredVideos" :key="video.id" class="video-card">
          <div class="video-image-wrapper">
            <img :src="video.image" :alt="video.title" loading="lazy" />
            <div class="video-badge">{{ capitalizeTab(video.videoType) }}</div>
            <div class="video-duration">{{ video.duration }}</div>
          </div>
          <div class="video-content">
            <h3>{{ video.title }}</h3>
            <p class="video-description">{{ video.description }}</p>
            <div class="video-meta">
              <span class="creator">👤 {{ video.creator }}</span>
              <span class="date">📅 {{ formatDate(video.publishedDate) }}</span>
            </div>
            <div class="video-tags">
              <span v-for="tag in video.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <a
              :href="video.youtubeLink"
              target="_blank"
              rel="noopener noreferrer"
              class="cta-button"
            >
              Watch Now
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Blogs Section -->
    <section class="blogs-section">
      <h2 class="section-title">BLOG ARTICLES</h2>

      <div v-if="blogs.length === 0" class="empty-state">
        <p>No blog articles available yet.</p>
      </div>

      <div v-for="blog in blogs" :key="blog.id" class="blog-article">
        <div class="blog-header">
          <img :src="blog.image" :alt="blog.title" class="blog-image" loading="lazy" />
          <div class="blog-header-content">
            <div class="blog-meta-header">
              <span class="blog-category">{{ blog.category }}</span>
              <span class="blog-date">{{ formatDate(blog.publishedDate) }}</span>
            </div>
            <h2 class="blog-title">{{ blog.title }}</h2>
            <p class="blog-excerpt">{{ blog.description }}</p>
            <div class="blog-author-info">
              <span class="author">✍️ {{ blog.author }}</span>
              <span class="read-time">⏱️ {{ blog.readTime }}</span>
            </div>
          </div>
        </div>

        <div class="blog-body">
          <p v-for="(paragraph, idx) in blog.content.split('\n')" :key="idx" class="blog-paragraph">
            {{ paragraph }}
          </p>
        </div>

        <div class="blog-tags">
          <span v-for="tag in blog.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import mediaService from '../services/media.service';

// State
const selectedVideoTab = ref('recorded');
const videos = ref([]);
const blogs = ref([]);
const videoTabs = ['live', 'recorded', 'commissioned'];

// Computed
const filteredVideos = computed(() => {
  return mediaService.getVideosByType(selectedVideoTab.value);
});

const featuredVideo = computed(() => {
  const featured = mediaService.getFeatured(1);
  return featured[0] || videos.value[0];
});

// Methods
const capitalizeTab = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Lifecycle
onMounted(() => {
  videos.value = mediaService.getVideos();
  blogs.value = mediaService.getBlogs();
});
</script>

<style scoped>

/* Core resets & fonts – add Google Fonts or local if needed */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

.media-page {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f1f5f9;
  min-height: 100vh;
  padding: 2rem 1rem;
}

/* ===== FEATURED SECTION ===== */
.media-header {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 2rem;
  margin-bottom: 4rem;
  align-items: center;
}

.youtube-section h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 1rem;
  background: linear-gradient(90deg, #7c3aed, #ff6b00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.youtube-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
}

.youtube-wrapper iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  border-radius: 16px;
}

.media-intro h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 1rem;
  background: linear-gradient(90deg, #ff6b00, #39ff14);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.media-intro p {
  font-size: 1.25rem;
  color: #cbd5e1;
  margin: 0 0 1.5rem;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}

.watch-button,
.cta-button {
  display: inline-block;
  padding: 0.9rem 1.8rem;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 0, 0.4);
  border: none;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
}

.watch-button {
  background: linear-gradient(90deg, #ff6b00, #ff4500);
  color: white;
}

.watch-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 107, 0, 0.6);
  background: linear-gradient(90deg, #ff4500, #ff6b00);
}

.cta-button {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: white;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(124, 58, 237, 0.5);
}

/* ===== VIDEOS SECTION ===== */
.videos-section {
  margin-bottom: 5rem;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 2rem;
  background: linear-gradient(90deg, #7c3aed, #ff6b00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.video-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab-button {
  padding: 0.8rem 1.6rem;
  border-radius: 50px;
  border: 2px solid rgba(124, 58, 237, 0.3);
  background: transparent;
  color: #cbd5e1;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  text-transform: capitalize;
}

.tab-button:hover {
  border-color: #7c3aed;
  color: #7c3aed;
}

.tab-button.active {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.video-card {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(124, 58, 237, 0.2);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
}

.video-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(124, 58, 237, 0.3);
  border-color: #7c3aed;
}

.video-image-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16/9;
  background: rgba(15, 23, 42, 0.8);
}

.video-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.video-card:hover .video-image-wrapper img {
  transform: scale(1.05);
}

.video-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 107, 0, 0.9);
  color: white;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.video-duration {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.video-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.video-content h3 {
  font-size: 1.3rem;
  margin: 0 0 0.8rem;
  color: #e0f2fe;
  font-weight: 700;
}

.video-description {
  font-size: 0.95rem;
  color: #94a3b8;
  margin: 0 0 1rem;
  line-height: 1.5;
}

.video-meta {
  display: flex;
  gap: 1rem;
  margin: 0.8rem 0;
  font-size: 0.85rem;
  color: #cbd5e1;
}

.creator, .date {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.video-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.tag {
  background: rgba(124, 58, 237, 0.2);
  color: #a78bfa;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.video-content .cta-button {
  margin-top: auto;
  align-self: flex-start;
  padding: 0.7rem 1.5rem;
  font-size: 0.9rem;
}

/* ===== BLOGS SECTION ===== */
.blogs-section {
  margin-bottom: 3rem;
}

.blog-article {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 3rem;
  border: 1px solid rgba(124, 58, 237, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.blog-article:hover {
  border-color: #7c3aed;
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.2);
}

.blog-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  padding: 2rem;
  align-items: center;
}

.blog-image {
  width: 100%;
  border-radius: 12px;
  aspect-ratio: 4/3;
  object-fit: cover;
}

.blog-header-content {
  display: flex;
  flex-direction: column;
}

.blog-meta-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.8rem;
  font-size: 0.85rem;
}

.blog-category {
  background: rgba(124, 58, 237, 0.3);
  color: #a78bfa;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.blog-date {
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.blog-title {
  font-size: 1.8rem;
  margin: 0 0 0.8rem;
  color: #e0f2fe;
  font-weight: 800;
  line-height: 1.3;
}

.blog-excerpt {
  font-size: 1rem;
  color: #cbd5e1;
  margin: 0 0 1rem;
  line-height: 1.6;
}

.blog-author-info {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #94a3b8;
}

.author {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.read-time {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.blog-body {
  padding: 0 2rem 2rem;
}

.blog-paragraph {
  font-size: 1rem;
  color: #cbd5e1;
  margin: 0 0 1.5rem;
  line-height: 1.8;
  font-family: 'Inter', sans-serif;
}

.blog-paragraph:last-child {
  margin-bottom: 0;
}

.blog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 2rem 2rem;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  font-size: 1.1rem;
}

/* ===== MOBILE ADJUSTMENTS ===== */
@media (max-width: 980px) {
  .media-header {
    grid-template-columns: 1fr;
  }

  .media-intro {
    text-align: center;
  }

  .media-intro h1 {
    font-size: 2.8rem;
  }

  .blog-header {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }

  .blog-image {
    width: 100%;
  }

  .video-tabs {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .media-page {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.6rem;
  }

  .media-intro h1 {
    font-size: 2rem;
  }

  .media-intro p {
    font-size: 1rem;
  }

  .video-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .blog-header {
    padding: 1rem;
    gap: 1rem;
  }

  .blog-title {
    font-size: 1.4rem;
  }

  .blog-body,
  .blog-tags {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .tab-button {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }
}

</style>