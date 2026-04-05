<template>
  <div class="control-slider">
    <label class="slider-label">
      <span class="label-text">{{ label }}</span>
      <span class="value-display">{{ modelValue }}</span>
    </label>
    <div class="slider-container">
      <input 
        type="range" 
        :min="min" 
        :max="max" 
        :value="modelValue"
        @input="$emit('update:modelValue', Number($event.target.value))"
        class="slider"
      >
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.control-slider {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.slider-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #d0d0d0;
  font-weight: 500;
}

.value-display {
  background: #0d0d0d;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  border: 1px solid #333;
  font-family: 'Monaco', 'Courier New', monospace;
  color: #ffd600;
  font-weight: 600;
  min-width: 50px;
  text-align: center;
}

.slider-container {
  width: 100%;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, #333, #555);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd600, #ff9500);
  cursor: pointer;
  border: 2px solid #0d0d0d;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(255, 214, 0, 0.3);
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 2px 12px rgba(255, 214, 0, 0.5);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd600, #ff9500);
  cursor: pointer;
  border: 2px solid #0d0d0d;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(255, 214, 0, 0.3);
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 2px 12px rgba(255, 214, 0, 0.5);
}

.slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  background: inherit;
  border-radius: 3px;
}

.slider::-moz-range-track {
  background: transparent;
  border: none;
}
</style>
