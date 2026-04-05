<template>
  <div class="shapes-library">
    <div class="shapes-grid">
      <button 
        v-for="shape in shapes"
        :key="shape.id"
        :class="['shape-btn', { active: selectedShape === shape.id }]"
        @click="selectShape(shape)"
        :title="shape.label"
      >
        <span class="shape-icon">{{ shape.icon }}</span>
        <span class="shape-label">{{ shape.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  shapes: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['shape-selected'])

const selectedShape = ref(null)

const selectShape = (shape) => {
  selectedShape.value = shape.id
  emit('shape-selected', shape)
}
</script>

<style scoped>
.shapes-library {
  width: 100%;
}

.shapes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.shape-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #0d0d0d;
  border: 2px solid #333;
  border-radius: 6px;
  color: #d0d0d0;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.shape-btn:hover {
  background: #1a1a1a;
  border-color: #ffd600;
  color: #ffd600;
}

.shape-btn.active {
  background: #ffd600;
  border-color: #ffd600;
  color: #000;
}

.shape-icon {
  font-size: 1.8rem;
  line-height: 1;
}

.shape-label {
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.3px;
}
</style>
