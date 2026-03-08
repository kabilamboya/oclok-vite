<template>
  <section class="mockups-page">
    <aside class="panel tools-panel">
      <h2>Mockup Studio</h2>
      <p class="muted">Side panel tools for canvas editing, upload, and interaction control.</p>

      <form class="upload-form" @submit.prevent="onUpload">
        <input v-model="form.name" type="text" placeholder="Mockup name" required />
        <input v-model="form.category" type="text" placeholder="Category (social, banner, web, print)" />
        <input v-model="form.tags" type="text" placeholder="Tags separated by commas" />
        <textarea v-model="form.promptUsed" rows="3" placeholder="Prompt used for this mockup"></textarea>
        <input type="file" accept="image/*" @change="onFileChange" required />
        <button type="submit" :disabled="uploading || !file">{{ uploading ? 'Uploading...' : 'Upload Mockup' }}</button>
      </form>

      <div class="tool-section">
        <h3>Canvas Tools</h3>
        <div class="tool-grid icon-tool-grid">
          <button
            class="secondary icon-tool"
            type="button"
            aria-label="Add text layer"
            title="Add text layer"
            @click="addTextLayer"
          >
            <i class="fas fa-font"></i>
          </button>
          <button
            class="secondary icon-tool"
            type="button"
            aria-label="Add block layer"
            title="Add block layer"
            @click="addRectLayer"
          >
            <i class="fas fa-square"></i>
          </button>
          <button
            class="secondary icon-tool"
            type="button"
            aria-label="Add badge layer"
            title="Add badge layer"
            @click="addCircleLayer"
          >
            <i class="fas fa-circle"></i>
          </button>
          <button
            class="secondary icon-tool"
            type="button"
            aria-label="Delete selected layer"
            title="Delete selected layer"
            @click="removeSelectedLayer"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <p class="tool-hint">Text, block, badge, and delete selected layer.</p>
      </div>

      <div class="tool-section">
        <h3>Brush and Draw</h3>
        <div class="inline-row compact-tools">
          <button
            class="secondary icon-tool"
            type="button"
            :aria-label="drawingMode ? 'Disable drawing mode' : 'Enable drawing mode'"
            :title="drawingMode ? 'Disable drawing mode' : 'Enable drawing mode'"
            @click="toggleDrawingMode"
          >
            <i :class="drawingMode ? 'fas fa-pen-slash' : 'fas fa-pen'"></i>
          </button>
          <button
            class="secondary icon-tool"
            type="button"
            aria-label="Clear canvas layers"
            title="Clear canvas layers"
            @click="clearCanvasObjects"
          >
            <i class="fas fa-broom"></i>
          </button>
        </div>
        <p class="tool-hint">{{ drawingMode ? 'Drawing mode is on.' : 'Drawing mode is off.' }}</p>
        <label>
          Brush Size
          <input v-model.number="brushSize" type="range" min="1" max="48" />
        </label>
        <label>
          Brush Color
          <input v-model="brushColor" type="color" class="color-input" />
        </label>
      </div>

      <div class="tool-section">
        <h3>Selected Layer</h3>
        <label>
          Opacity
          <input v-model.number="layerControls.opacity" type="range" min="10" max="100" @input="applyLayerControls" />
        </label>
        <label>
          Scale
          <input v-model.number="layerControls.scale" type="range" min="20" max="220" @input="applyLayerControls" />
        </label>
        <label>
          Rotation
          <input v-model.number="layerControls.angle" type="range" min="-180" max="180" @input="applyLayerControls" />
        </label>
      </div>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </aside>

    <div class="panel workspace-panel">
      <div class="header-row">
        <h3>Interactive Canvas and 360 View</h3>
        <div class="header-actions">
          <button class="secondary icon-tool" type="button" aria-label="Export PNG" title="Export PNG" @click="downloadCanvas">
            <i class="fas fa-file-export"></i>
          </button>
          <button class="secondary icon-tool" type="button" aria-label="Refresh mockups" title="Refresh mockups" @click="loadMockups">
            <i class="fas fa-rotate"></i>
          </button>
        </div>
      </div>

      <div class="workspace-grid">
        <div class="canvas-stage">
          <canvas ref="canvasElement" width="1280" height="720"></canvas>
        </div>

        <div class="viewer-side">
          <h4>360 User View</h4>
          <p class="muted">Drag directly on preview to rotate and inspect interaction angles.</p>

          <div
            class="viewer-stage"
            @pointerdown="startViewerDrag"
            @pointermove="moveViewerDrag"
            @pointerup="endViewerDrag"
            @pointerleave="endViewerDrag"
          >
            <div class="viewer-card" :style="viewerCardStyle">
              <img v-if="viewerImageUrl" :src="viewerImageUrl" alt="Mockup 360 preview" />
              <p v-else class="viewer-empty">Select or upload a mockup to begin.</p>
            </div>
          </div>

          <div class="viewer-controls">
            <label>
              Rotation (0-360)
              <input v-model.number="viewer.rotationY" type="range" min="0" max="360" />
            </label>
            <label>
              Tilt
              <input v-model.number="viewer.tiltX" type="range" min="-35" max="35" />
            </label>
            <label>
              Zoom
              <input v-model.number="viewer.zoom" type="range" min="0.6" max="1.8" step="0.01" />
            </label>
            <div class="inline-row">
              <button class="secondary" @click="viewer.autoSpin = !viewer.autoSpin">
                {{ viewer.autoSpin ? 'Stop Spin' : 'Auto Spin' }}
              </button>
              <button class="secondary" @click="resetViewer">Reset View</button>
            </div>
          </div>
        </div>
      </div>

      <div class="header-row gallery-head">
        <h3>My Mockups</h3>
      </div>

      <div class="mockups-grid">
        <article
          v-for="mockup in mockups"
          :key="mockup.id"
          class="mockup-card"
          :class="{ selected: selectedMockupId === mockup.id }"
        >
          <img :src="mockup.url" :alt="mockup.name" @click="loadMockupIntoStudio(mockup.url, mockup.id)" />
          <div class="mockup-content">
            <h4>{{ mockup.name }}</h4>
            <p class="meta">{{ mockup.category || 'general' }} - {{ mockup.status }}</p>
            <p class="prompt" v-if="mockup.prompt_used">{{ mockup.prompt_used }}</p>
            <div class="tags" v-if="mockup.tags?.length">
              <span v-for="tag in mockup.tags" :key="tag">{{ tag }}</span>
            </div>
            <div class="actions">
              <button class="secondary" @click="loadMockupIntoStudio(mockup.url, mockup.id)">Edit</button>
              <button class="secondary" @click="changeStatus(mockup, 'approved')">Approve</button>
              <button class="secondary" @click="changeStatus(mockup, 'draft')">Draft</button>
            </div>
          </div>
        </article>
        <p v-if="mockups.length === 0" class="muted">No mockups uploaded yet.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { Canvas as FabricCanvas, Circle, FabricImage, PencilBrush, Rect, Textbox } from 'fabric';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  createCyberMockup,
  listCyberMockups,
  updateCyberMockupStatus,
} from '@/services/cyber.service';

const userId = ref(null);
const file = ref(null);
const uploading = ref(false);
const errorMessage = ref('');
const mockups = ref([]);
const selectedMockupId = ref(null);
const viewerImageUrl = ref('');
const localPreviewUrl = ref('');

const canvasElement = ref(null);
const studioCanvas = ref(null);

const drawingMode = ref(false);
const brushSize = ref(8);
const brushColor = ref('#ff6600');

const layerControls = reactive({
  opacity: 100,
  scale: 100,
  angle: 0,
});

const viewer = reactive({
  rotationY: 0,
  tiltX: 0,
  zoom: 1,
  autoSpin: false,
});

const viewerDrag = reactive({
  active: false,
  lastX: 0,
  lastY: 0,
});

const form = reactive({
  name: '',
  category: '',
  tags: '',
  promptUsed: '',
});

let spinTimer = null;

const viewerCardStyle = computed(() => ({
  transform: `rotateX(${viewer.tiltX}deg) rotateY(${viewer.rotationY}deg) scale(${viewer.zoom})`,
}));

const parseTags = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const resolveGuestUserId = () => {
  const fallback = `guest_${Date.now().toString(36)}`;
  if (typeof window === 'undefined') return fallback;

  const key = 'cyber_guest_user_id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  window.localStorage.setItem(key, fallback);
  return fallback;
};

const readFileAsDataUrl = (fileInput) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read selected image file.'));
    reader.readAsDataURL(fileInput);
  });

const resetViewer = () => {
  viewer.rotationY = 0;
  viewer.tiltX = 0;
  viewer.zoom = 1;
};

const updateBrushSettings = () => {
  if (!studioCanvas.value) return;
  studioCanvas.value.isDrawingMode = drawingMode.value;

  if (drawingMode.value) {
    if (!studioCanvas.value.freeDrawingBrush) {
      studioCanvas.value.freeDrawingBrush = new PencilBrush(studioCanvas.value);
    }
    studioCanvas.value.freeDrawingBrush.width = brushSize.value;
    studioCanvas.value.freeDrawingBrush.color = brushColor.value;
  }
};

const syncLayerControls = () => {
  if (!studioCanvas.value) return;
  const active = studioCanvas.value.getActiveObject();
  if (!active) return;

  layerControls.opacity = Math.round((active.opacity ?? 1) * 100);
  layerControls.scale = Math.round((active.scaleX ?? 1) * 100);
  layerControls.angle = Math.round(active.angle ?? 0);
};

const applyLayerControls = () => {
  if (!studioCanvas.value) return;
  const active = studioCanvas.value.getActiveObject();
  if (!active) return;

  active.set({
    opacity: layerControls.opacity / 100,
    scaleX: layerControls.scale / 100,
    scaleY: layerControls.scale / 100,
    angle: layerControls.angle,
  });
  active.setCoords();
  studioCanvas.value.requestRenderAll();
};

const initCanvas = () => {
  if (!canvasElement.value) return;

  studioCanvas.value = new FabricCanvas(canvasElement.value, {
    preserveObjectStacking: true,
    backgroundColor: '#0d0d0d',
  });

  studioCanvas.value.on('selection:created', syncLayerControls);
  studioCanvas.value.on('selection:updated', syncLayerControls);
  studioCanvas.value.on('selection:cleared', () => {
    layerControls.opacity = 100;
    layerControls.scale = 100;
    layerControls.angle = 0;
  });

  updateBrushSettings();
};

const loadBackgroundIntoCanvas = async (url) => {
  if (!studioCanvas.value || !url) return;

  const bg = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
  const baseWidth = bg.width || 1;
  const baseHeight = bg.height || 1;
  const scale = Math.min(studioCanvas.value.getWidth() / baseWidth, studioCanvas.value.getHeight() / baseHeight);

  bg.set({
    originX: 'center',
    originY: 'center',
    left: studioCanvas.value.getWidth() / 2,
    top: studioCanvas.value.getHeight() / 2,
    selectable: false,
    evented: false,
    scaleX: scale,
    scaleY: scale,
  });

  studioCanvas.value.backgroundImage = bg;
  studioCanvas.value.requestRenderAll();
};

const loadMockupIntoStudio = async (url, id = null) => {
  selectedMockupId.value = id;
  viewerImageUrl.value = url;
  await loadBackgroundIntoCanvas(url);
};

const addTextLayer = () => {
  if (!studioCanvas.value) return;
  const text = new Textbox('Brand headline', {
    left: 140,
    top: 120,
    width: 260,
    fontSize: 36,
    fill: '#ffffff',
    fontWeight: 700,
    stroke: '#000000',
    strokeWidth: 0.5,
  });
  studioCanvas.value.add(text);
  studioCanvas.value.setActiveObject(text);
  studioCanvas.value.requestRenderAll();
};

const addRectLayer = () => {
  if (!studioCanvas.value) return;
  const shape = new Rect({
    left: 120,
    top: 260,
    width: 320,
    height: 110,
    fill: 'rgba(255, 102, 0, 0.45)',
    rx: 12,
    ry: 12,
  });
  studioCanvas.value.add(shape);
  studioCanvas.value.setActiveObject(shape);
  studioCanvas.value.requestRenderAll();
};

const addCircleLayer = () => {
  if (!studioCanvas.value) return;
  const badge = new Circle({
    left: 500,
    top: 80,
    radius: 62,
    fill: 'rgba(255, 214, 0, 0.72)',
  });
  studioCanvas.value.add(badge);
  studioCanvas.value.setActiveObject(badge);
  studioCanvas.value.requestRenderAll();
};

const removeSelectedLayer = () => {
  if (!studioCanvas.value) return;
  const selected = studioCanvas.value.getActiveObjects();
  if (!selected.length) return;
  selected.forEach((item) => studioCanvas.value.remove(item));
  studioCanvas.value.discardActiveObject();
  studioCanvas.value.requestRenderAll();
};

const clearCanvasObjects = () => {
  if (!studioCanvas.value) return;
  studioCanvas.value.getObjects().forEach((item) => studioCanvas.value.remove(item));
  studioCanvas.value.discardActiveObject();
  studioCanvas.value.requestRenderAll();
};

const toggleDrawingMode = () => {
  drawingMode.value = !drawingMode.value;
};

const downloadCanvas = () => {
  if (!studioCanvas.value) return;
  const dataUrl = studioCanvas.value.toDataURL({ format: 'png', multiplier: 2 });
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${form.name || 'mockup-canvas'}.png`;
  link.click();
};

const onFileChange = async (event) => {
  file.value = event.target.files?.[0] || null;
  if (!file.value) return;

  if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
  localPreviewUrl.value = URL.createObjectURL(file.value);

  if (!form.name) {
    form.name = file.value.name.replace(/\.[^/.]+$/, '');
  }

  await loadMockupIntoStudio(localPreviewUrl.value);
};

const loadMockups = async () => {
  try {
    const ownerId = userId.value || resolveGuestUserId();
    mockups.value = await listCyberMockups({ userId: ownerId });
  } catch (error) {
    errorMessage.value = error.message || 'Unable to fetch mockups';
  }
};

const onUpload = async () => {
  if (!file.value) return;

  uploading.value = true;
  errorMessage.value = '';

  try {
    const owner = userId.value || resolveGuestUserId();
    const safeName = file.value.name.replace(/\s+/g, '-');
    const storagePath = `${owner}/${Date.now()}-${safeName}`;
    let mockupUrl = '';

    if (isSupabaseConfigured) {
      const { error: uploadError } = await supabase.storage
        .from('mockups')
        .upload(storagePath, file.value);

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from('mockups').getPublicUrl(storagePath);
      mockupUrl = publicData?.publicUrl || '';
    }

    if (!mockupUrl) {
      mockupUrl = await readFileAsDataUrl(file.value);
    }

    const created = await createCyberMockup({
      userId: owner,
      name: form.name,
      url: mockupUrl,
      category: form.category,
      tags: parseTags(form.tags),
      promptUsed: form.promptUsed,
      status: 'draft',
    });

    mockups.value = [created, ...mockups.value];
    await loadMockupIntoStudio(created.url, created.id);
    form.name = '';
    form.category = '';
    form.tags = '';
    form.promptUsed = '';
    file.value = null;
  } catch (error) {
    errorMessage.value = error.message || 'Upload failed';
  } finally {
    uploading.value = false;
  }
};

const changeStatus = async (mockup, status) => {
  try {
    const updated = await updateCyberMockupStatus(mockup.id, status);
    mockups.value = mockups.value.map((item) => (item.id === updated.id ? updated : item));
  } catch (error) {
    errorMessage.value = error.message || 'Unable to update status';
  }
};

const startViewerDrag = (event) => {
  viewerDrag.active = true;
  viewerDrag.lastX = event.clientX;
  viewerDrag.lastY = event.clientY;
};

const moveViewerDrag = (event) => {
  if (!viewerDrag.active) return;
  const deltaX = event.clientX - viewerDrag.lastX;
  const deltaY = event.clientY - viewerDrag.lastY;

  viewer.rotationY = (viewer.rotationY + deltaX * 0.7 + 360) % 360;
  viewer.tiltX = Math.max(-35, Math.min(35, viewer.tiltX - deltaY * 0.35));

  viewerDrag.lastX = event.clientX;
  viewerDrag.lastY = event.clientY;
};

const endViewerDrag = () => {
  viewerDrag.active = false;
};

watch([drawingMode, brushSize, brushColor], updateBrushSettings);

watch(
  () => viewer.autoSpin,
  (enabled) => {
    if (spinTimer) {
      clearInterval(spinTimer);
      spinTimer = null;
    }

    if (enabled) {
      spinTimer = setInterval(() => {
        viewer.rotationY = (viewer.rotationY + 1.4) % 360;
      }, 30);
    }
  },
);

onMounted(async () => {
  initCanvas();
  let resolvedUserId = resolveGuestUserId();

  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user?.id) resolvedUserId = data.user.id;
  } catch {
    // Guest mode is sufficient for local mockup workflow.
  }

  userId.value = resolvedUserId;
  await loadMockups();
});

onBeforeUnmount(() => {
  if (spinTimer) clearInterval(spinTimer);
  if (studioCanvas.value) {
    studioCanvas.value.dispose();
    studioCanvas.value = null;
  }
  if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
});
</script>

<style scoped>
.mockups-page {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 1rem;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.panel {
  background: #151515;
  border: 1px solid #2e2e2e;
  border-radius: 12px;
  padding: 1rem;
}

.muted {
  color: #9ca3af;
}

.tools-panel {
  position: relative;
  top: 0;
  height: 100%;
  max-height: none;
  overflow: auto;
}

.upload-form {
  display: grid;
  gap: 0.6rem;
  margin-top: 0.85rem;
}

.tool-section {
  border-top: 1px solid #2b2b2b;
  margin-top: 0.95rem;
  padding-top: 0.95rem;
}

.tool-section h3 {
  margin: 0 0 0.65rem;
  font-size: 0.95rem;
}

.tool-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
}

.icon-tool-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.inline-row {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  flex-wrap: wrap;
}

.compact-tools {
  align-items: center;
}

label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: #d1d5db;
  margin-top: 0.55rem;
}

input,
textarea {
  border-radius: 8px;
  border: 1px solid #393939;
  background: #0f0f0f;
  color: #f7f7f7;
  padding: 0.65rem;
  width: 100%;
}

.color-input {
  padding: 0.1rem;
  height: 38px;
}

button {
  border: none;
  border-radius: 8px;
  padding: 0.62rem 0.9rem;
  font-weight: 700;
  cursor: pointer;
  background: #ffd600;
  color: #121212;
}

button.secondary {
  background: transparent;
  color: #ffd600;
  border: 1px solid #ffd600;
}

.icon-tool {
  width: 40px;
  min-width: 40px;
  height: 40px;
  padding: 0 !important;
  display: grid;
  place-items: center;
}

.tool-hint {
  margin-top: 0.45rem;
  margin-bottom: 0;
  color: #9ca3af;
  font-size: 0.78rem;
}

.workspace-panel {
  display: grid;
  gap: 0.95rem;
  min-height: 0;
  overflow: auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.7rem;
}

.header-actions {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.workspace-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.85rem;
  min-height: 0;
}

.canvas-stage {
  border: 1px solid #2f2f2f;
  border-radius: 10px;
  background: #090909;
  overflow: hidden;
  padding: 0.4rem;
  width: 100%;
  min-height: clamp(420px, 62vh, 760px);
  aspect-ratio: auto;
}

.canvas-stage canvas {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.viewer-side {
  border: 1px solid #2f2f2f;
  border-radius: 10px;
  padding: 0.7rem;
  background: #101010;
}

.viewer-side h4 {
  margin: 0;
}

.viewer-stage {
  margin-top: 0.55rem;
  perspective: 1100px;
  min-height: 220px;
  border: 1px dashed #3a3a3a;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at center, rgba(255, 102, 0, 0.12), transparent 62%);
  touch-action: none;
}

.viewer-card {
  width: 220px;
  height: 220px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  transform-style: preserve-3d;
  transition: transform 0.06s linear;
  overflow: hidden;
}

.viewer-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  border: 1px solid #404040;
}

.viewer-empty {
  font-size: 0.85rem;
  color: #9ca3af;
  text-align: center;
  padding: 0.8rem;
}

.viewer-controls {
  margin-top: 0.7rem;
  display: grid;
  gap: 0.45rem;
}

.gallery-head {
  margin-top: 0.5rem;
}

.mockups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.8rem;
}

.mockup-card {
  border: 1px solid #2f2f2f;
  border-radius: 10px;
  overflow: hidden;
  background: #101010;
}

.mockup-card.selected {
  border-color: #ff6600;
  box-shadow: 0 0 0 1px rgba(255, 102, 0, 0.6);
}

.mockup-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  cursor: pointer;
}

.mockup-content {
  padding: 0.7rem;
}

.meta {
  font-size: 0.82rem;
  color: #9ca3af;
}

.prompt {
  font-size: 0.85rem;
  margin: 0.45rem 0;
}

.tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.tags span {
  font-size: 0.74rem;
  border: 1px solid #363636;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
}

.actions {
  display: flex;
  gap: 0.45rem;
  margin-top: 0.65rem;
  flex-wrap: wrap;
}

.error {
  color: #fca5a5;
  margin-top: 0.7rem;
}

@media (max-width: 980px) {
  .mockups-page {
    grid-template-columns: 1fr;
    height: auto;
    overflow: visible;
  }

  .tools-panel {
    position: static;
    height: auto;
    max-height: none;
  }

  .workspace-panel {
    overflow: visible;
  }
}
</style>
