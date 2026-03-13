<template>
  <div class="top-toolbar">
    <button @click="$emit('undo')" aria-label="Undo" title="Undo">
      <i class="fas fa-rotate-left"></i>
      <span class="tool-label">Undo</span>
    </button>
    <button @click="$emit('redo')" aria-label="Redo" title="Redo">
      <i class="fas fa-rotate-right"></i>
      <span class="tool-label">Redo</span>
    </button>
    <button @click="$emit('bold')" aria-label="Bold" title="Bold">
      <i class="fas fa-bold"></i>
      <span class="tool-label">Bold</span>
    </button>
    <button @click="$emit('italic')" aria-label="Italic" title="Italic">
      <i class="fas fa-italic"></i>
      <span class="tool-label">Italic</span>
    </button>
    <button @click="$emit('underline')" aria-label="Underline" title="Underline">
      <i class="fas fa-underline"></i>
      <span class="tool-label">Underline</span>
    </button>
  </div>
</template>

<script setup>
</script>

<style scoped>
.top-toolbar {
  height: 48px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #161616;
  border-bottom: 1px solid #2a2a2a;
  padding: 0 0.5rem;
}

.top-toolbar button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffd600;
  border-radius: 6px;
  background: transparent;
  color: #ffffff;
  width: 36px;
  height: 36px;
  padding: 0;
  cursor: pointer;
  font-weight: 600;
}

.top-toolbar button:hover {
  background: rgba(255, 214, 0, 0.15);
}

.tool-label {
  display: none;
}
</style>
