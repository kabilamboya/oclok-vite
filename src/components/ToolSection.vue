<template>
  <section class="tool-section" :class="{ 'tool-section--compact': compact }">
    <div v-if="title" class="tool-section__header">
      <h3>{{ title }}</h3>
      <slot name="header-actions" />
    </div>

    <div class="tool-content">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ""
  },
  compact: {
    type: Boolean,
    default: false
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

.tool-section--compact {
  padding: 0.8rem 1rem;
}

.tool-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
}

.tool-section h3 {
  margin: 0;
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
