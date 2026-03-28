<template>
  <section class="cyber-home">
    <header class="hero">
      <div class="hero-text">
        <p class="eyebrow">O!clok Cyber Studio</p>
        <h1>AI Prompt Mastery</h1>
        <p class="lead">
          Write better prompts, craft campaign copy, and build mockups faster. Pick a workspace
          below to get started.
        </p>
        <div class="hero-actions">
          <router-link to="/cyber/writer" class="cta primary">Open Writer</router-link>
          <router-link to="/cyber/prompts" class="cta secondary">Train Prompts</router-link>
        </div>
      </div>
      <div class="hero-panel">
        <div class="hero-panel-inner">
          <h3>What you can do</h3>
          <ul>
            <li>Generate structured prompts fast</li>
            <li>Draft scripts and campaigns</li>
            <li>Design mockups and brand assets</li>
            <li>Publish and review your gallery</li>
          </ul>
        </div>
      </div>
    </header>

    <section class="cta-grid">
      <article class="cta-card">
        <div>
          <h2>Prompt Training</h2>
          <p>Practice and score prompts, then push the best ones into Writer.</p>
        </div>
        <router-link to="/cyber/prompts" class="card-link">Open Prompts</router-link>
      </article>

      <article class="cta-card">
        <div>
          <h2>Writer Studio</h2>
          <p>Rich text editing for scripts, briefs, campaign copy, and training drafts.</p>
        </div>
        <router-link to="/cyber/writer" class="card-link">Open Writer</router-link>
      </article>

      <article class="cta-card">
        <div>
          <h2>Mockup Studio</h2>
          <p>Build visual mockups, add text layers, and export visuals for campaigns.</p>
        </div>
        <router-link to="/cyber/mockups" class="card-link">Open Mockups</router-link>
      </article>

      <article class="cta-card">
        <div>
          <h2>Gallery</h2>
          <p>Review approved outputs, campaign assets, and curated brand mockups.</p>
        </div>
        <router-link to="/cyber/gallery" class="card-link">Open Gallery</router-link>
      </article>
    </section>
  </section>
</template>

<script setup></script>

<style scoped>
.cyber-home {
  display: grid;
  gap: 2rem;
  padding: 1rem 1.2rem 2.5rem;
  --hero-orange: color-mix(in srgb, var(--primary-orange) 18%, transparent);
  --hero-teal: color-mix(in srgb, var(--secondary-teal) 18%, transparent);
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.9fr);
  gap: 1.6rem;
  align-items: stretch;
}

.hero-text {
  background: linear-gradient(135deg, var(--hero-orange), var(--hero-teal));
  border: 1px solid var(--line-dark);
  border-radius: 18px;
  padding: 1.6rem 1.8rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.7rem;
  color: var(--primary-orange);
  margin: 0 0 0.6rem 0;
}

.hero-text h1 {
  margin: 0;
  font-size: 2.6rem;
  font-weight: 800;
  background: linear-gradient(90deg, var(--primary-orange), var(--secondary-teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.lead {
  margin: 0.75rem 0 1.2rem;
  color: var(--text-muted-dark);
  font-size: 1rem;
  line-height: 1.5;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.cta {
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.cta.primary {
  background: var(--primary-orange);
  border: 1px solid var(--primary-orange-border);
  color: var(--text-white);
}

.cta.secondary {
  border: 1px solid var(--secondary-teal-border);
  color: var(--secondary-teal);
}

.cta.primary:hover {
  background: var(--primary-orange-hover);
}

.cta.secondary:hover {
  background: var(--secondary-teal);
  color: var(--text-white);
}

.cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
}

.hero-panel {
  border-radius: 18px;
  background: var(--panel-dark);
  border: 1px solid var(--line-dark);
  padding: 1.4rem;
}

.hero-panel-inner h3 {
  margin: 0 0 0.75rem;
  color: var(--text-white);
}

.hero-panel-inner ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.55rem;
  color: var(--text-muted-dark);
  font-size: 0.92rem;
}

.hero-panel-inner li {
  padding-left: 1rem;
  position: relative;
}

.hero-panel-inner li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.45rem;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--primary-orange);
}

.cta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.cta-card {
  background: var(--panel-dark);
  border: 1px solid var(--line-dark);
  border-radius: 16px;
  padding: 1.2rem;
  display: grid;
  gap: 1rem;
  min-height: 180px;
}

.cta-card h2 {
  margin: 0 0 0.4rem 0;
  font-size: 1.2rem;
  color: var(--text-white);
}

.cta-card p {
  margin: 0;
  color: var(--text-muted-dark);
  line-height: 1.5;
  font-size: 0.92rem;
}

.card-link {
  align-self: end;
  color: var(--primary-orange);
  text-decoration: none;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--primary-orange-border);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  cursor: pointer;
}

.card-link:hover {
  color: var(--text-white);
  background: var(--primary-orange-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }
}
</style>
