<template>
  <section class="financials-layout">
    <article class="dashboard-card financials-card">
      <div class="card-heading">
        <div>
          <p>Financials</p>
          <h2>Capital, revenue & profit</h2>
        </div>
        <span>{{ selectedYear }}</span>
      </div>

      <div class="metric-strip">
        <div class="mini-metric accent">
          <small>Capital</small>
          <strong>{{ formatCurrency(financials.capital) }}</strong>
        </div>
        <div class="mini-metric info">
          <small>Revenue</small>
          <strong>{{ formatCurrency(financials.revenue) }}</strong>
        </div>
        <div class="mini-metric success">
          <small>Gross result</small>
          <strong>{{ grossProfitLabel }}</strong>
        </div>
      </div>

      <div class="financials-form">
        <label>
          Input capital (KES)
          <input type="number" v-model.number="financials.capital" />
        </label>
        <label>
          Gross revenue (KES)
          <input type="number" v-model.number="financials.revenue" />
        </label>
      </div>

      <div class="summary-row">
        <div class="summary-chip">
          <span>Margin</span>
          <strong>{{ marginPercent }}%</strong>
        </div>
        <button type="button" class="primary-action" @click="$emit('save')">Save</button>
      </div>
    </article>

    <article class="dashboard-card insight-card">
      <div class="card-heading compact">
        <div>
          <p>Performance</p>
          <h2>Operating mix</h2>
        </div>
      </div>

      <div class="stacked-bars" aria-label="Financial performance breakdown">
        <div class="bar-row">
          <div class="bar-meta">
            <span>Capital</span>
            <strong>{{ formatCurrency(financials.capital) }}</strong>
          </div>
          <div class="progress-track">
            <span :style="{ width: capitalShare + '%' }" class="progress-capital"></span>
          </div>
        </div>

        <div class="bar-row">
          <div class="bar-meta">
            <span>Revenue</span>
            <strong>{{ formatCurrency(financials.revenue) }}</strong>
          </div>
          <div class="progress-track">
            <span :style="{ width: revenueShare + '%' }" class="progress-revenue"></span>
          </div>
        </div>

        <div class="bar-row">
          <div class="bar-meta">
            <span>Profitability</span>
            <strong>{{ formatSigned(Math.abs(grossProfitValue)) }}</strong>
          </div>
          <div class="progress-track">
            <span :style="{ width: marginPercent + '%' }" class="progress-profit"></span>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ selectedYear: [String, Number], financials: Object, grossProfitLabel: String });
defineEmits(['save']);

const formatCurrency = (value) => {
  const numeric = Number(value) || 0;
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(numeric);
};

const formatSigned = (value) => {
  const numeric = Number(value) || 0;
  const prefix = numeric >= 0 ? '+' : '-';
  return `${prefix}${new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(Math.abs(numeric))}`;
};

const grossProfitValue = computed(() => Number(props.financials?.revenue || 0) - Number(props.financials?.capital || 0));
const marginPercent = computed(() => {
  const capital = Number(props.financials?.capital || 0);
  if (!capital) return 0;
  return Math.max(0, Math.min(100, Math.round((grossProfitValue.value / capital) * 100)));
});

const revenueShare = computed(() => {
  const revenue = Number(props.financials?.revenue || 0);
  const capital = Number(props.financials?.capital || 0);
  const base = Math.max(revenue, capital, 1);
  return Math.min(100, Math.round((revenue / base) * 100));
});

const capitalShare = computed(() => {
  const revenue = Number(props.financials?.revenue || 0);
  const capital = Number(props.financials?.capital || 0);
  const base = Math.max(revenue, capital, 1);
  return Math.min(100, Math.round((capital / base) * 100));
});
</script>

<style scoped>
.financials-layout {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 22px;
}

.dashboard-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: var(--shadow-md);
  padding: 22px;
}

.card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.card-heading p {
  margin: 0;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  font-weight: 800;
}

.card-heading h2 {
  margin: 4px 0 0;
  color: var(--text);
  font-size: clamp(1.2rem, 2vw, 1.8rem);
}

.card-heading > span {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--surface-alt);
  color: var(--text);
  font-size: 0.82rem;
  font-weight: 700;
}

.metric-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.mini-metric {
  border-radius: 18px;
  padding: 14px 12px;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--surface-alt);
}

.mini-metric.accent { background: rgba(255, 122, 0, 0.08); }
.mini-metric.info { background: rgba(15, 157, 138, 0.08); }
.mini-metric.success { background: rgba(109, 40, 217, 0.08); }

.mini-metric small {
  color: var(--text-muted);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 800;
}

.mini-metric strong {
  color: var(--text);
  font-size: 1.03rem;
  line-height: 1.3;
}

.financials-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 16px;
}

.financials-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text);
  font-size: 0.83rem;
  font-weight: 700;
}

.financials-form input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  font: inherit;
  background: var(--surface);
  color: var(--text);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.summary-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: 999px;
  background: var(--surface-alt);
  padding: 10px 12px;
  color: var(--text);
  font-weight: 700;
}

.summary-chip strong {
  color: var(--text);
}

.stacked-bars {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.bar-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bar-meta {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 0.86rem;
  color: var(--text);
  font-weight: 700;
}

.progress-track {
  position: relative;
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.progress-capital,
.progress-revenue,
.progress-profit {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.progress-capital { background: var(--color-primary); }
.progress-revenue { background: var(--color-secondary); }
.progress-profit { background: var(--color-accent); }

@media (max-width: 900px) {
  .financials-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .dashboard-card {
    padding: 16px;
  }

  .metric-strip,
  .financials-form {
    grid-template-columns: 1fr;
  }

  .summary-row {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
