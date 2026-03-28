<template>
  <div class="creator-editor">
    <div class="editor-head">
      <div>
        <h2>{{ title }}</h2>
        <p v-if="subtitle" class="muted">{{ subtitle }}</p>
      </div>
    </div>

    <div class="editor-body" :class="{ 'with-assets': hasAssets }">
      <div class="editor-surface">
        <div class="rte-toolbar">
          <div class="toolbar-group">
            <div class="style-select">
              <select v-model="blockStyle" @change="applyBlockStyle" aria-label="Style">
                <option value="paragraph">Style</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="quote">Quote</option>
                <option value="code">Code Block</option>
              </select>
              <i class="fas fa-chevron-down"></i>
            </div>
          </div>

          <div class="toolbar-divider"></div>

          <div class="toolbar-group">
            <button class="tool-btn text-btn" @click="runEditorCommand('bold')" title="Bold">B</button>
            <button class="tool-btn text-btn italic" @click="runEditorCommand('italic')" title="Italic">I</button>
          </div>

          <div class="toolbar-group">
            <button class="tool-btn" @click="runEditorCommand('insertUnorderedList')" title="Bullet list">
              <i class="fas fa-list-ul"></i>
            </button>
            <button class="tool-btn" @click="runEditorCommand('insertOrderedList')" title="Numbered list">
              <i class="fas fa-list-ol"></i>
            </button>
          </div>

          <div class="toolbar-group">
            <button class="tool-btn" @click="runEditorCommand('formatBlock', 'blockquote')" title="Quote">
              <i class="fas fa-quote-right"></i>
            </button>
            <button class="tool-btn" @click="runEditorCommand('formatBlock', 'pre')" title="Code block">
              <i class="fas fa-code"></i>
            </button>
            <button class="tool-btn" @click="runEditorCommand('insertHorizontalRule')" title="Divider">
              <i class="fas fa-minus"></i>
            </button>
          </div>

          <div class="toolbar-divider"></div>

          <div class="toolbar-group">
            <button class="tool-btn" @click="insertLink" title="Link">
              <i class="fas fa-link"></i>
            </button>
            <button class="tool-btn" @click="insertImage" title="Image">
              <i class="fas fa-image"></i>
            </button>
          </div>
        </div>

        <div
          ref="editorElement"
          class="rte-canvas"
          contenteditable="true"
          tabindex="0"
          :data-placeholder="placeholder"
          @input="onEditorInput"
        ></div>

        <div v-if="showActions" class="editor-actions">
          <button class="secondary" @click="copyDraft">{{ copyLabel }}</button>
          <button class="secondary" @click="clearDraft">{{ clearLabel }}</button>
          <button v-if="useDraftLabel" @click="emitUseDraft">
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
import { ref, computed, onMounted } from "vue"

const STORAGE_KEY = "creator-editor-draft"

const props = defineProps({
  title: { type: String, default: "Writing Canvas" },
  subtitle: { type: String, default: "" },
  placeholder: {
    type: String,
    default: "Start writing your campaign content here..."
  },
  assets: { type: Array, default: () => [] },
  assetTitle: { type: String, default: "Assets" },
  showActions: { type: Boolean, default: true },
  copyLabel: { type: String, default: "Copy Draft" },
  clearLabel: { type: String, default: "Clear" },
  useDraftLabel: { type: String, default: "Use Draft For Training" }
})

const emit = defineEmits(["input", "copy", "clear", "use-draft"])

const editorElement = ref(null)
const blockStyle = ref("paragraph")

const hasAssets = computed(
  () => Array.isArray(props.assets) && props.assets.length > 0
)

const focusEditor = () => {
  editorElement.value?.focus()
}

const getEditorContent = () => {
  return editorElement.value?.innerHTML?.trim() || ""
}

const setText = (value = "") => {
  if (!editorElement.value) return
  editorElement.value.innerHTML = value
}

const insertContent = (content = "") => {
  if (!editorElement.value) return
  editorElement.value.innerHTML += `<p>${content}</p>`
  focusEditor()
}

const runEditorCommand = (command, value = null) => {
  focusEditor()
  document.execCommand(command, false, value)
}

const insertLink = () => {
  const url = window.prompt("Paste link URL")
  if (!url) return
  runEditorCommand("createLink", url)
}

const insertImage = () => {
  const url = window.prompt("Paste image URL")
  if (!url) return
  insertAsset(url)
}

const applyBlockStyle = () => {
  const map = {
    paragraph: "p",
    h1: "h1",
    h2: "h2",
    quote: "blockquote",
    code: "pre"
  }
  runEditorCommand("formatBlock", map[blockStyle.value] || "p")
}

const insertAsset = (url) => {
  if (!url) return
  focusEditor()

  try {
    document.execCommand("insertImage", false, url)
  } catch {
    const img = document.createElement("img")
    img.src = url
    img.style.maxWidth = "100%"
    img.style.display = "block"
    img.style.margin = "10px 0"
    editorElement.value.appendChild(img)
  }
}

const copyDraft = async () => {
  const text = getEditorContent()

  if (!text) return

  try {
    await navigator.clipboard.writeText(text)
  } catch {
    console.warn("Clipboard copy failed")
  }

  emit("copy", text)
}

const clearDraft = () => {
  if (!editorElement.value) return

  editorElement.value.innerHTML = ""
  localStorage.removeItem(STORAGE_KEY)

  emit("clear")
}

const emitUseDraft = () => {
  emit("use-draft", getEditorContent())
}

const saveDraft = () => {
  const content = getEditorContent()
  localStorage.setItem(STORAGE_KEY, content)
}

const loadDraft = () => {
  const draft = localStorage.getItem(STORAGE_KEY)

  if (draft && editorElement.value) {
    editorElement.value.innerHTML = draft
  }
}

const commands = {
  "/h1": () => runEditorCommand("formatBlock", "h1"),
  "/h2": () => runEditorCommand("formatBlock", "h2"),
  "/quote": () => runEditorCommand("formatBlock", "blockquote"),
  "/code": () => runEditorCommand("formatBlock", "pre"),
  "/list": () => runEditorCommand("insertUnorderedList")
}

const handleSlashCommands = () => {
  const text = editorElement.value.innerText
  const lastLine = text.split("\n").pop()

  if (commands[lastLine]) {
    commands[lastLine]()

    editorElement.value.innerText = text.replace(lastLine, "")
  }
}

const handleDrop = (e) => {
  e.preventDefault()

  const file = e.dataTransfer.files[0]

  if (!file || !file.type.startsWith("image/")) return

  const reader = new FileReader()

  reader.onload = (event) => {
    insertAsset(event.target.result)
  }

  reader.readAsDataURL(file)
}

const onEditorInput = () => {
  handleSlashCommands()
  saveDraft()

  emit("input", getEditorContent())
}

onMounted(() => {
  loadDraft()
  focusEditor()

  const el = editorElement.value

  el.addEventListener("dragover", (e) => e.preventDefault())
  el.addEventListener("drop", handleDrop)
})

defineExpose({
  getText: getEditorContent,
  setText,
  insertContent,
  copyDraft,
  clearDraft,
  runEditorCommand,
  insertAsset,
  focusEditor
})
</script>

<style scoped>
.creator-editor {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1rem;
  height: 100%;
}

.editor-head {
  display: grid;
  gap: .6rem;
}

.muted {
  color: #9ca3af;
}

.rte-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: .55rem;
  padding: .4rem .6rem;
  background: #1f242c;
  border: 1px solid #2f3641;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: .35rem;
}

.toolbar-divider {
  width: 1px;
  height: 22px;
  background: rgba(255,255,255,0.12);
}

.style-select {
  position: relative;
  display: flex;
  align-items: center;
}

.style-select select {
  appearance: none;
  border: 1px solid #38404d;
  background: #242a33;
  color: #e5e7eb;
  border-radius: 999px;
  padding: .35rem 1.6rem .35rem .7rem;
  font-size: .82rem;
  font-weight: 600;
  cursor: pointer;
}

.style-select i {
  position: absolute;
  right: .55rem;
  font-size: .6rem;
  color: #9aa3b2;
  pointer-events: none;
}

.tool-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: #cbd5e1;
  cursor: pointer;
}

.tool-btn:hover {
  background: rgba(255,255,255,0.08);
  color: #ffffff;
}

.tool-btn.text-btn {
  font-size: .85rem;
  font-weight: 700;
  letter-spacing: .02em;
}

.tool-btn.text-btn.italic {
  font-style: italic;
}

.editor-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.editor-body.with-assets {
  grid-template-columns: 1fr 220px;
}

.editor-surface {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rte-canvas {
  background: #0f0f0f;
  border: 1px solid #303030;
  border-radius: 10px;
  padding: 1rem;
  min-height: 420px;
  overflow: visible;
  width: 100%;
}

.rte-canvas:empty::before {
  content: attr(data-placeholder);
  color: #6b7280;
}

.editor-actions {
  display: flex;
  gap: .4rem;
  margin-top: .5rem;
}

.editor-actions button {
  background: #ffd600;
  border: none;
  border-radius: 8px;
  padding: .6rem .9rem;
  font-weight: bold;
}

.editor-actions button.secondary {
  background: transparent;
  border: 1px solid #ffd600;
  color: white;
}

.asset-panel {
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: .8rem;
}

.asset-list {
  display: grid;
  gap: .5rem;
  margin-top: .5rem;
}

.asset-item {
  display: flex;
  gap: .4rem;
  align-items: center;
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: .4rem;
  cursor: pointer;
}

.asset-item img {
  width: 40px;
  height: 40px;
  object-fit: cover;
}
</style>
