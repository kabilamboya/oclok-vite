<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import places from '../data/places.json'

const route = useRoute()
const router = useRouter()

const place = computed(() =>
  places.find(p => p.slug === route.params.slug)
)

const galleryImages = computed(() => {
  if (!place.value) return []
  if (Array.isArray(place.value.images) && place.value.images.length) {
    return place.value.images
  }
  return place.value.image ? [place.value.image] : []
})

// Safety net
if (!place.value) {
  router.replace('/discover')
}

// Carousel state
const currentIndex = ref(0)

function nextImage() {
  if (galleryImages.value.length) {
    currentIndex.value = (currentIndex.value + 1) % galleryImages.value.length
  }
}

function prevImage() {
  if (galleryImages.value.length) {
    currentIndex.value =
      (currentIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
  }
}

// Booking function
function bookService(type) {
  alert(`Booking ${type} for ${place.value.name}`)
}
</script>

<template>
  <section v-if="place" class="details">
    <button class="back" @click="router.back()">← Back</button>

    <h1>{{ place.name }}</h1>
    <p class="location">{{ place.location }}</p>

        <!-- Carousel -->
    <div class="carousel" v-if="galleryImages.length">
      <button
        v-if="galleryImages.length > 1"
        class="nav prev"
        @click="prevImage"
      >
        &lsaquo;
      </button>
      <img :src="galleryImages[currentIndex]" :alt="place.name" />
      <button
        v-if="galleryImages.length > 1"
        class="nav next"
        @click="nextImage"
      >
        &rsaquo;
      </button>
      <div class="dots">
        <span
          v-for="(img, index) in galleryImages"
          :key="index"
          :class="{ active: index === currentIndex }"
          @click="currentIndex = index"
        ></span>
      </div>
    </div>

    <p class="description">{{ place.description }}</p>

    <div class="meta">
      <span>⭐ {{ place.rating }}</span>
      <span>🍽 {{ place.category }}</span>
    </div>

    <!-- Booking Options -->
    <div class="booking">
      <h2>Book Services</h2>
      <div class="buttons">
        <button @click="bookService('Driver')">🚗 Book Driver</button>
        <button @click="bookService('Tour Guide')">🧭 Book Tour Guide</button>
        <button @click="bookService('Airbnb')">🏠 Book Airbnb</button>
        <button @click="bookService('Itinerary Agent')">📋 Manage Itinerary</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.details {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
}
.back {
  margin-bottom: 1rem;
  background: none;
  border: none;
  color: #facc15;
  cursor: pointer;
  font-weight: 600;
}
.location {
  opacity: 0.8;
}
.meta {
  display: flex;
  gap: 1rem;
  font-weight: 600;
  margin-top: 1rem;
}

/* Carousel Styles */
.carousel {
  position: relative;
  width: 100%;
  margin: 1.5rem 0;
}
.carousel img {
  width: 100%;
  height: clamp(220px, 40vw, 420px);
  object-fit: cover;
  border-radius: 12px;
}
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  border: none;
  font-size: 2rem;
  padding: 0 0.6rem;
  cursor: pointer;
  border-radius: 6px;
}
.nav.prev {
  left: 10px;
}
.nav.next {
  right: 10px;
}
.dots {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  gap: 0.5rem;
}
.dots span {
  width: 10px;
  height: 10px;
  background: #ccc;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
}
.dots span.active {
  background: #facc15;
}

/* Booking */
.booking {
  margin-top: 2rem;
}
.booking h2 {
  margin-bottom: 1rem;
  font-size: 1.3rem;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.buttons button {
  background: #facc15;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}
.buttons button:hover {
  transform: scale(1.05);
}
</style>
