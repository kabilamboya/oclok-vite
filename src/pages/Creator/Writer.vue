<template>
  <div class="writer-container">
    <!-- Shared Toolbar with Zoom -->
    <CreatorToolbar
      :initial-zoom="zoom"
      :editor-content="getEditorText()"
      current-page="writer"
      @zoom-change="handleZoomChange"
      @tool-selected="handleToolSelected"
      @draft-saved="handleDraftSaved"
    />

    <section class="writer-page" :style="{ transform: `scale(${zoom / 100})`, transformOrigin: '0 0' }">
      <CreatorEditor
        ref="editorRef"
        class="panel editor-panel"
        title="Writing Canvas with RTE"
        subtitle="Rich Text Editor for AI scripts, campaign drafts, and professional content generation."
        placeholder="Start writing your AI script or campaign content here..."
        use-draft-label="Save Draft"
        @use-draft="applyDraftToTraining"
      />

      <!-- File Upload & Shapes Panel for RTE -->
      <aside class="panel tools-panel">
        <div class="panel-header">
          <h2>RTE Tools & Imports</h2>
          <router-link to="/cyber/prompts" class="learn-prompts-btn" title="Learn AI prompting">
            <i class="fas fa-sparkles"></i>
          </router-link>
        </div>

        <!-- File Upload Section -->
        <div class="section-container">
          <h3>📁 File Upload</h3>
          <p class="muted">Import text files to your editor</p>
          <form class="upload-form" @submit.prevent="handleFileUpload">
            <input 
              ref="fileInput"
              type="file" 
              accept=".txt,.md,.doc,.docx" 
              @change="onFileSelected"
              class="file-input"
            />
            <button type="submit" :disabled="!selectedFile || uploading" class="upload-btn">
              {{ uploading ? 'Uploading...' : 'Import File' }}
            </button>
          </form>
        </div>

        <!-- Shapes & Elements Section -->
        <div class="section-container">
          <h3>🔷 Shapes & Elements</h3>
          <p class="muted">Insert formatting shapes</p>
          
          <div class="color-control">
            <label>Color:</label>
            <input type="color" v-model="shapeColor" class="color-picker">
          </div>
          
          <div class="shapes-grid">
            <button 
              class="shape-btn" 
              @click="insertShape('quote')" 
              title="Insert quote shape"
            >
              <i class="fas fa-quote-left"></i> Quote
            </button>
            <button 
              class="shape-btn" 
              @click="insertShape('box')" 
              title="Insert text box"
            >
              <i class="fas fa-square"></i> Box
            </button>
            <button 
              class="shape-btn" 
              @click="insertShape('highlight')" 
              title="Insert highlight"
            >
              <i class="fas fa-highlighter"></i> Highlight
            </button>
            <button 
              class="shape-btn" 
              @click="insertShape('divider')" 
              title="Insert divider"
            >
              <i class="fas fa-minus"></i> Divider
            </button>
          </div>
        </div>

        <!-- Templates Section -->
        <div class="section-container">
          <h3>📋 Quick Templates</h3>
          <div class="template-buttons">
            <button class="template-btn" @click="insertTemplate('email')">
              <i class="fas fa-envelope"></i> Email
            </button>
            <button class="template-btn" @click="insertTemplate('social')">
              <i class="fas fa-share-alt"></i> Social
            </button>
            <button class="template-btn" @click="insertTemplate('script')">
              <i class="fas fa-microphone"></i> Script
            </button>
          </div>
        </div>
      </aside>
    </section>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import CreatorEditor from '@/components/CreatorEditor.vue';
import { getLocalUserId } from '@/lib/localStore';

const editorRef = ref(null);
const fileInput = ref(null);
const zoom = ref(100);
const selectedFile = ref(null);
const uploading = ref(false);
const shapeColor = ref('#ff6600');

const templates = {
  email: `Subject: [Your Subject Here]

Hi [Name],

[Your message here]

Best regards,
[Your Name]`,
  
  social: `📱 [Hook or attention-grabber]

[Main message - 2-3 lines]

[Call-to-action]

#oclok #[relevant hashtags]`,
  
  script: `[SCENE DESCRIPTION]

CHARACTER: [Dialogue here]

[Action or description]

CHARACTER: [Response]`,
};

const shapeTemplates = {
  quote: `"[Your quote here]"
— [Attribution]`,
  
  box: `┌────────────────────┐
│ [Important Info]   │
└────────────────────┘`,
  
  highlight: `⭐ [HIGHLIGHTED TEXT]`,
  
  divider: `════════════════════════════════════`,
};

// Add color wrapper for shapes with memo of color applied
const wrapShapeWithColor = (content) => {
  return `\n[COLOR: ${shapeColor.value}]\n${content}\n[/COLOR]\n`;
};

// File Upload Handler
const onFileSelected = (event) => {
  selectedFile.value = event.target.files?.[0] || null;
};

const handleFileUpload = async () => {
  if (!selectedFile.value) return;
  
  uploading.value = true;
  try {
    const text = await selectedFile.value.text();
    editorRef.value?.insertContent?.(text);
    
    // Reset file input
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = '';
  } catch (error) {
    console.error('Error reading file:', error);
    alert('Error reading file. Please try again.');
  } finally {
    uploading.value = false;
  }
};

// Shape Insertion
const insertShape = (shapeType) => {
  const shapeContent = shapeTemplates[shapeType] || '';
  if (editorRef.value) {
    const current = editorRef.value?.getText?.() || '';
    const coloredContent = wrapShapeWithColor(shapeContent);
    editorRef.value?.setText?.(current + coloredContent);
  }
};

const getEditorText = () => editorRef.value?.getText() || "";

const applyDraftToTraining = (text) => {
  console.log('Draft applied to training:', text);
  // Here you could send the draft to your AI training service
};

const insertTemplate = (templateType) => {
  const templateContent = templates[templateType] || '';
  editorRef.value?.setText?.(templateContent);
};

const handleZoomChange = (newZoom) => {
  zoom.value = newZoom;
};

const handleToolSelected = (toolId) => {
  console.log('Tool selected:', toolId);
};

const handleDraftSaved = (draftData) => {
  console.log('Draft auto-saved:', draftData);
};

onMounted(() => {
  const userId = getLocalUserId("cyber_guest_user_id");
  console.log('Writer page loaded for user:', userId);
});

onBeforeUnmount(() => {
  // Clean up
});
</script>

<style scoped>

.writer-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.writer-page {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.5fr);
  gap: 0.9rem;
  overflow: auto;
  height: 100%;
}

.panel {
  background: #161616;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 0.85rem;
  min-height: 0;
}

.editor-panel {
  overflow: auto;
}

.tools-panel {
  border-left: 1px solid #2a2a2a;
  padding: 1.2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 8px;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #2a2a2a;
}

.panel-header h2 {
  font-size: 1rem;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
  flex: 1;
}

.learn-prompts-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  color: #ff6600;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.learn-prompts-btn:hover {
  background: rgba(255, 102, 0, 0.1);
  color: #ff8533;
}

.muted {
  color: #9ca3af;
  margin: 0.2rem 0 0.8rem;
  font-size: 0.85rem;
}

.section-container {
  margin-bottom: 1.4rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 102, 0, 0.1);
}

.section-container:last-child {
  border-bottom: none;
}

.section-container h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0 0 0.6rem 0;
}

/* File Upload Styles */
.upload-form {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.file-input {
  padding: 0.6rem;
  border: 1px dashed #ff6600;
  border-radius: 6px;
  background: rgba(255, 102, 0, 0.05);
  color: #e0e0e0;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.file-input:hover {
  background: rgba(255, 102, 0, 0.1);
  border-color: #ff8533;
}

.upload-btn {
  background: linear-gradient(135deg, #ff6600 0%, #ff8533 100%);
  color: #fff;
  border: none;
  padding: 0.7rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.upload-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
}

.upload-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Shapes Grid */
.shapes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
}

.shape-btn {
  background: #253a52;
  border: 1px solid #2a2a2a;
  color: #b0b0b0;
  padding: 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.shape-btn:hover {
  border-color: #ff6600;
  background: #1a2942;
  color: #ff6600;
}

.shape-btn i {
  font-size: 1rem;
}

/* Color Control */
.color-control {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
  padding: 0.7rem;
  background: rgba(255, 214, 0, 0.08);
  border: 1px solid rgba(255, 214, 0, 0.2);
  border-radius: 6px;
}

.color-control label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffd600;
  margin: 0;
  white-space: nowrap;
}

.color-picker {
  width: 50px;
  height: 40px;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  cursor: pointer;
  padding: 2px;
}

.color-picker:hover {
  border-color: #ffd600;
}

/* AI Section Styles */
.ai-section {
  background: rgba(255, 102, 0, 0.05);
  border: 1px solid rgba(255, 102, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.4rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.8rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  background: #0f0f0f;
  color: #f8f8f8;
  font-size: 0.85rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #ff6600;
  box-shadow: 0 0 8px rgba(255, 102, 0, 0.2);
}

textarea.form-input {
  resize: vertical;
  font-family: 'Monaco', 'Courier New', monospace;
}

.generate-btn {
  width: 100%;
  background: linear-gradient(135deg, #ff6600 0%, #ff8533 100%);
  color: #fff;
  border: none;
  padding: 0.8rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.4rem;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 102, 0, 0.4);
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Template Buttons */
.template-buttons {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.6rem;
}

.template-btn {
  width: 100%;
  background: #1a2942;
  border: 1px solid #2a2a2a;
  color: #e0e0e0;
  padding: 0.7rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-btn:hover {
  background: #253a52;
  border-color: #ff6600;
  color: #ff6600;
}

/* Info Box */
.info-box {
  background: rgba(255, 102, 0, 0.08);
  border: 1px solid rgba(255, 102, 0, 0.2);
  border-radius: 6px;
  padding: 0.8rem;
  font-size: 0.85rem;
  color: #b0b0b0;
  line-height: 1.5;
}

.info-box h4 {
  margin: 0 0 0.4rem 0;
  color: #e0e0e0;
  font-size: 0.9rem;
}

.info-box p {
  margin: 0;
}

.info-box a {
  color: #ff6600;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.info-box a:hover {
  color: #ff8533;
}

/* Responsive */
@media (max-width: 1200px) {
  .writer-page {
    grid-template-columns: 1fr;
  }
  
  .tools-panel {
    max-height: 50vh;
  }
}

.assets-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.asset-item {
  aspect-ratio: 1;
  background: #0f172a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  overflow: hidden;
  cursor: grab;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.asset-item:hover {
  border-color: #ff6600;
  background: #0f172a;
  box-shadow: 0 0 12px rgba(255, 102, 0, 0.2);
  transform: scale(1.05);
}

.asset-item:active {
  cursor: grabbing;
}

.asset-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.template-btn {
  width: 100%;
  background: #1a2942;
  border: 1px solid #2a2a2a;
  color: #e0e0e0;
  padding: 0.8rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.6rem;
}

.template-btn:hover {
  background: #253a52;
  border-color: #ff6600;
  color: #ff6600;
}

.info-box {
  background: rgba(255, 102, 0, 0.08);
  border: 1px solid rgba(255, 102, 0, 0.2);
  border-radius: 6px;
  padding: 0.8rem;
  font-size: 0.85rem;
  color: #b0b0b0;
  line-height: 1.5;
}

.prompt-form,
.training-form {
  display: grid;
  gap: 0.55rem;
  margin-top: 0.65rem;
}

input,
textarea {
  width: 100%;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  background: #0f0f0f;
  color: #f8f8f8;
  padding: 0.62rem;
}

button {
  border: none;
  border-radius: 8px;
  background: #ffd600;
  color: #131313;
  font-weight: 700;
  cursor: pointer;
  padding: 0.62rem 0.9rem;
}

button.secondary {
  border: 1px solid #ffd600;
  background: transparent !important;
  color: #6d28d9 !important;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 1100px) {
  .writer-page {
    grid-template-columns: 1fr;
  }

  .assets-panel {
    max-height: none;
    border-top: 1px solid #2a2a2a;
  }
}

@media (max-width: 768px) {
  .assets-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .template-btn {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }

  .assets-panel {
    padding: 0.8rem;
  }
}
</style>