<template>
  <div class="canvas-workspace">
    <!-- Left Panel -->
    <LeftSidebarTools @addText="addText" @addShape="addShape" @addImage="addImage" />

    <!-- Main Canvas Area -->
    <div class="canvas-main">
      <!-- Top Toolbar -->
      <TopToolbar
        @undo="runEditorCommand('undo')"
        @redo="runEditorCommand('redo')"
        @bold="runEditorCommand('bold')"
        @italic="runEditorCommand('italic')"
        @underline="runEditorCommand('underline')"
      />

      <!-- Canvas Stage -->
      <Stage :config="stageConfig" @click="selectObject(null)">
        <Layer>
          <template v-for="(obj, index) in objects" :key="obj.id">
            <Text
              v-if="obj.type === 'text'"
              :config="obj"
              :draggable="true"
              :ref="setNodeRef(index)"
              @click.stop="selectObject(index)"
            />
            <Rect
              v-else-if="obj.type === 'rect'"
              :config="obj"
              :draggable="true"
              :ref="setNodeRef(index)"
              @click.stop="selectObject(index)"
            />
            <Circle
              v-else-if="obj.type === 'circle'"
              :config="obj"
              :draggable="true"
              :ref="setNodeRef(index)"
              @click.stop="selectObject(index)"
            />
            <KonvaImage
              v-else-if="obj.type === 'image'"
              :config="obj"
              :draggable="true"
              :ref="setNodeRef(index)"
              @click.stop="selectObject(index)"
            />
          </template>
          <Transformer
            v-if="selectedIndex !== null"
            :nodes="selectedNodes"
          />
        </Layer>
      </Stage>
      <input
        ref="imageInput"
        class="image-input"
        type="file"
        accept="image/*"
        @change="handleImageUpload"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Stage, Layer, Text, Transformer, Rect, Circle, Image as KonvaImage } from "vue-konva";

import LeftSidebarTools from "../../components/LeftSidebarTools.vue";
import TopToolbar from "../../components/TopToolbar.vue";

const objects = ref([]);
const selectedIndex = ref(null);
const nodeRefs = ref([]);
const imageInput = ref(null);

const stageConfig = {
  width: 1000,
  height: 700
};

const createId = () =>
  `node_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

function addText() {
  objects.value.push({
    id: createId(),
    type: "text",
    x: 100,
    y: 100,
    text: "Double click to edit",
    fontSize: 32,
    fill: "#ffffff",
    draggable: true
  });
}

function addShape(type) {
  if (type === "rect") {
    objects.value.push({
      id: createId(),
      type: "rect",
      x: 140,
      y: 140,
      width: 220,
      height: 120,
      fill: "rgba(255, 214, 0, 0.5)",
      cornerRadius: 8,
      draggable: true
    });
    return;
  }

  if (type === "circle") {
    objects.value.push({
      id: createId(),
      type: "circle",
      x: 220,
      y: 220,
      radius: 70,
      fill: "rgba(255, 102, 0, 0.5)",
      draggable: true
    });
  }
}

function addImage() {
  if (!imageInput.value) return;
  imageInput.value.click();
}

function handleImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const objectUrl = URL.createObjectURL(file);
  const image = new window.Image();

  image.onload = () => {
    const maxWidth = 320;
    const scale = image.width > maxWidth ? maxWidth / image.width : 1;
    objects.value.push({
      id: createId(),
      type: "image",
      x: 120,
      y: 120,
      image,
      width: image.width * scale,
      height: image.height * scale,
      draggable: true
    });
    URL.revokeObjectURL(objectUrl);
    event.target.value = "";
  };

  image.src = objectUrl;
}

function selectObject(index) {
  selectedIndex.value = index;
}

const selectedObject = computed(() => {
  if (selectedIndex.value === null) return null;
  return objects.value[selectedIndex.value];
});

const selectedNodes = computed(() => {
  if (selectedIndex.value === null) return [];
  const node = nodeRefs.value[selectedIndex.value];
  return node?.getNode ? [node.getNode()] : [];
});

const setNodeRef = (index) => (el) => {
  nodeRefs.value[index] = el;
};

// Toolbar commands (can be expanded)
function runEditorCommand(command) {
  if (!selectedObject.value) return;

  if (selectedObject.value.type !== "text") {
    if (command === "bold") {
      selectedObject.value.strokeWidth =
        selectedObject.value.strokeWidth && selectedObject.value.strokeWidth > 0 ? 0 : 2;
      selectedObject.value.stroke = selectedObject.value.stroke || "#ffffff";
      return;
    }

    if (command === "italic") {
      selectedObject.value.opacity =
        typeof selectedObject.value.opacity === "number" && selectedObject.value.opacity < 1
          ? 1
          : 0.8;
      return;
    }

    if (command === "underline") {
      selectedObject.value.shadowEnabled = !selectedObject.value.shadowEnabled;
      selectedObject.value.shadowColor = "rgba(0, 0, 0, 0.45)";
      selectedObject.value.shadowBlur = 8;
      selectedObject.value.shadowOffsetX = 2;
      selectedObject.value.shadowOffsetY = 2;
    }

    return;
  }
  const currentStyle = selectedObject.value.fontStyle || "";
  const styles = new Set(currentStyle.split(" ").filter(Boolean));

  if (command === "bold") {
    styles.has("bold") ? styles.delete("bold") : styles.add("bold");
    selectedObject.value.fontStyle = Array.from(styles).join(" ");
    return;
  }

  if (command === "italic") {
    styles.has("italic") ? styles.delete("italic") : styles.add("italic");
    selectedObject.value.fontStyle = Array.from(styles).join(" ");
    return;
  }

  if (command === "underline") {
    selectedObject.value.textDecoration =
      selectedObject.value.textDecoration === "underline" ? "" : "underline";
  }
}
</script>

<style scoped>
.canvas-workspace {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.canvas-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
}

.konvajs-content {
  flex: 1;
}

.image-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
