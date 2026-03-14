<template>
  <section class="prompt-training-page">
    <!-- Practice & Tracking Columns -->
    <div class="practice-tracking-row">
      <!-- Practice Area -->
      <div class="practice-col">
        <h2>Practice Your Prompt</h2>
        <textarea v-model="practicePrompt" class="practice-textarea" placeholder="Write your prompt here..." />
      </div>
      <!-- Tracking Area -->
      <div class="tracking-col">
        <h2>Prompt Key Areas</h2>
        <ul class="tracking-list">
          <li><strong>ROLE:</strong> [Your role if needed]</li>
          <li><strong>WHAT:</strong> [Specific task]</li>
          <li><strong>HOW:</strong> [Tone, style, format, length]</li>
          <li><strong>WHY:</strong> [Purpose, audience, goal]</li>
          <li><strong>WHERE:</strong> [Platform, brand rules, constraints]</li>
          <li><strong>OUTPUT:</strong> [Format, quantity, sections]</li>
          <li><strong>CONTEXT:</strong> [Background, references]</li>
        </ul>
      </div>
    </div>
    <!-- Hero Section -->
    <div class="hero">
      <h1>AI Prompt Mastery</h1>
      <p>Learn to write powerful prompts using a proven 5-step framework</p>
    </div>

    <!-- Main Framework -->
    <div class="framework-container">
      <article v-for="(step, idx) in steps" :key="step.id" class="step-card" :class="{ active: activeStep === step.id }" @click="activeStep = step.id">
        <div class="step-badge">{{ idx + 1 }}</div>
        <h2>{{ step.title }}</h2>
        <p class="step-subtitle">{{ step.description }}</p>

        <!-- Expanded Content -->
        <div v-if="activeStep === step.id" class="step-content">
          <h3>What to Include:</h3>
          <ul>
            <li v-for="item in step.whats" :key="item">{{ item }}</li>
          </ul>

          <h3>{{ step.title }} Example:</h3>
          <pre class="example-code">{{ step.example }}</pre>

          <h3>Common Mistakes:</h3>
          <ul class="mistakes">
            <li v-for="mistake in step.mistakes" :key="mistake">❌ {{ mistake }}</li>
          </ul>

          <h3>Best Practice:</h3>
          <div class="best-practice">
            <p>✅ {{ step.bestPractice }}</p>
          </div>
        </div>
      </article>
    </div>

    <!-- Full Prompt Template -->
    <section class="template-section">
      <h2>Complete Prompt Template</h2>
      <p class="section-subtitle">Use this structure for any AI task</p>

      <div class="template-box">
        <pre>{{ fullTemplate }}</pre>
      </div>

      <button class="cta-button" @click="copyTemplate">📋 Copy Template</button>
    </section>

    <!-- Prompt Examples by Use Case -->
    <section class="examples-section">
      <h2>Real-World Prompt Examples</h2>
      
      <div class="examples-grid">
        <article v-for="example in promptExamples" :key="example.id" class="example-card">
          <h3>{{ example.title }}</h3>
          <p class="use-case">For: {{ example.useCase }}</p>
          
          <div class="example-prompt">
            <strong>Prompt:</strong>
            <pre>{{ example.prompt }}</pre>
          </div>

          <div class="example-result">
            <strong>Expected Output:</strong>
            <p>{{ example.expectedOutput }}</p>
          </div>

          <button class="secondary-button" @click="useExample(example)">Use This Prompt</button>
        </article>
      </div>
    </section>

    <!-- Quick Reference -->
    <section class="reference-section">
      <h2>Quick Reference Checklist</h2>
      <div class="checklist">
        <label v-for="item in checklist" :key="item" class="checklist-item">
          <input type="checkbox" />
          <span>{{ item }}</span>
        </label>
      </div>
    </section>

    <!-- AI Script Generation Section -->
    <section class="ai-generator-section">
      <h2>🤖 AI Script Generator</h2>
      <p class="section-subtitle">Generate scripts for various media using your prompts</p>
      
      <div class="generator-form">
        <div class="form-group">
          <label for="script-type">Script Type:</label>
          <select v-model="aiScript.type" id="script-type" class="form-input">
            <option value="video">Video Script</option>
            <option value="podcast">Podcast Script</option>
            <option value="ad">Advertisement Script</option>
            <option value="social">Social Media Script</option>
            <option value="email">Email Copy</option>
            <option value="sales">Sales Pitch</option>
          </select>
        </div>

        <div class="form-group">
          <label for="script-topic">Topic/Idea:</label>
          <textarea 
            v-model="aiScript.topic" 
            id="script-topic"
            class="form-input"
            rows="3"
            placeholder="Describe what you want to write about..."
          ></textarea>
        </div>

        <div class="form-group">
          <label for="script-tone">Tone:</label>
          <select v-model="aiScript.tone" id="script-tone" class="form-input">
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="energetic">Energetic</option>
            <option value="informative">Informative</option>
            <option value="humorous">Humorous</option>
            <option value="persuasive">Persuasive</option>
          </select>
        </div>

        <div class="form-group">
          <label for="script-length">Desired Length:</label>
          <select v-model="aiScript.length" id="script-length" class="form-input">
            <option value="short">Short (30-60 sec)</option>
            <option value="medium" selected>Medium (1-2 min)</option>
            <option value="long">Long (3-5 min)</option>
          </select>
        </div>

        <button 
          @click="generateAIScript" 
          :disabled="!aiScript.topic || generatingScript"
          class="generate-btn"
        >
          {{ generatingScript ? 'Generating...' : 'Generate Script' }}
        </button>
      </div>

      <div class="info-box">
        <h4>💡 Pro Tip</h4>
        <p>Master the 5-step framework above to train your AI model for better and more accurate script generation. Then use the generator to quickly create content variations.</p>
      </div>
    </section>

    <!-- Navigation to Creator Tools -->
    <section class="navigation-section">
      <h2>Ready to Create?</h2>
      <div class="nav-grid">
        <router-link to="/cyber/writer" class="nav-card">
          <h3>📝 Writer Studio</h3>
          <p>Use prompts for campaign text and scripts</p>
        </router-link>
        <router-link to="/cyber/mockups" class="nav-card">
          <h3>🎨 Mockup Studio</h3>
          <p>Design mockups with AI-generated concepts</p>
        </router-link>
        <router-link to="/cyber/gallery" class="nav-card">
          <h3>🖼️ Gallery</h3>
          <p>Browse successful prompt outputs</p>
        </router-link>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const practicePrompt = ref("");

const activeStep = ref('what');

const steps = [
  {
    id: 'what',
    title: 'WHAT - Define the Task',
    description: 'Clearly state what you want the AI to do',
    whats: [
      'Specific action (write, create, analyze, summarize)',
      'Role or perspective if needed (e.g., "As a marketing expert")',
      'Output format expectations',
      'Key constraints or requirements'
    ],
    example: 'Write a 3-line Instagram caption for O!clok delivery service targeting young professionals.',
    mistakes: [
      'Vague tasks like "write something good"',
      'Mixing multiple unrelated tasks',
      'Not specifying output format'
    ],
    bestPractice: 'Start with a verb (Write, Create, Summarize, Analyze) and be specific about what success looks like.'
  },
  {
    id: 'how',
    title: 'HOW - Specify the Approach',
    description: 'Explain the method or style you want',
    whats: [
      'Tone and voice (formal, casual, playful, professional)',
      'Style or template to follow',
      'Length or depth requirements',
      'Structural format (bullet points, paragraphs, lists)'
    ],
    example: 'Use a playful, conversational tone. Include one emoji. Keep it under 150 characters.',
    mistakes: [
      'Being too generic with tone ("make it good")',
      'Conflicting style instructions',
      'No clear format guide'
    ],
    bestPractice: 'Specify tone, length, and format. Give examples if possible to show the exact style you want.'
  },
  {
    id: 'why',
    title: 'WHY - Provide Context & Goals',
    description: 'Explain the purpose and background',
    whats: [
      'Business goal or purpose',
      'Target audience profile',
      'Problem you\'re solving',
      'Success metrics or outcome you expect'
    ],
    example: 'Goal: Increase Deli-bois delivery app downloads among working professionals aged 25-35 in Kisumu.',
    mistakes: [
      'Skipping context entirely',
      'Assuming AI knows your business',
      'Not defining target audience'
    ],
    bestPractice: 'The more context you give, the better the output. Include audience, business goal, and why this matters.'
  },
  {
    id: 'where',
    title: 'WHERE - Set the Context & Constraints',
    description: 'Define limitations and platform specifics',
    whats: [
      'Platform or channel (Instagram, TikTok, Email, Blog)',
      'Brand guidelines or rules to follow',
      'Avoid or sensitive topics',
      'Resources or references to use'
    ],
    example: 'For Instagram Stories. Use O!clok brand colors (orange #ff6600 and teal #35d6a6). Include call-to-action.',
    mistakes: [
      'Not mentioning platform constraints',
      'Ignoring brand guidelines',
      'Unclear about dos and don\'ts'
    ],
    bestPractice: 'Always mention platform, brand rules, and any hard constraints before asking the AI to generate.'
  },
  {
    id: 'output',
    title: 'OUTPUT - Specify Deliverables',
    description: 'Define exactly what you want to receive',
    whats: [
      'Format (text, code, images, JSON, markdown)',
      'Number of options or variations',
      'Structure or sections required',
      'Any additional metadata needed'
    ],
    example: 'Provide 3 variations. Include a hook, main message, and CTA for each. Format as numbered list.',
    mistakes: [
      'Not specifying number of outputs',
      'Vague format requests',
      'Expecting multiple formats in one go'
    ],
    bestPractice: 'End with exactly what format and quantity you want. Say "Give me 3 captions" not "Suggest captions".'
  }
];

const fullTemplate = `ROLE: [Your role if needed]

WHAT: Create/Write/Generate [specific task]

HOW: Use a [tone, style, format]. Keep it [length]. Structure as [format].

WHY: Purpose: [business goal]. Target: [audience]. Success = [metric].

WHERE: Platform: [channel]. Brand rules: [guidelines]. Avoid: [constraints].

OUTPUT: Format: [structure]. Quantity: [number of options]. Include: [specific sections].

CONTEXT: [Any additional background or references]`;

const promptExamples = [
  {
    id: 1,
    title: 'Campaign Caption',
    useCase: 'Instagram marketing',
    prompt: 'Create 3 Instagram captions for O!clok Delivery service promoting same-day delivery to young professionals. Use playful tone, include 1-2 emojis, under 150 characters each, and end with #oclok.',
    expectedOutput: 'Three engaging captions that drive clicks and convey reliability with personality.'
  },
  {
    id: 2,
    title: 'Product Description',
    useCase: 'E-commerce',
    prompt: 'Write a 50-word product description for a Smart Robot Cleaner. Target busy professionals. Highlight automation, app control, and time-saving. Use casual, confident tone. Format: 2-3 sentences.',
    expectedOutput: 'Concise, benefit-focused description that sells the convenience.'
  },
  {
    id: 3,
    title: 'Email Subject Lines',
    useCase: 'Email marketing',
    prompt: 'Generate 5 subject lines for an email promoting O!clok Media podcast series. Goal: 30% open rate. Audience: Tech enthusiasts in Kenya. Use curiosity and urgency. Keep under 50 characters.',
    expectedOutput: 'Multiple subject line options with high engagement potential.'
  },
  {
    id: 4,
    title: 'Social Media Thread',
    useCase: 'Twitter/X',
    prompt: 'Create a 5-tweet thread explaining how AI is transforming logistics in Kenya. Tone: informative but accessible. Include statistics if possible. Each tweet under 280 characters. End with CTA.',
    expectedOutput: 'Educational thread that builds narrative over tweets.'
  }
];

const checklist = [
  'Task is clearly defined with specific action verb',
  'Tone and style are explicitly stated',
  'Target audience is identified',
  'Business goal or purpose is explained',
  'Platform or channel is specified',
  'Output format and quantity are defined',
  'Brand guidelines or constraints are mentioned',
  'Expected length or scope is set',
  'Any sensitive topics or restrictions noted',
  'Relevant context or background provided'
];

const copyTemplate = () => {
  navigator.clipboard.writeText(fullTemplate);
  alert('Template copied to clipboard!');
};

const useExample = (example) => {
  // Store in local state for use in Writer page
  localStorage.setItem('current_prompt', example.prompt);
  window.location.href = '/cyber/writer';
};

// AI Script Generator State
const aiScript = ref({
  type: 'video',
  topic: '',
  tone: 'professional',
  length: 'medium'
});

const generatingScript = ref(false);

// AI Script Generation
const generateAIScript = async () => {
  if (!aiScript.value.topic) {
    alert('Please enter a topic for script generation');
    return;
  }
  
  generatingScript.value = true;
  try {
    // Simulate AI script generation
    const script = generateScriptTemplate(
      aiScript.value.type,
      aiScript.value.topic,
      aiScript.value.tone,
      aiScript.value.length
    );
    
    // Store generated script and redirect to Writer
    localStorage.setItem('generated_script', script);
    window.location.href = '/cyber/writer';
  } catch (error) {
    console.error('Error generating script:', error);
    alert('Error generating script. Please try again.');
  } finally {
    generatingScript.value = false;
  }
};

// Script Template Generator based on parameters
const generateScriptTemplate = (type, topic, tone, length) => {
  const durationMap = {
    short: '(30-60 seconds)',
    medium: '(1-2 minutes)',
    long: '(3-5 minutes)'
  };
  
  const templates = {
    video: `VIDEO SCRIPT - ${topic.toUpperCase()}
${durationMap[length]}

[SCENE 1 - OPENING]
Visual: [Describe opening shot]
Voiceover: [Hook the audience with a compelling opening]

[SCENE 2 - BODY]
Visual: [Main content visual]
Voiceover: [Explain your main point in a ${tone} tone]

[SCENE 3 - CALL TO ACTION]
Visual: [CTA graphic or text]
Voiceover: [Clear call to action]

Tone: ${tone}
Target Audience: [Define your audience]`,

    podcast: `PODCAST SCRIPT - ${topic.toUpperCase()}
${durationMap[length]}

[INTRODUCTION]
Host: "Welcome back to [Podcast Name]. Today we're discussing ${topic}."

[SEGMENT 1 - OVERVIEW]
Host: [Provide overview in ${tone} tone]

[SEGMENT 2 - DEEP DIVE]
Host: [Main discussion points]
Guest/Host: [Supporting commentary]

[SEGMENT 3 - TAKEAWAYS]
Host: [Key takeaways]

[OUTRO & CTA]
Host: [Call to action and sign-off]`,

    ad: `ADVERTISEMENT SCRIPT - ${topic.toUpperCase()}
${durationMap[length]}

[ATTENTION GRABBER]
Copy: [Problem or pain point - ${tone} approach]

[SOLUTION]
Copy: How our product/service solves this

[BENEFITS]
Copy: [Key benefits in ${tone} tone]
• Benefit 1
• Benefit 2
• Benefit 3

[PROOF/SOCIAL PROOF]
Copy: [Statistics or testimonials]

[CALL TO ACTION]
Copy: [Strong CTA]
Contact: [Where to find us]`,

    social: `SOCIAL MEDIA SCRIPT - ${topic.toUpperCase()}

[HOOK - First Line]
${tone === 'humorous' ? '😂' : tone === 'energetic' ? '🔥' : '💡'} [Attention-grabbing opening]

[STORY - Main Content]
${topic}

[ENGAGEMENT]
Question or call for interaction

[CTA - Call to Action]
[Link or instruction]

#hashtag1 #hashtag2 #hashtag3`,

    email: `EMAIL COPY - ${topic.toUpperCase()}

SUBJECT LINE: [Compelling subject that matches ${tone} tone]

---

Hi [Recipient],

[GREETING & HOOK]
[Opening line in ${tone} tone about ${topic}]

[BODY - VALUE PROPOSITION]
Here's what makes this important:
• Point 1
• Point 2
• Point 3

[CLOSING THOUGHT]
[Reinforcement of value]

[CALL TO ACTION]
[Clear, actionable next step]

Best regards,
[Your Name]
[Company]`,

    sales: `SALES PITCH - ${topic.toUpperCase()}

[OPENING - 15 seconds]
"Hi [Name], thanks for taking the time. [Hook about problem/topic]"

[SITUATION & COMPLICATION - 30 seconds]
"Many [target audience] struggle with [challenge related to ${topic}]"

[RESOLUTION - 45 seconds]
"That's why we created [solution]. Here's how it works:
1. [Benefit 1]
2. [Benefit 2]
3. [Benefit 3]"

[PROOF - 30 seconds]
"We've helped [X companies/users] achieve [result]"

[CLOSE - 15 seconds]
"Would you be interested in seeing a demo?"

---
Tone: ${tone}
Target Audience: [Define who you're selling to]`
  };
  
  return templates[type] || templates.video;
};
</script>

<style scoped>
.prompt-training-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f1f5f9;
  font-family: 'Poppins', sans-serif;
}

/* Practice & Tracking Columns */
.practice-tracking-row {
  display: flex;
  gap: 32px;
  margin-bottom: 40px;
  min-height: 260px;
}
.practice-col, .tracking-col {
  flex: 1 1 0;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 14px;
  padding: 24px 18px 18px 18px;
  display: flex;
  flex-direction: column;
  max-height: 320px;
  min-width: 0;
  overflow: hidden;
}
.practice-col {
  margin-right: 0;
}
.tracking-col {
  margin-left: 0;
}
.practice-col h2, .tracking-col h2 {
  font-size: 1.1rem;
  color: #ffd600;
  margin-bottom: 12px;
}
.practice-textarea {
  flex: 1 1 0;
  width: 100%;
  min-height: 120px;
  max-height: 200px;
  resize: vertical;
  background: #1e293b;
  color: #f1f5f9;
  border: 1px solid #7c3aed;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
  font-family: inherit;
  margin-bottom: 0;
  box-sizing: border-box;
}
.tracking-list {
  flex: 1 1 0;
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
}
.tracking-list li {
  margin-bottom: 10px;
  font-size: 0.98rem;
  color: #e0e0e0;
  background: rgba(124, 58, 237, 0.08);
  border-left: 3px solid #ffd600;
  padding: 8px 12px;
  border-radius: 6px;
}
.tracking-list strong {
  color: #ffd600;
}

@media (max-width: 900px) {
  .practice-tracking-row {
    flex-direction: column;
    gap: 18px;
  }
  .practice-col, .tracking-col {
    max-height: 220px;
    padding: 16px 10px 10px 10px;
  }
}
}

.hero {
  text-align: center;
  margin-bottom: 50px;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #ff6b00, #39ff14);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: 1.2rem;
  color: #cbd5e1;
}

/* Framework Steps */
.framework-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 50px;
}

.step-card {
  background: rgba(30, 41, 59, 0.8);
  border: 2px solid #7c3aed;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-height: 150px;
}

.step-card:hover {
  border-color: #ff6b00;
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.2);
}

.step-card.active {
  border-color: #ff6b00;
  background: rgba(255, 107, 0, 0.1);
}

.step-badge {
  position: absolute;
  top: -12px;
  left: 20px;
  width: 30px;
  height: 30px;
  background: #ff6b00;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.step-card h2 {
  margin-top: 10px;
  font-size: 1.1rem;
  color: #e0f2fe;
}

.step-subtitle {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #94a3b8;
}

.step-content {
  margin-top: 20px;
  border-top: 1px solid rgba(124, 58, 237, 0.3);
  padding-top: 20px;
}

.step-content h3 {
  margin: 16px 0 8px;
  font-size: 0.95rem;
  color: #cbd5e1;
}

.step-content ul {
  list-style: none;
  padding: 0;
  margin-bottom: 16px;
}

.step-content li {
  padding: 6px 0;
  color: #94a3b8;
  font-size: 0.9rem;
}

.step-content li:before {
  content: '▸ ';
  color: #ff6b00;
  font-weight: bold;
}

.example-code {
  background: rgba(15, 23, 42, 0.8);
  border-left: 3px solid #ff6b00;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  overflow-x: auto;
  color: #a78bfa;
  margin: 10px 0;
}

.mistakes {
  background: rgba(239, 68, 68, 0.1);
  padding: 12px;
  border-radius: 6px;
}

.mistakes li {
  color: #fca5a5;
}

.best-practice {
  background: rgba(34, 197, 94, 0.1);
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #22c55e;
}

.best-practice p {
  margin: 0;
  color: #86efac;
}

/* Template Section */
.template-section {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 50px;
}

.template-section h2 {
  margin-bottom: 10px;
  font-size: 2rem;
}

.section-subtitle {
  color: #94a3b8;
  margin-bottom: 20px;
}

.template-box {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid #7c3aed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.template-box pre {
  margin: 0;
  color: #a78bfa;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.cta-button {
  background: linear-gradient(135deg, #ff6b00, #ff8c00);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 0, 0.4);
}

/* Examples Section */
.examples-section {
  margin-bottom: 50px;
}

.examples-section h2 {
  margin-bottom: 10px;
  font-size: 2rem;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.example-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.example-card:hover {
  border-color: #ff6b00;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.2);
}

.example-card h3 {
  margin-bottom: 8px;
  color: #e0f2fe;
}

.use-case {
  font-size: 0.85rem;
  color: #7c3aed;
  margin-bottom: 16px;
}

.example-prompt,
.example-result {
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 6px;
}

.example-prompt strong,
.example-result strong {
  color: #cbd5e1;
}

.example-prompt pre {
  margin: 8px 0 0;
  color: #a78bfa;
  font-size: 0.85rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.example-result p {
  margin: 8px 0 0;
  color: #94a3b8;
}

.secondary-button {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid #7c3aed;
  color: #a78bfa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-button:hover {
  background: rgba(124, 58, 237, 0.1);
  border-color: #ff6b00;
  color: #ff6b00;
}

/* Reference Section */
.reference-section {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 50px;
}

.reference-section h2 {
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.checklist {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checklist-item input {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.checklist-item span {
  color: #cbd5e1;
}

/* Navigation Section */
.navigation-section {
  text-align: center;
  margin-top: 50px;
}

.navigation-section h2 {
  margin-bottom: 30px;
  font-size: 2rem;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.nav-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 12px;
  padding: 30px 20px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.nav-card:hover {
  border-color: #ff6b00;
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.2);
}

.nav-card h3 {
  margin-bottom: 10px;
  font-size: 1.3rem;
  color: #e0f2fe;
}

.nav-card p {
  color: #94a3b8;
  margin: 0;
}

/* AI Script Generator Section */
.ai-generator-section {
  background: rgba(30, 41, 59, 0.8);
  border: 2px solid rgba(255, 107, 0, 0.3);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 50px;
}

.ai-generator-section h2 {
  margin-bottom: 10px;
  font-size: 2rem;
  color: #ff6b00;
}

.section-subtitle {
  color: #cbd5e1;
  margin-bottom: 25px;
  font-size: 0.95rem;
}

.generator-form {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #e0f2fe;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 6px;
  color: #f1f5f9;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #ff6b00;
  box-shadow: 0 0 12px rgba(255, 107, 0, 0.2);
}

.form-input::placeholder {
  color: #64748b;
}

.generate-btn {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #ff6b00, #ff8c00);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 0, 0.4);
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.info-box {
  background: rgba(124, 58, 237, 0.1);
  border-left: 4px solid #ff6b00;
  border-radius: 8px;
  padding: 20px;
}

.info-box h4 {
  margin: 0 0 8px 0;
  color: #ff6b00;
  font-size: 1rem;
}

.info-box p {
  margin: 0;
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .framework-container {
    grid-template-columns: 1fr;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .examples-grid,
  .nav-grid {
    grid-template-columns: 1fr;
  }
}
</style>
