<script setup>
import { ref, computed } from 'vue'
import places from '../data/places.json'
import PlaceCard from '../components/PlaceCard.vue'

const search = ref('')

const filtered = computed(() =>
  places.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
</script>

<template>
  <div class="container">
    <h1>Discover Kisumu</h1>
    <p>Hidden gems, honest reviews & easy rides</p>

    <input
      v-model="search"
      placeholder="Search places..."
      class="search"
    />

    <div class="grid">
      <PlaceCard
        v-for="place in filtered"
        :key="place.id"
        :place="place"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 24px;
}
.search {
  width: 100%;
  padding: 12px;
  margin: 16px 0;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
</style>
