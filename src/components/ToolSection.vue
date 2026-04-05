<template>
  <div class="tool-section">
    <h3>{{ title }}</h3>
    <div class="tool-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.tool-section {
  padding: 1.2rem;
  background: #1a1a1a;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #2a2a2a;
}

.tool-section h3 {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
