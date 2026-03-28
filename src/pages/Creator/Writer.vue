<template>
  <div class="writer-container">
    <RteLayout :zoom="zoom" columns="minmax(0, 2.2fr) minmax(260px, 0.6fr)">
      <template #toolbar>
        <!-- Shared Toolbar with Zoom -->
        <CreatorToolbar
          :initial-zoom="zoom"
          :editor-content="getEditorText()"
          current-page="writer"
          @zoom-change="handleZoomChange"
          @tool-selected="handleToolSelected"
          @draft-saved="handleDraftSaved"
        />
      </template>

      <template #main>
        <CreatorEditor
          ref="editorRef"
          class="panel editor-panel"
          title="Writing Canvas with Rich Text Edotor"
          subtitle="For AI scripts, campaign drafts, and professional content generation."
          placeholder="Start writing your AI script or campaign content here..."
          :show-actions="false"
        />
      </template>

      <template #aside>
        <div class="panel tools-panel">
          <div class="panel-header">
            <h2>Imports & Templates</h2>
            <p class="muted">Bring in files and quick-start copy</p>
          </div>

          <div class="section-container">
            <h3>Draft Actions</h3>
            <div class="draft-actions">
              <button class="draft-btn primary" @click="handleSaveDraft">
                <i class="fas fa-save"></i> Save Draft
              </button>
              <button class="draft-btn" @click="handleCopyDraft">
                <i class="fas fa-copy"></i> Copy Draft
              </button>
              <button class="draft-btn ghost" @click="handleClearDraft">
                <i class="fas fa-eraser"></i> Clear
              </button>
            </div>
          </div>

          <div class="section-container">
            <h3>File Upload</h3>
            <p class="muted">Import text files into your editor</p>
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

          <div class="section-container">
            <h3>Quick Templates</h3>
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
        </div>
      </template>
    </RteLayout>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import CreatorEditor from '@/components/CreatorEditor.vue';
import CreatorToolbar from '@/components/TopToolbar.vue';
import RteLayout from '@/layouts/RteLayout.vue';
import { getLocalUserId } from '@/lib/localStore';

const editorRef = ref(null);
const zoom = ref(100);
const fileInput = ref(null);
const selectedFile = ref(null);
const uploading = ref(false);

const templates = {
  email: `Subject: [Your Subject Here]

Hi [Name],

[Your message here]

Best regards,
[Your Name]`,
  social: `[Hook or attention-grabber]

[Main message - 2-3 lines]

[Call-to-action]

#oclok #[relevant hashtags]`,
  script: `[SCENE DESCRIPTION]

CHARACTER: [Dialogue here]

[Action or description]

CHARACTER: [Response]`,
};

const onFileSelected = (event) => {
  selectedFile.value = event.target.files?.[0] || null;
};

const handleFileUpload = async () => {
  if (!selectedFile.value) return;

  uploading.value = true;
  try {
    const text = await selectedFile.value.text();
    editorRef.value?.insertContent?.(text);

    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = '';
  } catch (error) {
    console.error('Error reading file:', error);
    alert('Error reading file. Please try again.');
  } finally {
    uploading.value = false;
  }
};

const getEditorText = () => editorRef.value?.getText() || "";

const handleSaveDraft = () => {
  const content = getEditorText();
  const draftData = {
    content,
    page: "writer",
    timestamp: new Date().toISOString(),
    zoom: zoom.value
  };
  localStorage.setItem("creator_draft_writer", JSON.stringify(draftData));
  handleDraftSaved(draftData);
};

const handleCopyDraft = () => {
  editorRef.value?.copyDraft?.();
};

const handleClearDraft = () => {
  editorRef.value?.clearDraft?.();
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
  if (typeof document !== "undefined") {
    document.body.classList.add("writer-single-scroll");
  }
});

onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.body.classList.remove("writer-single-scroll");
  }
});
</script>

<style scoped>

.writer-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel {
  background: #161616;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 0.85rem;
  min-height: 0;
}

.editor-panel {
  width: 100%;
  max-width: 980px;
}

.tools-panel {
  border-left: 1px solid #2a2a2a;
  padding: 1.2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 8px;
}

.panel-header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #2a2a2a;
}

.panel-header h2 {
  font-size: 1rem;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
}

.muted {
  color: #9ca3af;
  margin: 0;
  font-size: 0.85rem;
}

.section-container {
  margin-bottom: 1.4rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 102, 0, 0.1);
}

.section-container:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-container h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0 0 0.6rem 0;
}

.draft-actions {
  display: grid;
  gap: 0.6rem;
}

.draft-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem;
  border-radius: 6px;
  border: 1px solid #2a2a2a;
  background: #1a2942;
  color: #e0e0e0;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.draft-btn:hover {
  background: #253a52;
  border-color: var(--primary-orange);
  color: var(--primary-orange);
}

.draft-btn.primary {
  background: var(--primary-orange);
  border-color: var(--primary-orange-border);
  color: var(--text-white);
}

.draft-btn.primary:hover {
  background: var(--primary-orange-hover);
  color: var(--text-white);
}

.draft-btn.ghost {
  background: transparent;
  border-color: var(--secondary-teal-border);
  color: var(--secondary-teal);
}

.draft-btn.ghost:hover {
  background: rgba(15, 157, 138, 0.15);
  border-color: var(--secondary-teal);
  color: var(--text-white);
}

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

@media (max-width: 1200px) {
  .tools-panel {
    max-height: 50vh;
    border-left: none;
    border-top: 1px solid #2a2a2a;
  }
}
</style>
