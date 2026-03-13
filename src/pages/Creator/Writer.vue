<template>
  <section class="writer-page">
    <CreatorEditor
      ref="editorRef"
      class="panel"
      title="Writing Canvas"
      subtitle="Built-in rich text editor for campaign drafts, scripts, and social copy."
      placeholder="Start writing your campaign content here..."
      :assets="assets"
      asset-title="Assets"
      use-draft-label="Use Draft For Training"
      @use-draft="applyDraftToTraining"
    />

    <div class="panel controls-panel">
      <h2>AI Prompt Studio</h2>
      <p class="muted">Generate campaign-ready prompts and feed outcomes back to training.</p>

      <form class="prompt-form" @submit.prevent="onGenerate">
        <input v-model="form.brandName" type="text" placeholder="Brand name" required />
        <input v-model="form.campaignGoal" type="text" placeholder="Campaign goal" required />
        <input v-model="form.audience" type="text" placeholder="Target audience" />
        <input v-model="form.tone" type="text" placeholder="Tone (e.g. premium, playful, direct)" />
        <input v-model="form.platform" type="text" placeholder="Platform (e.g. Instagram, TikTok, Web)" />
        <input v-model="form.keywords" type="text" placeholder="Keywords separated by commas" />
        <textarea v-model="form.context" rows="4" placeholder="Extra brand context"></textarea>
        <button type="submit" :disabled="generating">{{ generating ? 'Generating...' : 'Generate Prompt' }}</button>
      </form>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <article v-if="result" class="result">
        <h3>Generated Master Prompt</h3>
        <pre>{{ result.prompt }}</pre>

        <button class="secondary" type="button" @click="insertResultIntoEditor">Load Prompt Into Canvas</button>

        <h4>Prompt Variations</h4>
        <ul>
          <li v-for="variation in result.variations" :key="variation">{{ variation }}</li>
        </ul>

        <h4>Suggested Assets</h4>
        <div class="chips">
          <span v-for="asset in result.suggestedAssets" :key="asset">{{ asset }}</span>
        </div>
      </article>

      <h3>Training and Usage</h3>
      <form class="training-form" @submit.prevent="onSaveTraining">
        <textarea
          v-model="training.preferredOutput"
          rows="4"
          placeholder="Paste your improved output to train future prompts"
          required
        ></textarea>
        <input v-model="training.tags" type="text" placeholder="Training tags separated by commas" />
        <input v-model="training.notes" type="text" placeholder="Notes (optional)" />
        <input v-model.number="training.rating" type="number" min="1" max="5" />
        <button type="submit" :disabled="savingTraining || !result">
          {{ savingTraining ? 'Saving...' : 'Save Training Example' }}
        </button>
      </form>

      <div class="usage-grid">
        <div>
          <h4>Total Prompts</h4>
          <p class="metric">{{ usage.totalPrompts }}</p>
        </div>
        <div>
          <h4>Top Brands</h4>
          <ul>
            <li v-for="item in topBrands" :key="item.name">{{ item.name }} ({{ item.count }})</li>
            <li v-if="topBrands.length === 0">No usage yet</li>
          </ul>
        </div>
      </div>

      <h4>Recent Training Samples</h4>
      <ul class="training-list">
        <li v-for="sample in trainingList" :key="sample.id">
          <strong>{{ sample.tags?.join(', ') || 'No tags' }}</strong>
          <p>{{ sample.preferred_output || sample.preferredOutput }}</p>
        </li>
        <li v-if="trainingList.length === 0">No training samples yet</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import CreatorEditor from '@/components/CreatorEditor.vue';
import {
  generateBrandPrompt,
  getPromptUsageSummary,
  listPromptTraining,
  savePromptTraining,
} from '@/services/cyber.service';
import { getLocalUserId } from '@/lib/localStore';

const userId = ref(null);
const generating = ref(false);
const savingTraining = ref(false);
const errorMessage = ref('');
const editorRef = ref(null);

const form = reactive({
  brandName: '',
  campaignGoal: '',
  audience: '',
  tone: '',
  platform: '',
  keywords: '',
  context: '',
});

const training = reactive({
  preferredOutput: '',
  tags: '',
  notes: '',
  rating: 5,
});

const result = ref(null);
const trainingList = ref([]);
const usage = ref({
  totalPrompts: 0,
  topBrands: {},
  recent: [],
});

const topBrands = computed(() =>
  Object.entries(usage.value.topBrands || {})
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5),
);

const resolveGuestUserId = () => getLocalUserId("cyber_guest_user_id");

const tagsFrom = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const assets = [
  { id: "logo", name: "Oclok Logo", url: "/images/oclokLogo.png" },
  { id: "tshirt", name: "Tshirt Mockup", url: "/mockups/tshirt.png" },
  { id: "cyber", name: "Cyber", url: "/images/cyber.png" },
];

const getEditorText = () => editorRef.value?.getText() || "";

const copyDraft = async () => {
  if (!editorRef.value?.copyDraft) return;
  await editorRef.value.copyDraft();
};

const clearDraft = () => {
  editorRef.value?.clearDraft?.();
};

const applyDraftToTraining = (text) => {
  training.preferredOutput = text ?? getEditorText();
};

const insertResultIntoEditor = () => {
  if (!result.value?.prompt) return;
  editorRef.value?.setText?.(result.value.prompt);
};

const handleHeaderCopy = () => {
  copyDraft();
};

const handleHeaderClear = () => {
  clearDraft();
};

const registerHeaderActions = () => {
  if (typeof window === "undefined") return;
  window.addEventListener("cyber:writer-copy", handleHeaderCopy);
  window.addEventListener("cyber:writer-clear", handleHeaderClear);
};

const unregisterHeaderActions = () => {
  if (typeof window === "undefined") return;
  window.removeEventListener("cyber:writer-copy", handleHeaderCopy);
  window.removeEventListener("cyber:writer-clear", handleHeaderClear);
};

const onGenerate = async () => {
  generating.value = true;
  errorMessage.value = '';

  try {
    result.value = await generateBrandPrompt({
      ...form,
      userId: userId.value,
      keywords: tagsFrom(form.keywords),
    });
    await refreshUsage();
  } catch (error) {
    errorMessage.value = error.message || 'Unable to generate prompt';
  } finally {
    generating.value = false;
  }
};

const onSaveTraining = async () => {
  if (!result.value) return;
  savingTraining.value = true;
  errorMessage.value = '';

  try {
    const saved = await savePromptTraining({
      userId: userId.value,
      inputPrompt: result.value.prompt,
      preferredOutput: training.preferredOutput,
      tags: tagsFrom(training.tags),
      notes: training.notes,
      rating: training.rating,
    });

    trainingList.value = [saved, ...trainingList.value].slice(0, 20);
    training.preferredOutput = '';
    training.tags = '';
    training.notes = '';
    training.rating = 5;
  } catch (error) {
    errorMessage.value = error.message || 'Unable to save training example';
  } finally {
    savingTraining.value = false;
  }
};

const refreshTraining = async () => {
  try {
    trainingList.value = await listPromptTraining();
  } catch {
    trainingList.value = [];
  }
};

const refreshUsage = async () => {
  try {
    usage.value = await getPromptUsageSummary();
  } catch {
    usage.value = { totalPrompts: 0, topBrands: {}, recent: [] };
  }
};

onMounted(async () => {
  userId.value = resolveGuestUserId();
  await Promise.all([refreshTraining(), refreshUsage()]);
  registerHeaderActions();
});

onBeforeUnmount(() => {
  unregisterHeaderActions();
});
</script>

<style scoped>
.writer-page {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.5fr);
  gap: 0.9rem;
}

.panel {
  background: #161616;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 0.85rem;
  min-height: 0;
}

.muted {
  color: #9ca3af;
  margin: 0.2rem 0 0;
}

.controls-panel {
  overflow: auto;
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

.result {
  margin-top: 0.9rem;
  border-top: 1px solid #2a2a2a;
  padding-top: 0.9rem;
}

pre {
  white-space: pre-wrap;
  background: #0f0f0f;
  border: 1px solid #303030;
  border-radius: 8px;
  padding: 0.7rem;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.chips span {
  font-size: 0.82rem;
  border: 1px solid #3a3a3a;
  border-radius: 999px;
  padding: 0.35rem 0.65rem;
}

.usage-grid {
  margin-top: 0.9rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.metric {
  font-size: 1.45rem;
  font-weight: 800;
  color: #ffd600;
}

.training-list {
  margin-top: 0.75rem;
  display: grid;
  gap: 0.55rem;
  list-style: none;
  padding: 0;
}

.training-list li {
  border: 1px solid #2f2f2f;
  border-radius: 8px;
  padding: 0.62rem;
  background: #111111;
}

.error {
  color: #fca5a5;
  margin-top: 0.8rem;
}

@media (max-width: 1100px) {
  .writer-page {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .usage-grid {
    grid-template-columns: 1fr;
  }
}
</style>
