<template>
  <div class="media-page">
    <!-- Page Header -->
    <header class="media-header">
      <h1>Media</h1>
      <p>
        Explore our tech podcasts, blogs, and digital media services.
        We blend storytelling with technology to amplify your voice.
        Stay connected, informed, and inspired with O!clok Media.
      </p>
    </header>

    <!-- YouTube Channel Embed -->
    <section class="youtube-section">
      <h2>Kenya Youth Channel</h2>
      <div class="youtube-wrapper">
        <iframe src="https://www.youtube.com/embed/W6TjHvjClQQ?si=quZiUjxdpKQUB4JW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>
    </section>

    <!-- Media Content Section -->
    <section class="media-content">
      <div v-for="item in mediaItems" :key="item.id" class="media-item">
        <img :src="item.image" :alt="item.title" />
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
        <a :href="item.link" target="_blank" class="cta-button">View</a>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue';


// Example media items data
const mediaItems = ref([
  {
    id: 1,
    title: 'O!clok Podcast Episode 1',
    description: 'Discussing technology trends in Africa.',
    image: '/images/BiGmage.jpg',
    link: 'https://example.com/podcast1',
  },
  {
    id: 2,
    title: 'O!clok Video Interview',
    description: 'Insights from industry leaders.',
    image: '/images/dgtl.jpg',
    link: 'https://example.com/video1',
  },
  {
    id: 3,
    title: 'O!clok Blog Post',
    description: 'Latest updates in tech and media.',
    image: '/images/ROBOto.jpg',
    link: 'https://example.com/blog1',
  },
]);
</script>

<style scoped>
.youtube-section {
  margin-bottom: 3rem;
  text-align: center;
}

.youtube-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.youtube-wrapper {
  position: relative;
  max-width: 500px; /* 👉 reduce this number to scale more */
  margin: 0 auto;
  padding-bottom: 56.25%; /* 16:9 ratio */
  height: 0;
}

.youtube-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.media-page {
  font-family: Arial, sans-serif;
  padding: 2rem;
}

.media-header {
  text-align: center;
  margin-bottom: 2rem;
}

.media-header h1 {
  font-size: 2.5rem;
  color: #333;
}

.media-header p {
  font-size: 1.2rem;
  color: #666;
}

.media-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.media-item {
  background-color: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.media-item img {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.media-item h2 {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.media-item p {
  font-size: 0.9rem;
  color: #555;
}

.cta-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: orange;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: darkorange;
}

</style>
