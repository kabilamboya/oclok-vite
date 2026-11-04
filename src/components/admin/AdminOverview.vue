<template>
  <section class="overview-shell" :class="{ 'board-mode': boardMode }">
    <section v-if="!boardMode" class="brief-grid">
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

    <section v-else class="brief-grid board-intro-grid">
      <article class="brief-card highlight">
        <p>Operations snapshot</p>
        <h2>Live flow across client work and technician delivery.</h2>
        <span>Task board view focuses on active work, execution pressure, and completion rate across the live queue.</span>
      </article>

      <article class="brief-card watchlist">
        <p>Board focus</p>
        <h2>Prioritise stalled work and client commitments.</h2>
        <span>{{ taskBoard?.summary?.totalOpen ?? 0 }} open tasks are currently tracked and scheduled.</span>
      </article>
    </section>

    <section v-if="!boardMode" class="metric-grid">
      <article v-for="metric in metrics" :key="metric.label" class="metric-card">
        <div class="metric-heading">
          <span>{{ metric.label }}</span>
          <b :class="metric.tone">{{ metric.icon }}</b>
        </div>
        <strong>{{ metric.value }}</strong>
        <small>{{ metric.note }}</small>
      </article>
    </section>

    <section v-if="taskBoard && boardMode" class="task-board-panel">
      <div class="board-header">
        <div>
          <p>Operations board</p>
          <h2>Client requests and technician job tracker</h2>
        </div>
        <div class="board-summary">
          <span><strong>{{ taskBoard.summary.totalOpen }}</strong> open tasks</span>
          <span><strong>{{ taskBoard.summary.completionRate }}%</strong> completion</span>
        </div>
      </div>

      <div class="board-grid">
        <article class="board-column">
          <header>
            <h3>Client order requests</h3>
            <span>{{ taskBoard.clientRequests.length }} live</span>
          </header>

          <ul class="task-list">
            <li v-for="task in taskBoard.clientRequests" :key="task.id" class="task-item">
              <div class="task-line">
                <strong>{{ task.title }}</strong>
                <span :class="['status-pill', taskStatusClass(task.status)]">{{ task.status }}</span>
              </div>
              <div class="task-meta">
                <small>{{ task.customer }}</small>
                <small>{{ task.due }}</small>
              </div>
              <div class="task-progress-header">
                <span>{{ task.owner }}</span>
                <b>{{ task.progress }}%</b>
              </div>
              <div class="progress-bar"><span :style="{ width: `${task.progress}%` }"></span></div>
            </li>
          </ul>
        </article>

        <article class="board-column">
          <header>
            <h3>Technician job progress</h3>
            <span>{{ taskBoard.summary.activeJobs }} active</span>
          </header>

          <ul class="task-list">
            <li v-for="task in taskBoard.technicianJobs" :key="task.id" class="task-item">
              <div class="task-line">
                <strong>{{ task.title }}</strong>
                <span :class="['status-pill', taskStatusClass(task.status)]">{{ task.status }}</span>
              </div>
              <div class="task-meta">
                <small>{{ task.technician }}</small>
                <small>{{ task.client }}</small>
              </div>
              <div class="task-progress-header">
                <span>{{ task.due }}</span>
                <b>{{ task.progress }}%</b>
              </div>
              <div class="progress-bar"><span :style="{ width: `${task.progress}%` }"></span></div>
            </li>
          </ul>
        </article>

        <article class="board-column">
          <header>
            <h3>Oclok direct employee tasks</h3>
            <span>{{ taskBoard.summary.employeeTasks }} active</span>
          </header>

          <ul class="task-list">
            <li v-for="task in taskBoard.directEmployeeTasks" :key="task.id" class="task-item">
              <div class="task-line">
                <strong>{{ task.title }}</strong>
                <span :class="['status-pill', taskStatusClass(task.status)]">{{ task.status }}</span>
              </div>
              <div class="task-meta">
                <small>{{ task.employee }}</small>
                <small>{{ task.owner }}</small>
              </div>
              <div class="task-progress-header">
                <span>{{ task.due }}</span>
                <b>{{ task.progress }}%</b>
              </div>
              <div class="progress-bar"><span :style="{ width: `${task.progress}%` }"></span></div>
            </li>
          </ul>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup>
const props = defineProps({
  selectedPeriod: String,
  summaryText: String,
  productCount: Number,
  metrics: Array,
  taskBoard: Object,
  boardMode: Boolean,
});

const taskStatusClass = (status = '') => {
  const normalized = String(status).toLowerCase();

  if (normalized.includes('complete') || normalized.includes('delivered')) return 'success';
  if (normalized.includes('review') || normalized.includes('awaiting')) return 'warning';
  if (normalized.includes('progress') || normalized.includes('queued')) return 'info';
  if (normalized.includes('delay') || normalized.includes('escalat')) return 'danger';
  return 'neutral';
};
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
.metric-card,
.task-board-panel,
.board-column {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.overview-shell :focus-visible,
.brief-card:focus-within,
.metric-card:focus-within,
.task-board-panel:focus-within,
.board-column:focus-within {
  outline: 3px solid rgba(255, 122, 0, 0.24);
  outline-offset: 2px;
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

.task-board-panel {
  padding: 1.2rem 1.2rem 1rem;
  background: linear-gradient(180deg, rgba(255, 122, 0, 0.04), rgba(255, 255, 255, 1));
  border: 1.5px solid rgba(255, 122, 0, 0.28);
  box-shadow: 0 10px 22px rgba(255, 122, 0, 0.09);
}

.board-mode .brief-card.highlight {
  background: linear-gradient(135deg, rgba(255, 122, 0, 0.1), rgba(255, 255, 255, 0.96));
  border-color: rgba(255, 122, 0, 0.35);
}

.board-mode .brief-card.watchlist {
  background: linear-gradient(135deg, rgba(15, 157, 138, 0.08), rgba(255, 255, 255, 0.96));
  border-color: rgba(15, 157, 138, 0.3);
}

.board-intro-grid {
  margin-bottom: 0.25rem;
}

.board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.board-header p,
.board-column header span {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 700;
}

.board-header h2,
.board-column h3 {
  margin: 0.35rem 0 0;
  font-size: 1.05rem;
  color: var(--text);
}

.board-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  color: var(--text-muted);
  font-size: 0.72rem;
}

.board-summary strong {
  color: var(--text);
}

.board-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

.board-column {
  padding: 0.9rem;
}

.board-column header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.task-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.7rem;
}

.task-item {
  border: 1px solid var(--border);
  border-radius: 14px;
  background: rgba(248, 249, 250, 0.9);
  padding: 0.7rem 0.8rem;
}

.task-line,
.task-progress-header,
.task-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem;
}

.task-line strong {
  font-size: 0.8rem;
  color: var(--text);
}

.task-meta {
  margin: 0.45rem 0 0.55rem;
  color: var(--text-muted);
  font-size: 0.65rem;
}

.task-progress-header {
  color: var(--text-muted);
  font-size: 0.66rem;
}

.task-progress-header b {
  color: var(--text);
}

.progress-bar {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.18);
  overflow: hidden;
  margin-top: 0.45rem;
}

.progress-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.28rem 0.52rem;
  font-size: 0.58rem;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

.status-pill.success { background: rgba(16, 185, 129, 0.12); color: #0d8a63; }
.status-pill.warning { background: rgba(245, 158, 11, 0.12); color: #b96a00; }
.status-pill.info { background: rgba(59, 130, 246, 0.12); color: #1f5ad5; }
.status-pill.danger { background: rgba(239, 68, 68, 0.12); color: #be1b2b; }
.status-pill.neutral { background: rgba(148, 163, 184, 0.12); color: #475569; }

@media (max-width: 900px) {
  .brief-grid,
  .metric-grid,
  .board-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .brief-grid,
  .metric-grid,
  .board-grid {
    grid-template-columns: 1fr;
  }

  .board-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
