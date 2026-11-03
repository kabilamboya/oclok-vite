<template>
  <section class="overview-shell">
    <section class="brief-grid">
      <article class="brief-card highlight">
        <p>General remarks</p>
        <h2>{{ selectedPeriod }} business summary</h2>
        <span>{{ summaryText }}</span>
      </article>

      <article class="brief-card watchlist">
        <p>Watchlist</p>
        <h2>Monitor stock and shop contribution.</h2>
        <span>{{ productCount }} products across the current catalogue.</span>
      </article>
    </section>

    <section class="metric-grid">
      <article v-for="metric in metrics" :key="metric.label" class="metric-card">
        <div class="metric-heading">
          <span>{{ metric.label }}</span>
          <b :class="metric.tone">{{ metric.icon }}</b>
        </div>
        <strong>{{ metric.value }}</strong>
        <small>{{ metric.note }}</small>
      </article>
    </section>
  </section>
</template>

<script setup>
defineProps({ selectedPeriod: String, summaryText: String, productCount: Number, metrics: Array });
</script>

<style scoped>
.overview-shell {
  display: grid;
  gap: 1rem;
}

.brief-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1rem;
}

.brief-card,
.metric-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--shadow-sm);
}

.brief-card {
  padding: 1.15rem 1.3rem;
  border-left: 4px solid var(--color-primary);
}

.brief-card.highlight {
  background: rgba(255, 122, 0, 0.04);
}

.brief-card.watchlist {
  border-left-color: var(--color-secondary);
}

.brief-card h2 {
  margin: 0.55rem 0 0.35rem;
  font-size: 1rem;
  color: var(--text);
}

.brief-card span {
  color: var(--text-muted);
  font-size: 0.78rem;
  line-height: 1.6;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

.metric-card {
  padding: 1rem 1rem 0.9rem;
  border-top: 4px solid var(--color-primary);
}

.metric-card:nth-child(2n) {
  border-top-color: var(--color-secondary);
}

.metric-card:nth-child(3n) {
  border-top-color: var(--color-accent);
}

.metric-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.metric-heading b {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  font-size: 0.9rem;
}

.metric-heading .yellow { background: rgba(255, 122, 0, 0.12); color: var(--color-primary); }
.metric-heading .blue { background: rgba(15, 157, 138, 0.12); color: var(--color-secondary); }
.metric-heading .purple { background: rgba(109, 40, 217, 0.12); color: var(--color-accent); }
.metric-heading .teal { background: rgba(15, 157, 138, 0.12); color: var(--color-secondary); }
.metric-heading .red { background: rgba(255, 122, 0, 0.12); color: var(--color-primary); }
.metric-heading .green { background: rgba(15, 157, 138, 0.12); color: var(--color-secondary); }

.metric-card strong {
  display: block;
  margin: 1rem 0 0.5rem;
  font-size: 1.45rem;
  color: var(--text);
}

.metric-card small {
  color: var(--text-muted);
  font-size: 0.75rem;
}

@media (max-width: 900px) {
  .brief-grid,
  .metric-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .brief-grid,
  .metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>
