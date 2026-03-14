<template>
  <div class="merged-toolbar">
    <!-- Left Section: Tools -->
    <div class="toolbar-left">
      <!-- Custom Tools -->
      <button
        v-for="tool in tools"
        :key="tool.id"
        :title="tool.title"
        class="toolbar-btn"
        :class="{ active: activeTool === tool.id }"
        @click="selectTool(tool.id)"
      >
        <i :class="tool.icon"></i>
        <span>{{ tool.label }}</span>
      </button>

      <!-- Separator -->
      <div class="toolbar-separator"></div>

      <!-- Delete Button -->
      <button 
        title="Delete selected element" 
        class="toolbar-btn delete-btn" 
        @click="deleteElement"
      >
        <i class="fas fa-trash"></i>
        <span>Delete</span>
      </button>
    </div>

    <!-- Center Section: Zoom Display -->
    <div class="toolbar-center">
      <span class="zoom-label">Zoom: {{ Math.round(zoom) }}%</span>
    </div>

    <!-- Right Section: Zoom Slider + Controls + Save -->
    <div class="toolbar-right">
      <button title="Zoom Out" class="toolbar-btn" @click="zoomOut">
        <i class="fas fa-minus"></i>
      </button>

      <input
        v-model.number="zoom"
        type="range"
        min="50"
        max="200"
        step="10"
        class="zoom-slider"
        aria-label="Zoom level"
      />

      <button title="Zoom In" class="toolbar-btn" @click="zoomIn">
        <i class="fas fa-plus"></i>
      </button>

      <button title="Fit to Screen" class="toolbar-btn" @click="resetZoom">
        <i class="fas fa-compress"></i>
      </button>

      <button
        title="Save Draft"
        class="toolbar-btn"
        :class="{ saving: isSavingDraft }"
        @click="saveDraft"
      >
        <i class="fas fa-save"></i>
        <span v-if="lastSaved">{{ lastSaved }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  initialZoom: { type: Number, default: 100 },
  editorContent: { type: String, default: '' },
  currentPage: { type: String, default: 'writer' }
});

const emit = defineEmits(['zoom-change', 'tool-selected', 'draft-saved', 'delete-element']);

const zoom = ref(props.initialZoom);
const activeTool = ref('select');
const isSavingDraft = ref(false);
const lastSaved = ref('');

const tools = [
  { id: 'select', label: 'Select', icon: 'fas fa-arrow-pointer', title: 'Selection Tool' },
  { id: 'text', label: 'Text', icon: 'fas fa-font', title: 'Add Text' },
  { id: 'shape', label: 'Shape', icon: 'fas fa-square', title: 'Add Shape' },
  { id: 'brush', label: 'Brush', icon: 'fas fa-pen', title: 'Draw/Brush' },
];

const selectTool = (toolId) => {
  activeTool.value = toolId;
  emit('tool-selected', toolId);
};

const deleteElement = () => {
  emit('delete-element');
};

const zoomIn = () => { if (zoom.value < 200) zoom.value = Math.min(zoom.value + 10, 200); };
const zoomOut = () => { if (zoom.value > 50) zoom.value = Math.max(zoom.value - 10, 50); };
const resetZoom = () => { zoom.value = 100; };

const saveDraft = () => {
  isSavingDraft.value = true;
  const draftData = { content: props.editorContent, page: props.currentPage, timestamp: new Date().toISOString(), zoom: zoom.value };
  localStorage.setItem(`creator_draft_${props.currentPage}`, JSON.stringify(draftData));
  const now = new Date();
  lastSaved.value = `Saved ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
  setTimeout(() => isSavingDraft.value = false, 1000);
  emit('draft-saved', draftData);
};

watch(zoom, (newZoom) => emit('zoom-change', newZoom));

let autoSaveInterval;
onMounted(() => {
  autoSaveInterval = setInterval(saveDraft, 30000);

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.deltaY < 0 ? zoomIn() : zoomOut();
    }
  };

  window.addEventListener('wheel', handleWheel, { passive: false });

  const savedDraft = localStorage.getItem(`creator_draft_${props.currentPage}`);
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft);
      const savedTime = new Date(draft.timestamp);
      lastSaved.value = `Last: ${savedTime.getHours()}:${String(savedTime.getMinutes()).padStart(2,'0')}`;
    } catch {}
  }

  return () => {
    window.removeEventListener('wheel', handleWheel);
    clearInterval(autoSaveInterval);
  };
});

onUnmounted(() => clearInterval(autoSaveInterval));
</script>

<style scoped>
.merged-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px;
  background: #161616;
  border-bottom: 1px solid #2a2a2a;
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-separator {
  width: 1px;
  height: 28px;
  background-color: rgba(255, 255, 255, 0.15);
  margin: 0 8px;
}

.delete-btn {
  background-color: rgba(255, 0, 0, 0.1);
  border-color: #ff4444;
  color: #ff6666;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background-color: rgba(255, 0, 0, 0.2);
  border-color: #ff2222;
  color: #ff2222;
}

.toolbar-center {
  flex: 1;
  text-align: center;
  color: #ffd600;
  font-weight: 600;
  font-size: 0.9rem;
}

.merged-toolbar button, .toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1px solid #ffd600;
  border-radius: 6px;
  background: transparent;
  color: #fff;
  padding: 6px 10px;
  cursor: pointer;
  font-weight: 600;
}

.merged-toolbar button:hover, .toolbar-btn:hover {
  background: rgba(255, 214, 0, 0.15);
}

.toolbar-btn.active {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  border-color: transparent;
  color: #fff;
}

.toolbar-btn.saving {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.zoom-slider {
  width: 120px;
  height: 4px;
  border-radius: 2px;
  background: rgba(124, 58, 237, 0.3);
  outline: none;
}

.zoom-slider::-webkit-slider-thumb {
  width: 14px; height: 14px; border-radius: 50%;
  background: #7c3aed; border: 2px solid #e0f2fe; cursor: pointer;
}

.zoom-slider::-moz-range-thumb {
  width: 14px; height: 14px; border-radius: 50%;
  background: #7c3aed; border: 2px solid #e0f2fe; cursor: pointer;
}

@media (max-width: 768px) {
  .toolbar-btn span { display: none; }
  .toolbar-center { display: none; }
  .zoom-slider { width: 80px; }
}
</style>