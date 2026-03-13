<template>
  <aside class="left-sidebar">
    <h3>Tools</h3>

    <button @click="$emit('addText')" aria-label="Add text" title="Add text">
      <i class="fas fa-font"></i>
      <span class="tool-label">Add Text</span>
    </button>

    <button @click="$emit('addShape', 'rect')" aria-label="Add rectangle" title="Add rectangle">
      <i class="fas fa-square"></i>
      <span class="tool-label">Rectangle</span>
    </button>

    <button @click="$emit('addShape', 'circle')" aria-label="Add circle" title="Add circle">
      <i class="fas fa-circle"></i>
      <span class="tool-label">Circle</span>
    </button>

    <button @click="$emit('addImage')" aria-label="Add image" title="Add image">
      <i class="fas fa-image"></i>
      <span class="tool-label">Image</span>
    </button>
  </aside>
</template>

<script setup>
</script>

<style scoped>
.left-sidebar {
  width: 64px;
  background: #161616;
  border-right: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.7rem;
  align-items: center;
}

.left-sidebar h3 {
  margin-bottom: 0.2rem;
  color: #ffd600;
  font-size: 0.85rem;
}

.left-sidebar button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffd600;
  border-radius: 10px;
  background: transparent;
  color: #ffffff;
  width: 42px;
  height: 42px;
  padding: 0;
  cursor: pointer;
  font-weight: 600;
}

.left-sidebar button:hover {
  background: rgba(255, 214, 0, 0.15);
}

.tool-label {
  display: none;
}
</style>
