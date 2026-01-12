<script setup>
defineProps({
  place: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <router-link
    :to="`/discover/${place.slug}`"
    class="card"
  >
    <img :src="place.image" :alt="place.name" />
    <div class="info">
      <h3>{{ place.name }}</h3>
      <p>{{ place.location }}</p>
    </div>
  </router-link>
</template>

<style scoped>
.card {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 12px;
  overflow: hidden;
  background: #020617;
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
}
img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.info {
  padding: 12px;
}
</style>
