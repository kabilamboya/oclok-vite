<script setup>
import { computed } from "vue";
import products from "../data/products.json";

const knowledgePillars = [
  {
    title: "Home Assistants",
    points: [
      "Automate repetitive home routines like lighting, reminders, and room monitoring.",
      "Enable hands-free controls through voice-enabled devices.",
      "Improve comfort and safety with smart alerts and remote access.",
    ],
    image: "/images/robOTS.jpg",
  },
  {
    title: "Business Assistants",
    points: [
      "Support front-desk, queue, and repetitive support tasks.",
      "Improve turnaround for dispatch, inventory checks, and customer updates.",
      "Let teams focus on higher-value work while assistants handle routine operations.",
    ],
    image: "/images/bott.jpeg",
  },
  {
    title: "Mobility and Delivery Assistants",
    points: [
      "Help with short and medium range delivery workflows.",
      "Assist with route planning and dispatch coordination.",
      "Support predictable operations in controlled and semi-controlled environments.",
    ],
    image: "/images/deliDrone.jpeg",
  },
];

const dailyUseCases = [
  {
    title: "At Home",
    summary: "Smart assistants can manage reminders, monitor spaces, and automate comfort settings.",
  },
  {
    title: "In School and Learning",
    summary: "Robotics tools support STEM learning, coding practice, and problem-solving exercises.",
  },
  {
    title: "At Work",
    summary: "Assistants reduce manual repetitive tasks in customer service, support desks, and operations.",
  },
  {
    title: "In Logistics",
    summary: "Robotic systems support dispatch reliability, task tracking, and delivery workflows.",
  },
];

const knowledgeFaqs = [
  {
    q: "Do robot assistants replace people?",
    a: "No. They handle repeatable tasks and support teams, while people lead decision-making and customer relationships.",
  },
  {
    q: "Are robot assistants only for large companies?",
    a: "No. Homes, startups, schools, and small businesses can adopt assistants based on use case and budget.",
  },
  {
    q: "What should I consider before buying?",
    a: "Start with your main problem, operating environment, power/network requirements, and maintenance expectations.",
  },
  {
    q: "Can O!clok help with setup and support?",
    a: "Yes. O!clok supports consultation, onboarding, and practical deployment for assistant devices and workflows.",
  },
];

const storeAssistantCategories = ["Drones", "Speakers", "Smart Home", "Accessories", "Phones", "Watches"];

const robotAssistants = computed(() => {
  return products
    .filter((item) => storeAssistantCategories.includes(item.category))
    .slice(0, 8);
});
</script>

<template>
  <main class="robots-page">
    <section class="hero">
      <div class="hero-copy">
      <img src="/images/ROBOto.jpg" alt="Robot assistant concept" />
        <p class="eyebrow">Robot Assistant Knowledge Base</p>
        <h1>How robots assist in daily life</h1>
        <p>
          This page explains practical robot assistants for homes, schools, business operations,
          and logistics. You can also explore assistant devices sold through the O!clok Store.
        </p>
        <div class="hero-actions">
          <router-link class="cta primary" to="/products">Shop Assistant Devices</router-link>
          <router-link class="cta ghost" to="/discover">See Delivery and Field Use Cases</router-link>
        </div>
      </div>
    </section>

    <section class="knowledge-grid">
      <article
        v-for="pillar in knowledgePillars"
        :key="pillar.title"
        class="knowledge-card"
      >
        <img :src="pillar.image" :alt="pillar.title" />
        <div class="knowledge-card-copy">
          <h2>{{ pillar.title }}</h2>
          <ul>
            <li v-for="point in pillar.points" :key="point">{{ point }}</li>
          </ul>
        </div>
      </article>
    </section>

    <section class="daily-life">
      <div class="section-head">
        <h2>Everyday assistant scenarios</h2>
        <p>Practical examples of where robot assistants add measurable value.</p>
      </div>
      <div class="use-case-grid">
        <article v-for="caseItem in dailyUseCases" :key="caseItem.title" class="use-case-card">
          <h3>{{ caseItem.title }}</h3>
          <p>{{ caseItem.summary }}</p>
        </article>
      </div>
    </section>

    <section class="store-assistants">
      <div class="section-head">
        <h2>Assistant devices from O!clok Store</h2>
        <p>Selected products relevant to robot-assisted and smart assistant workflows.</p>
      </div>
      <div class="assistant-grid">
        <router-link
          v-for="item in robotAssistants"
          :key="item.id"
          :to="`/products/${item.id}`"
          class="assistant-card"
        >
          <img :src="item.images?.[0] || '/images/ROBOto.jpg'" :alt="item.name" />
          <div class="assistant-card-copy">
            <p class="category">{{ item.category }}</p>
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <strong>KES {{ Number(item.price).toLocaleString() }}</strong>
          </div>
        </router-link>
      </div>
      <router-link class="inline-link" to="/products">Browse full O!clok Store catalog</router-link>
    </section>

    <section class="faq">
      <div class="section-head">
        <h2>Robot assistants FAQ</h2>
      </div>
      <div class="faq-list">
        <article v-for="entry in knowledgeFaqs" :key="entry.q" class="faq-item">
          <h3>{{ entry.q }}</h3>
          <p>{{ entry.a }}</p>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.robots-page {
  --bg: #0f1319;
  --panel: #171d28;
  --card: #1d2431;
  --line: #303b4e;
  --text: #e9eff7;
  --muted: #b3bfd0;
  --accent: #35d6a6;
  max-width: 1160px;
  margin: 0 auto;
  padding: 22px 16px 40px;
  color: var(--text);
  font-family: "Manrope", "Segoe UI", sans-serif;
}

.hero {
  background:
    radial-gradient(circle at 10% 10%, rgba(53, 214, 166, 0.25), transparent 45%),
    linear-gradient(145deg, #121926 0%, #0d121a 100%);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 18px;
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 14px;
  align-items: center;
}

.hero img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid #2f3a4c;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.74rem;
  font-weight: 700;
  color: #9cefd5;
}

.hero h1 {
  margin: 10px 0 10px;
  line-height: 1.2;
  font-size: clamp(1.6rem, 2.6vw, 2.35rem);
}

.hero p {
  margin: 0;
  color: var(--muted);
}

.hero-actions {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cta {
  text-decoration: none;
  border-radius: 10px;
  font-weight: 700;
  padding: 10px 14px;
  border: 1px solid transparent;
}

.cta.primary {
  background: var(--accent);
  color: #081218;
}

.cta.ghost {
  border-color: #4f617c;
  color: var(--text);
}

.knowledge-grid,
.daily-life,
.store-assistants,
.faq {
  margin-top: 16px;
}

.knowledge-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px;
  display: grid;
  grid-template-columns: 270px 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.knowledge-card img {
  width: 100%;
  height: 190px;
  object-fit: cover;
  border-radius: 10px;
}

.knowledge-card-copy h2 {
  margin: 0;
  font-size: 1.16rem;
}

.knowledge-card-copy ul {
  margin: 10px 0 0;
  padding-left: 18px;
  color: var(--muted);
}

.knowledge-card-copy li {
  margin-bottom: 8px;
}

.section-head h2 {
  margin: 0;
  font-size: 1.2rem;
}

.section-head p {
  margin: 7px 0 0;
  color: var(--muted);
}

.use-case-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.use-case-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px;
}

.use-case-card h3 {
  margin: 0;
  font-size: 0.98rem;
}

.use-case-card p {
  margin: 7px 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.assistant-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}

.assistant-card {
  text-decoration: none;
  color: inherit;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.assistant-card:hover {
  transform: translateY(-3px);
  border-color: #4fd4aa;
}

.assistant-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.assistant-card-copy {
  padding: 10px;
}

.assistant-card-copy .category {
  margin: 0;
  color: #94e7cd;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.assistant-card-copy h3 {
  margin: 6px 0 6px;
  font-size: 0.95rem;
}

.assistant-card-copy p {
  margin: 0;
  color: var(--muted);
  font-size: 0.84rem;
}

.assistant-card-copy strong {
  margin-top: 8px;
  display: inline-block;
  color: #d5fbee;
}

.inline-link {
  margin-top: 12px;
  display: inline-block;
  color: #9cefd5;
  text-decoration: none;
}

.faq-list {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.faq-item {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px;
}

.faq-item h3 {
  margin: 0;
  font-size: 0.96rem;
}

.faq-item p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

@media (max-width: 980px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .use-case-grid {
    grid-template-columns: 1fr 1fr;
  }

  .knowledge-card {
    grid-template-columns: 1fr;
  }

  .faq-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .robots-page {
    padding: 14px 12px 24px;
  }

  .use-case-grid {
    grid-template-columns: 1fr;
  }
}
</style>
