<template>
  <div class="creator-editor">
    <div class="editor-head">
      <div>
        <h2>{{ title }}</h2>
        <p v-if="subtitle" class="muted">{{ subtitle }}</p>
      </div>

      <div class="rte-toolbar" role="toolbar" aria-label="Editor toolbar">
        <button class="tool-btn" type="button" aria-label="Bold" title="Bold" @click="runEditorCommand('bold')">
          <i class="fas fa-bold"></i>
        </button>
        <button class="tool-btn" type="button" aria-label="Italic" title="Italic" @click="runEditorCommand('italic')">
          <i class="fas fa-italic"></i>
        </button>
        <button class="tool-btn" type="button" aria-label="Underline" title="Underline" @click="runEditorCommand('underline')">
          <i class="fas fa-underline"></i>
        </button>
        <button
          class="tool-btn"
          type="button"
          aria-label="Bullet list"
          title="Bullet list"
          @click="runEditorCommand('insertUnorderedList')"
        >
          <i class="fas fa-list-ul"></i>
        </button>
        <button
          class="tool-btn"
          type="button"
          aria-label="Numbered list"
          title="Numbered list"
          @click="runEditorCommand('insertOrderedList')"
        >
          <i class="fas fa-list-ol"></i>
        </button>
        <button class="tool-btn" type="button" aria-label="Insert link" title="Insert link" @click="insertLink">
          <i class="fas fa-link"></i>
        </button>
        <button class="tool-btn" type="button" aria-label="Undo" title="Undo" @click="runEditorCommand('undo')">
          <i class="fas fa-rotate-left"></i>
        </button>
        <button class="tool-btn" type="button" aria-label="Redo" title="Redo" @click="runEditorCommand('redo')">
          <i class="fas fa-rotate-right"></i>
        </button>
      </div>
    </div>

    <div class="editor-body">
      <div class="editor-panel">
        <div
          ref="editorElement"
          class="rte-canvas"
          contenteditable="true"
          role="textbox"
          aria-multiline="true"
          :data-placeholder="placeholder"
          @input="onEditorInput"
        ></div>

        <div v-if="showActions" class="editor-actions">
          <button class="secondary" type="button" @click="copyDraft">{{ copyLabel }}</button>
          <button class="secondary" type="button" @click="clearDraft">{{ clearLabel }}</button>
          <button
            v-if="useDraftLabel"
            type="button"
            @click="emitUseDraft"
          >
            {{ useDraftLabel }}
          </button>
        </div>
      </div>

      <aside v-if="hasAssets" class="asset-panel">
        <h3>{{ assetTitle }}</h3>
        <div class="asset-list">
          <button
            v-for="asset in assets"
            :key="asset.id || asset.url"
            type="button"
            class="asset-item"
            @click="insertAsset(asset.url)"
          >
            <img :src="asset.url" :alt="asset.name || 'Asset'" />
            <span>{{ asset.name }}</span>
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Writing Canvas",
  },
  subtitle: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Start writing your campaign content here...",
  },
  assets: {
    type: Array,
    default: () => [],
  },
  assetTitle: {
    type: String,
    default: "Assets",
  },
  showActions: {
    type: Boolean,
    default: true,
  },
  copyLabel: {
    type: String,
    default: "Copy Draft",
  },
  clearLabel: {
    type: String,
    default: "Clear",
  },
  useDraftLabel: {
    type: String,
    default: "Use Draft For Training",
  },
});

const emit = defineEmits(["use-draft", "copy", "clear", "input"]);

const editorElement = ref(null);

const hasAssets = computed(() => Array.isArray(props.assets) && props.assets.length > 0);

const getEditorText = () => editorElement.value?.innerText?.trim() || "";

const setText = (value = "") => {
  if (!editorElement.value) return;
  editorElement.value.innerText = value;
};

const focusEditor = () => {
  editorElement.value?.focus();
};

const runEditorCommand = (command, value = null) => {
  if (!editorElement.value) return;
  focusEditor();
  document.execCommand(command, false, value);
};

const insertLink = () => {
  const url = window.prompt("Paste link URL");
  if (!url) return;
  runEditorCommand("createLink", url);
};

const insertAsset = (url) => {
  if (!editorElement.value || !url) return;
  focusEditor();
  try {
    document.execCommand("insertImage", false, url);
  } catch (_error) {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Asset";
    img.style.maxWidth = "100%";
    img.style.display = "block";
    img.style.margin = "0.5rem 0";
    editorElement.value.appendChild(img);
  }
};

const copyDraft = async () => {
  const text = getEditorText();
  if (!text) return;
  await navigator.clipboard.writeText(text);
  emit("copy", text);
};

const clearDraft = () => {
  if (!editorElement.value) return;
  editorElement.value.innerHTML = "";
  emit("clear");
};

const emitUseDraft = () => {
  emit("use-draft", getEditorText());
};

const onEditorInput = () => {
  emit("input", getEditorText());
};

defineExpose({
  getText: getEditorText,
  setText,
  copyDraft,
  clearDraft,
  runEditorCommand,
  insertAsset,
  focusEditor,
});
</script>

<style scoped>
.creator-editor {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 0.9rem;
  height: 100%;
  min-height: 0;
}

.editor-head {
  display: grid;
  gap: 0.65rem;
}

.muted {
  color: #9ca3af;
  margin: 0.2rem 0 0;
}

.rte-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tool-btn {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: 1px solid #ffd600;
  background: transparent;
  color: #ffffff;
  padding: 0;
  display: grid;
  place-items: center;
  font-size: 0.95rem;
  cursor: pointer;
}

.tool-btn:hover {
  background: rgba(255, 214, 0, 0.18);
}

.editor-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 220px);
  gap: 0.9rem;
  min-height: 0;
}

.editor-panel {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 0.7rem;
  min-height: 0;
}

.rte-canvas {
  background: #0f0f0f;
  border: 1px solid #303030;
  border-radius: 10px;
  padding: 0.9rem;
  overflow: auto;
  outline: none;
  line-height: 1.5;
  min-height: 280px;
}

.rte-canvas:empty::before {
  content: attr(data-placeholder);
  color: #6b7280;
}

.editor-actions {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.editor-actions button {
  border: none;
  border-radius: 8px;
  background: #ffd600;
  color: #131313;
  font-weight: 700;
  cursor: pointer;
  padding: 0.62rem 0.9rem;
}

.editor-actions button.secondary {
  border: 1px solid #ffd600;
  background: transparent;
  color: #ffffff;
}

.asset-panel {
  background: #111111;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 0.8rem;
  overflow: auto;
}

.asset-panel h3 {
  margin: 0;
  font-size: 0.95rem;
}

.asset-list {
  display: grid;
  gap: 0.55rem;
  margin-top: 0.6rem;
}

.asset-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 0.4rem;
  background: #0f0f0f;
  color: #f8f8f8;
}

.asset-item img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 5px;
}

.asset-item span {
  font-size: 0.85rem;
}

@media (max-width: 1100px) {
  .editor-body {
    grid-template-columns: 1fr;
  }
}
</style>
