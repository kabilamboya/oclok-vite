<template>
<RteLayout :zoom="zoom">
<template #toolbar>
  <CreatorToolbar
    :initial-zoom="zoom"
    current-page="prompts"
    @zoom-change="handleZoomChange"
  />
</template>

<template #main>
<section class="prompt-training-page">

<!-- Practice & Tracking Columns -->
<div class="practice-tracking-row">

<div class="practice-col">
<h2>Draft Prompt</h2>
<label class="practice-label" for="practicePrompt">Prompt text</label>

<textarea
 id="practicePrompt"
 v-model="practicePrompt"
 class="practice-textarea"
 placeholder="Write your prompt here..."
 ></textarea>

<p class="practice-helper">Use the checklist on the right as you write.</p>

<div class="prompt-meta">
  <span class="count">{{ promptStats.words }} words / {{ promptStats.chars }} chars</span>
  <span class="save-indicator" role="status" aria-live="polite">{{ savedNotice }}</span>
</div>

<div class="inline-hints" aria-label="Live prompt hints">
  <span
    v-for="hint in inlineHints"
    :key="hint.id"
    class="hint"
    :class="{ ok: hint.ok }"
  >
    {{ hint.label }}: {{ hint.ok ? "OK" : "Add" }}
  </span>
</div>

<div class="practice-actions">

<button class="secondary-button" :disabled="isPromptEmpty" @click="analyzePrompt">
Analyze Prompt
</button>

<button class="secondary-button" :disabled="isPromptEmpty" @click="sendPracticeToWriter">
Use in Writer Studio
</button>

</div>

<div v-if="promptScore !== null" class="analysis-box">

<h3>Prompt Strength: {{ promptScore }}/5</h3>
<p v-if="lastAnalyzedAt" class="analysis-meta">Last analyzed: {{ lastAnalyzedAt }}</p>

<ul>
<li v-for="tip in promptFeedback" :key="tip">
Tip: {{ tip }}

</li>
</ul>

</div>
</div>

<div class="tracking-col">

<h2>Prompt Key Areas</h2>
<p class="live-summary">Live checks: {{ liveCheckCount }}/7 complete</p>

<ul class="tracking-list">
<li :class="{ done: liveChecks.role }">
  <strong>ROLE:</strong> Define perspective if needed
  <span class="status" :class="{ ok: liveChecks.role }">{{ liveChecks.role ? "OK" : "Add" }}</span>
</li>
<li :class="{ done: liveChecks.what }">
  <strong>WHAT:</strong> Specific task
  <span class="status" :class="{ ok: liveChecks.what }">{{ liveChecks.what ? "OK" : "Add" }}</span>
</li>
<li :class="{ done: liveChecks.how }">
  <strong>HOW:</strong> Tone, style, format
  <span class="status" :class="{ ok: liveChecks.how }">{{ liveChecks.how ? "OK" : "Add" }}</span>
</li>
<li :class="{ done: liveChecks.why }">
  <strong>WHY:</strong> Purpose & audience
  <span class="status" :class="{ ok: liveChecks.why }">{{ liveChecks.why ? "OK" : "Add" }}</span>
</li>
<li :class="{ done: liveChecks.where }">
  <strong>WHERE:</strong> Platform constraints
  <span class="status" :class="{ ok: liveChecks.where }">{{ liveChecks.where ? "OK" : "Add" }}</span>
</li>
<li :class="{ done: liveChecks.output }">
  <strong>OUTPUT:</strong> Expected structure
  <span class="status" :class="{ ok: liveChecks.output }">{{ liveChecks.output ? "OK" : "Add" }}</span>
</li>
<li :class="{ done: liveChecks.context }">
  <strong>CONTEXT:</strong> Supporting info
  <span class="status" :class="{ ok: liveChecks.context }">{{ liveChecks.context ? "OK" : "Add" }}</span>
</li>
</ul>

</div>
</div>

<!-- Hero -->
<!-- Hero moved to Cyber page -->
<!-- Framework -->

<div class="framework-header">
  <div>
    <h2>Prompt Framework</h2>
    <p class="framework-subtitle">Tap a step to expand the details.</p>
  </div>
  <button
    v-if="activeStepData"
    class="secondary-button collapse-button"
    type="button"
    @click="activeStep = null"
  >
    Collapse Details
  </button>
</div>

<div class="framework-container">
  <button
    v-for="(step, idx) in steps"
    :key="step.id"
    class="step-card"
    :class="{ active: activeStep === step.id }"
    type="button"
    @click="toggleStep(step.id)"
  >
    <div class="step-card-top">
      <span class="step-badge">{{ idx + 1 }}</span>
      <div class="step-text">
        <span class="step-label">{{ step.label }}</span>
        <h3>{{ step.title }}</h3>
      </div>
      <span class="step-expand">{{ activeStep === step.id ? "Hide" : "Expand" }}</span>
    </div>

    <p class="step-subtitle">{{ step.description }}</p>

    <div class="step-tags">
      <span v-for="item in step.whats.slice(0, 2)" :key="item" class="tag">
        {{ item }}
      </span>
      <span v-if="step.whats.length > 2" class="tag more">
        +{{ step.whats.length - 2 }} more
      </span>
    </div>
  </button>
</div>

<div v-if="activeStepData" class="step-detail">
  <div class="detail-header">
    <div class="detail-heading">
      <span class="step-badge detail-badge">{{ activeStepIndex + 1 }}</span>
      <div>
        <span class="detail-label">{{ activeStepData.label }}</span>
        <h3>{{ activeStepData.title }}</h3>
        <p class="detail-subtitle">{{ activeStepData.description }}</p>
      </div>
    </div>
    <button class="secondary-button collapse-button" type="button" @click="activeStep = null">
      Close
    </button>
  </div>

  <div class="detail-grid">
    <div class="detail-card">
      <h4>What to Include</h4>
      <ul>
        <li v-for="item in activeStepData.whats" :key="item">{{ item }}</li>
      </ul>
    </div>

    <div class="detail-card">
      <h4>Example</h4>
      <pre class="example-code">{{ activeStepData.example }}</pre>
    </div>

    <div class="detail-card">
      <h4>Common Mistakes</h4>
      <ul class="mistakes">
        <li v-for="mistake in activeStepData.mistakes" :key="mistake">
          Avoid: {{ mistake }}
        </li>
      </ul>
    </div>
  </div>

  <div class="best-practice">
    <p>Best: {{ activeStepData.bestPractice }}</p>
  </div>
</div>

<!-- Template -->

<section class="template-section">

<h2>Complete Prompt Template</h2>

<p class="section-subtitle">
Use this structure for any AI task
</p>

<div class="template-box">
<pre>{{ fullTemplate }}</pre>
</div>

<button class="cta-button" @click="copyTemplate">
{{ copied ? "Copied!" : "Copy Template" }}

</button>

</section>

<!-- Examples -->

<section class="examples-section">

<h2>Real-World Prompt Examples</h2>

<div class="examples-grid">

<article
v-for="example in promptExamples"
:key="example.id"
class="example-card"
>

<h3>{{ example.title }}</h3>

<p class="use-case">
For: {{ example.useCase }}
</p>

<div class="example-prompt">
<strong>Prompt:</strong>
<pre>{{ example.prompt }}</pre>
</div>

<div class="example-result">
<strong>Expected Output:</strong>
<p>{{ example.expectedOutput }}</p>
</div>

<div class="example-actions">
  <button class="secondary-button" @click="loadExample(example)">
    Load to Practice
  </button>
  <button class="secondary-button" @click="useExample(example)">
    Open in Writer
  </button>
</div>

</article>

</div>

</section>

<!-- Checklist -->

<section class="reference-section">

<h2>Quick Prompt Checklist</h2>

<div class="checklist">

<label
v-for="item in checklist"
:key="item"
class="checklist-item"
>

<input type="checkbox" />
<span>{{ item }}</span>

</label>

</div>

</section>

</section>
</template>
</RteLayout>
</template>

<script setup>

import { ref, watch, onMounted, computed } from "vue"
import CreatorToolbar from "@/components/TopToolbar.vue"
import RteLayout from "@/layouts/RteLayout.vue"

const practicePrompt = ref("")
const copied = ref(false)
const zoom = ref(100)
const savedNotice = ref("")
const lastAnalyzedAt = ref("")

const activeStep = ref(null)

const promptScore = ref(null)
const promptFeedback = ref([])

const isPromptEmpty = computed(() => !practicePrompt.value.trim())

const promptStats = computed(() => {
  const text = practicePrompt.value.trim()
  const words = text ? text.split(/\s+/).length : 0
  return {
    words,
    chars: practicePrompt.value.length
  }
})

const liveChecks = computed(() => {
  const text = practicePrompt.value.toLowerCase()
  return {
    role: /(as a|you are|act as|role)/.test(text),
    what: /(write|create|generate|draft|summarize|design|analyze)/.test(text),
    how: /(tone|style|format|length|voice|structure|bullet|table)/.test(text),
    why: /(goal|purpose|objective|audience|target)/.test(text),
    where: /(platform|instagram|email|blog|twitter|linkedin|facebook|tiktok|website)/.test(text),
    output: /(provide|list|give|deliver|return|output|options|variants|\b\d+\b)/.test(text),
    context: /(context|background|details|information|notes|given|requirements)/.test(text)
  }
})

const inlineHints = computed(() => [
  { id: "what", label: "Action verb", ok: liveChecks.value.what },
  { id: "how", label: "Tone or style", ok: liveChecks.value.how },
  { id: "why", label: "Audience or goal", ok: liveChecks.value.why },
  { id: "where", label: "Platform", ok: liveChecks.value.where },
  { id: "output", label: "Output shape", ok: liveChecks.value.output },
  { id: "context", label: "Context", ok: liveChecks.value.context },
  { id: "role", label: "Role", ok: liveChecks.value.role }
])

const liveCheckCount = computed(() => {
  return Object.values(liveChecks.value).filter(Boolean).length
})


/* Autosave Prompt */

onMounted(() => {

const savedPrompt = localStorage.getItem("practice_prompt")

if(savedPrompt){
practicePrompt.value = savedPrompt
}

})

let saveTimer
watch(practicePrompt,(val)=>{

localStorage.setItem("practice_prompt",val)
savedNotice.value = "Saved"
clearTimeout(saveTimer)
saveTimer = setTimeout(() => {
  savedNotice.value = ""
}, 1500)

})

/* Prompt Analyzer */

const analyzePrompt = ()=>{

const text = practicePrompt.value.toLowerCase()

let score = 0
let feedback = []

if(text.includes("write")||text.includes("create")||text.includes("generate")){
score++
}else{
feedback.push("Start with a clear action like Write, Create, Generate.")
}

if(text.includes("tone")||text.includes("style")){
score++
}else{
feedback.push("Add tone or style guidance.")
}

if(text.includes("audience")||text.includes("target")){
score++
}else{
feedback.push("Mention the target audience.")
}

if(text.includes("provide")||text.includes("list")||text.includes("give")){
score++
}else{
feedback.push("Specify output quantity or structure.")
}

if(text.length>60){
score++
}else{
feedback.push("Add more context for stronger prompts.")
}

promptScore.value = score
promptFeedback.value = feedback
lastAnalyzedAt.value = new Date().toLocaleString()

}

const handleZoomChange = (newZoom) => {
  zoom.value = newZoom
}

/* Copy Template */

const copyTemplate = async()=>{

await navigator.clipboard.writeText(fullTemplate)

copied.value=true

setTimeout(()=>{
copied.value=false
},2000)

}

/* Send Prompt to Writer */

const sendPracticeToWriter = ()=>{

if(!practicePrompt.value.trim()){
return
}

localStorage.setItem("current_prompt",practicePrompt.value)

window.location.href="/cyber/writer"

}

/* Example Prompt */

const useExample = (example)=>{

localStorage.setItem("current_prompt",example.prompt)

window.location.href="/cyber/writer"

}

const loadExample = (example)=>{
practicePrompt.value = example.prompt
window.scrollTo({ top: 0, behavior: "smooth" })
}

/* Prompt Framework */

const steps = [

{
id:"what",
label:"WHAT",
title:"Define the Task",
description:"Clearly state what you want the AI to do",
whats:[
"Specific action (write, create, analyze)",
"Output expectations",
"Key requirements"
],
example:"Write a 3-line Instagram caption for a delivery service targeting young professionals.",
mistakes:[
"Vague tasks",
"Multiple unrelated requests",
"No format specified"
],
bestPractice:"Start prompts with a clear action verb."
},

{
id:"how",
label:"HOW",
title:"Specify Style",
description:"Define tone and structure",
whats:[
"Tone (professional, playful)",
"Length",
"Structure"
],
example:"Use a playful tone and keep under 120 characters.",
mistakes:[
"Generic instructions",
"No formatting rules"
],
bestPractice:"Be explicit about style and format."
},

{
id:"why",
label:"WHY",
title:"Give Context",
description:"Explain purpose and audience",
whats:[
"Goal",
"Audience",
"Expected outcome"
],
example:"Goal: Increase app downloads among working professionals.",
mistakes:[
"No audience",
"No objective"
],
bestPractice:"Explain why the prompt matters."
},

{
id:"where",
label:"WHERE",
title:"Platform",
description:"Specify the environment",
whats:[
"Platform (Instagram, blog, email)",
"Brand guidelines",
"Constraints"
],
example:"For Instagram posts using O!clok brand voice.",
mistakes:[
"No platform context"
],
bestPractice:"Mention the publishing environment."
},

{
id:"output",
label:"OUTPUT",
title:"Deliverables",
description:"Define what you want returned",
whats:[
"Format",
"Quantity",
"Sections"
],
example:"Provide 3 caption options with hook and CTA.",
mistakes:[
"Undefined output"
],
bestPractice:"Specify format and quantity."
}

]

const activeStepData = computed(() =>
  steps.find((step) => step.id === activeStep.value) || null
)

const activeStepIndex = computed(() =>
  steps.findIndex((step) => step.id === activeStep.value)
)

const toggleStep = (stepId) => {
  activeStep.value = activeStep.value === stepId ? null : stepId
}

/* Prompt Template */

const fullTemplate = `ROLE: [Optional]

WHAT: Write/Create [task]

HOW: Use [tone/style]. Length [limit]. Format [structure].

WHY: Goal [objective]. Audience [target].

WHERE: Platform [channel]. Brand rules [guidelines].

OUTPUT: Provide [number] options structured as [format].

CONTEXT: [Additional background]`

/* Examples */

const promptExamples=[

{
id:1,
title:"Campaign Caption",
useCase:"Instagram marketing",
prompt:"Create 3 Instagram captions for a delivery service targeting young professionals. Use playful tone and include one emoji.",
expectedOutput:"Engaging captions that drive clicks."
},

{
id:2,
title:"Product Description",
useCase:"E-commerce",
prompt:"Write a 50 word product description for a robot vacuum targeting busy professionals.",
expectedOutput:"Short persuasive description."
},

{
id:3,
title:"Email Subject Lines",
useCase:"Email marketing",
prompt:"Generate 5 email subject lines promoting a tech podcast.",
expectedOutput:"Curiosity driven subject lines."
}

]

/* Checklist */

const checklist=[

"Task clearly defined",
"Tone specified",
"Audience mentioned",
"Goal explained",
"Platform defined",
"Output format specified",
"Context provided"

]

</script>

<style scoped>

.prompt-training-page{
max-width:1200px;
margin:auto;
padding:40px 20px;
background:linear-gradient(135deg,#0f172a,#1e293b);
color:#f1f5f9;
font-family:'Poppins',sans-serif;
}

.practice-tracking-row{
display:flex;
gap:30px;
margin-bottom:40px;
}

.practice-col,.tracking-col{
flex:1;
background:rgba(30,41,59,0.8);
border-radius:14px;
padding:20px;
}

.practice-label{
display:block;
margin-bottom:6px;
font-weight:600;
color:#e2e8f0;
}

.tracking-col{
position:sticky;
top:20px;
height:fit-content;
}

.practice-textarea{
width:100%;
min-height:120px;
background:#1e293b;
border:1px solid #7c3aed;
border-radius:8px;
padding:12px;
color:white;
}

.practice-textarea:focus{
outline:none;
border-color:#ff6b00;
box-shadow:0 0 0 2px rgba(255,107,0,0.2);
}

.practice-helper{
margin:8px 0 6px;
color:#cbd5f5;
font-size:0.95rem;
}

.prompt-meta{
display:flex;
align-items:center;
justify-content:space-between;
gap:12px;
margin-bottom:10px;
color:#cbd5f5;
font-size:0.9rem;
}

.inline-hints{
display:flex;
flex-wrap:wrap;
gap:8px;
margin:6px 0 14px;
}

.hint{
font-size:0.78rem;
padding:4px 8px;
border-radius:999px;
background:rgba(15,23,42,0.6);
border:1px solid rgba(148,163,184,0.35);
color:#cbd5f5;
letter-spacing:0.02em;
}

.hint.ok{
background:rgba(34,197,94,0.15);
border-color:#22c55e;
color:#86efac;
}

.save-indicator{
min-height:1em;
color:#7dd3fc;
}

.practice-actions{
display:flex;
gap:10px;
margin-top:10px;
flex-wrap:wrap;
}

.analysis-box{
margin-top:15px;
padding:12px;
background:rgba(255,255,255,0.05);
border-left:4px solid #ff6b00;
border-radius:6px;
}

.analysis-meta{
margin:6px 0 0;
color:#cbd5f5;
font-size:0.85rem;
}

.live-summary{
margin:6px 0 12px;
color:#cbd5f5;
font-size:0.9rem;
}

.tracking-list{
list-style:none;
padding:0;
margin:0;
display:flex;
flex-direction:column;
gap:8px;
}

.tracking-list li{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:12px;
  background:rgba(15,23,42,0.6);
  padding:8px 10px;
  border-radius:8px;
  border:1px solid rgba(124,58,237,0.3);
  flex-wrap:wrap;
}

.tracking-list li.done{
  border-color:#22c55e;
}

.tracking-list strong{
  flex:1;
  min-width:160px;
}

.tracking-list .status{
  margin-left:auto;
}

.status{
  font-size:0.75rem;
  padding:2px 8px;
  border-radius:999px;
  background:#111827;
border:1px solid rgba(148,163,184,0.4);
color:#cbd5f5;
text-transform:uppercase;
  letter-spacing:0.05em;
}

.status.ok{
background:rgba(34,197,94,0.15);
border-color:#22c55e;
color:#86efac;
}

.hero{
text-align:center;
margin-bottom:50px;
}

.hero h1{
font-size:3rem;
font-weight:800;
background:linear-gradient(90deg,#ff6b00,#39ff14);
-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
}

.framework-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  margin-bottom:16px;
}

.framework-subtitle{
  margin:6px 0 0;
  color:#cbd5f5;
  font-size:0.95rem;
}

.framework-container{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:14px;
  margin-bottom:20px;
}

.step-badge{
  width:30px;
  height:30px;
  border-radius:10px;
  display:grid;
  place-items:center;
  font-size:0.8rem;
  font-weight:700;
  color:#ffd699;
  background:rgba(255,107,0,0.15);
  border:1px solid rgba(255,107,0,0.4);
  flex-shrink:0;
}

.step-card{
  background:rgba(30,41,59,0.8);
  border:1px solid rgba(124,58,237,0.5);
  border-radius:12px;
  padding:14px;
  cursor:pointer;
  text-align:left;
  width:100%;
  color:inherit;
  font-family:inherit;
  appearance:none;
  transition:transform 0.2s ease,border-color 0.2s ease,box-shadow 0.2s ease;
}

.step-card:hover{
  transform:translateY(-2px);
  border-color:#ff6b00;
  box-shadow:0 10px 30px rgba(0,0,0,0.25);
}

.step-card.active{
  border-color:#ff6b00;
  box-shadow:0 0 0 1px rgba(255,107,0,0.6);
}

.step-card:focus-visible{
  outline:none;
  box-shadow:0 0 0 3px rgba(255,107,0,0.35);
}

.step-card-top{
  display:flex;
  align-items:flex-start;
  gap:10px;
}

.step-text{
  flex:1;
  min-width:0;
}

.step-label{
  font-size:0.7rem;
  letter-spacing:0.28em;
  color:#cbd5f5;
  font-weight:700;
}

.step-card h3{
  margin:4px 0 0;
  font-size:1rem;
  color:#f8fafc;
}

.step-expand{
  font-size:0.75rem;
  color:#a78bfa;
  font-weight:600;
  margin-left:auto;
}

.step-subtitle{
  margin:8px 0 10px;
  color:#cbd5f5;
  font-size:0.9rem;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  overflow:hidden;
}

.step-tags{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
}

.tag{
  font-size:0.72rem;
  padding:4px 8px;
  border-radius:999px;
  background:rgba(15,23,42,0.6);
  border:1px solid rgba(148,163,184,0.35);
  color:#cbd5f5;
}

.tag.more{
  border-style:dashed;
  color:#fbbf24;
}

.step-detail{
  background:rgba(15,23,42,0.7);
  border:1px solid rgba(124,58,237,0.4);
  border-radius:14px;
  padding:18px;
  margin-bottom:40px;
}

.detail-header{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:16px;
  margin-bottom:14px;
}

.detail-heading{
  display:flex;
  gap:12px;
  align-items:flex-start;
}

.detail-label{
  font-size:0.72rem;
  letter-spacing:0.28em;
  color:#cbd5f5;
  font-weight:700;
  display:block;
}

.detail-subtitle{
  margin:6px 0 0;
  color:#cbd5f5;
  font-size:0.95rem;
}

.detail-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:14px;
  margin-top:10px;
}

.detail-card{
  background:rgba(30,41,59,0.85);
  border-radius:12px;
  padding:14px;
  border:1px solid rgba(148,163,184,0.2);
}

.detail-card h4{
  margin:0 0 10px;
  font-size:0.95rem;
  color:#f8fafc;
}

.detail-badge{
  width:32px;
  height:32px;
  display:grid;
  place-items:center;
  font-size:0.85rem;
}

.collapse-button{
  white-space:nowrap;
}

.example-code{
  background:#0f172a;
  padding:10px;
  border-radius:6px;
  color:#a78bfa;
  white-space:pre-wrap;
  word-break:break-word;
}

.best-practice{
  margin-top:14px;
  padding:10px 12px;
  border-left:3px solid #ff6b00;
  border-radius:8px;
  background:rgba(255,107,0,0.08);
}

.best-practice p{
  margin:0;
  color:#fde68a;
}

.examples-grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
gap:20px;
}

.example-card{
  background:rgba(30,41,59,0.8);
  padding:20px;
  border-radius:12px;
  word-break:break-word;
}

.example-actions{
display:flex;
flex-wrap:wrap;
gap:10px;
margin-top:12px;
}

.cta-button{
background:linear-gradient(135deg,#ff6b00,#ff8c00);
color:white;
padding:12px 24px;
border:none;
border-radius:8px;
cursor:pointer;
}

.secondary-button{
padding:10px;
border:1px solid #7c3aed;
background:transparent;
color:#a78bfa;
border-radius:6px;
cursor:pointer;
}

.secondary-button:disabled{
  opacity:0.5;
  cursor:not-allowed;
}

.template-box{
  background:rgba(15,23,42,0.7);
  border:1px solid rgba(124,58,237,0.35);
  border-radius:12px;
  padding:14px;
  overflow:auto;
}

.template-box pre,
.example-prompt pre{
  margin:0;
  white-space:pre-wrap;
  word-break:break-word;
  color:#cbd5f5;
}

.checklist{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
gap:10px;
}

@media (max-width: 900px){
  .practice-tracking-row{
    flex-direction:column;
  }

  .tracking-col{
    position:static;
  }

  .framework-header{
    flex-direction:column;
    align-items:flex-start;
  }

  .detail-header{
    flex-direction:column;
    align-items:flex-start;
  }
}

@media (max-width: 600px){
  .prompt-training-page{
    padding:24px 14px;
  }

  .practice-actions{
    flex-direction:column;
    align-items:stretch;
  }

  .secondary-button,
  .cta-button{
    width:100%;
  }
}

</style>
