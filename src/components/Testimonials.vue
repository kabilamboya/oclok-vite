<!-- components/Testimonials.vue -->
<template>
  <section class="testimonials">
    <h2>What Our Clients Say</h2>
    <div class="testimonial-grid">
      <article v-for="(item, i) in items" :key="i">
        <p>"{{ item.message }}"</p>
        <strong>{{ item.name }}</strong>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true }
});
</script>
