<template>
  <section class="hero" aria-hidden="false">
      <div class="hero-text">
        <h1>Stories that makes you wanna live some more!</h1>
        <p>Tell It or Tell Us!</p>
      </div>
  </section>
  <div class="media-page">
    <header class="media-header">
      <section class="youtube-section">
        <h2>Kenya Youth Channel</h2>
        <div class="youtube-wrapper">
          <iframe
            src="https://www.youtube.com/embed/W6TjHvjClQQ?si=quZiUjxdpKQUB4JW"
            title="O!clok Media video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </section>

      <section class="media-intro">
        <h1>Media</h1>
        <p>
          Explore our tech podcasts, blogs, and digital media services.
          We blend storytelling with technology to amplify your voice.
          Stay connected, informed, and inspired with O!clok Media.
        </p>
        <a
          href="https://www.youtube.com/watch?v=W6TjHvjClQQ"
          target="_blank"
          rel="noopener noreferrer"
          class="watch-button"
        >
          Watch on YouTube
        </a>
      </section>
    </header>

    <section class="media-content">
      <div v-for="item in mediaItems" :key="item.id" class="media-item">
        <img :src="item.image" :alt="item.title" loading="lazy" />
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
        <a :href="item.link" target="_blank" rel="noopener noreferrer" class="cta-button">View</a>
      </div>
    </section>
  </div>
</template>

<script setup>
import bigImage from '../assets/images/BiGmage.jpg';
import digitalImage from '../assets/images/dgtl.jpg';
import robotImage from '../assets/images/ROBOto.jpg';

const mediaItems = [
  {
    id: 1,
    title: 'O!clok Podcast Episode 1',
    description: 'Discussing technology trends in Africa.',
    image: bigImage,
    link: 'https://www.youtube.com/@KenyaYouthChannel',
  },
  {
    id: 2,
    title: 'O!clok Video Interview',
    description: 'Insights from industry leaders.',
    image: digitalImage,
    link: 'https://www.youtube.com/watch?v=W6TjHvjClQQ',
  },
  {
    id: 3,
    title: 'O!clok Blog Post',
    description: 'Latest updates in tech and media.',
    image: robotImage,
    link: 'https://www.youtube.com/@KenyaYouthChannel',
  },
];
</script>

<style scoped>

/* Core resets & fonts – add Google Fonts or local if needed */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

.media-page {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); /* Dark gradient bg for modern media feel */
  color: #f1f5f9;
  min-height: 100vh;
  padding: 2rem 1rem;
}

.media-header {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 2rem;
  margin-bottom: 3rem;
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
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3); /* subtle glow */
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
  color: #cbd5e1;          /* lighter gray for readability on dark bg */
  margin: 0 0 1.5rem;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}

.watch-button,
.cta-button {
  display: inline-block;
  padding: 0.9rem 1.8rem;
  border-radius: 50px;               /* pill shape = modern youth */
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 0, 0.4);
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

.media-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.media-item {
  background: rgba(30, 41, 59, 0.8); /* semi-transparent dark card */
  border-radius: 16px;
  overflow: hidden;
  padding: 1.2rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(124, 58, 237, 0.2);
  backdrop-filter: blur(8px); /* glassmorphism trend – subtle modern */
}

.media-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(124, 58, 237, 0.3);
  border-color: #7c3aed;
}

.media-item img {
  max-width: 100%;
  border-radius: 12px;
  margin-bottom: 1rem;
  aspect-ratio: 16/9;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.media-item:hover img {
  transform: scale(1.05);
}

.media-item h2 {
  font-size: 1.4rem;
  margin: 0.5rem 0;
  color: #e0f2fe;
  font-weight: 700;
}

.media-item p {
  font-size: 1rem;
  color: #94a3b8;
  margin: 0 0 1rem;
}

/* Mobile adjustments */
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
}

</style>