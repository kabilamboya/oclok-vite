<template>
  <div class="color-picker">
    <label class="color-label">
      <span class="label-text">{{ label }}</span>
      <div class="color-input-wrapper">
        <div class="color-preview" :style="{ backgroundColor: modelValue }"></div>
        <input 
          type="color" 
          :value="modelValue" 
          @input="$emit('update:modelValue', $event.target.value)"
          class="color-input"
        >
      </div>
    </label>
    
    <div v-if="presets && presets.length" class="presets">
      <button 
        v-for="(preset, idx) in presets"
        :key="idx"
        :style="{ backgroundColor: preset }"
        :class="['preset-btn', { active: preset === modelValue }]"
        @click="$emit('update:modelValue', preset)"
        :title="preset"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  presets: {
    type: Array,
    default: null
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.color-picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  user-select: none;
}

.label-text {
  font-size: 0.9rem;
  color: #d0d0d0;
  font-weight: 500;
}

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #0d0d0d;
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #333;
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #444;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-preview:hover {
  border-color: #666;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
}

.color-input {
  width: 60px;
  height: 32px;
  border: 1px solid #333;
  border-radius: 4px;
  cursor: pointer;
}

.presets {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preset-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-btn:hover {
  transform: scale(1.1);
  border-color: #fff;
}

.preset-btn.active {
  border-color: #fff;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
</style>
