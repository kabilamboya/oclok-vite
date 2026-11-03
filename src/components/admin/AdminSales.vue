<template>
  <section class="sales-dashboard-grid">
    <article class="dashboard-card sales-card">
      <div class="card-heading">
        <div>
          <p>Sales dashboard</p>
          <h2>Revenue performance</h2>
        </div>
        <span>{{ selectedPeriod }}</span>
      </div>

      <div class="chart-kpis">
        <div class="kpi-box accent">
          <strong>{{ salesSummary.total }}</strong>
          <small>Net sales</small>
        </div>
        <div class="kpi-box info">
          <strong>{{ salesSummary.growth }}</strong>
          <small>vs prior period</small>
        </div>
        <div class="kpi-box neutral">
          <strong>{{ salesSummary.orders }}</strong>
          <small>Orders closed</small>
        </div>
      </div>

      <div class="chart-wrap">
        <svg class="sales-chart" viewBox="0 0 440 180" preserveAspectRatio="none" aria-label="Sales chart">
          <defs>
            <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.22" />
              <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.04" />
            </linearGradient>
          </defs>
          <path :d="salesAreaPath" fill="url(#salesFill)" opacity="0.9"></path>
          <path :d="salesLinePath" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
          <g v-for="point in salesChartPoints" :key="`point-${point.index}`">
            <circle :cx="point.x" :cy="point.y" r="4.5" fill="#ffffff" stroke="var(--color-primary)" stroke-width="2"></circle>
          </g>
        </svg>
      </div>

      <div class="chart-label-row">
        <span v-for="label in salesChartLabels" :key="label">{{ label }}</span>
      </div>
    </article>

    <article class="dashboard-card table-card">
      <div class="card-heading">
        <div>
          <p>Sales by channel</p>
          <h2>Store revenue</h2>
        </div>
        <span>{{ selectedShop }}</span>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Channel</th>
              <th>Revenue</th>
              <th>Orders</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="channel in salesChannels" :key="channel.name">
              <td><strong>{{ channel.name }}</strong></td>
              <td>{{ channel.revenue }}</td>
              <td>{{ channel.orders }}</td>
              <td><span class="share-badge">{{ channel.share }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

    <article v-if="stockEntries && stockEntries.length" class="dashboard-card stock-card">
      <div class="card-heading">
        <div>
          <p>Stock</p>
          <h2>Store products</h2>
        </div>
        <span>Products: {{ stockEntries.length }}</span>
      </div>

      <div class="mini-chart">
        <svg class="sales-chart" viewBox="0 0 440 120" preserveAspectRatio="none" aria-label="Stock chart">
          <path :d="stockLinePath" fill="none" stroke="#2587cb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </div>

      <div class="table-wrap">
        <table class="data-table stock-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>In stock</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in stockEntries" :key="item.id">
              <td>
                <div class="product-name-wrap">
                  <strong>{{ item.name }}</strong>
                  <div class="muted">{{ item.description }}</div>
                </div>
              </td>
              <td>{{ item.category }}</td>
              <td>KES {{ item.price }}</td>
              <td>
                <span :class="['status-badge', item.inStock ? 'active' : 'suspended']">
                  {{ item.inStock ? 'Yes' : 'No' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>

<script setup>
defineProps({
  selectedPeriod: String,
  selectedShop: String,
  salesSummary: Object,
  salesChartPoints: Array,
  salesAreaPath: String,
  salesLinePath: String,
  salesChartLabels: Array,
  salesChannels: Array,
  stockEntries: Array,
  stockChartLabels: Array,
  stockLinePath: String,
});
</script>

<style scoped>
.sales-dashboard-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 22px;
  width: 100%;
}

.dashboard-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: var(--shadow-md);
  padding: 22px;
}

.sales-card,
.stock-card {
  grid-column: 1 / -1;
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
  font-size: clamp(1.3rem, 2vw, 1.8rem);
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

.chart-kpis {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.kpi-box {
  border-radius: 18px;
  padding: 16px 14px;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kpi-box.accent {
  background: rgba(255, 122, 0, 0.08);
}

.kpi-box.info {
  background: rgba(15, 157, 138, 0.08);
}

.kpi-box.neutral {
  background: rgba(109, 40, 217, 0.06);
}

.kpi-box strong {
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  color: var(--text);
}

.kpi-box small {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.chart-wrap,
.mini-chart {
  border-radius: 18px;
  background: var(--surface-alt);
  border: 1px solid var(--border);
}

.chart-wrap {
  padding: 10px 8px 0;
}

.sales-chart {
  display: block;
  width: 100%;
  height: 180px;
}

.mini-chart .sales-chart {
  height: 120px;
}

.chart-label-row {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 0.75rem;
  text-align: center;
}

.table-wrap {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  min-width: 500px;
}

.data-table th,
.data-table td {
  text-align: left;
  padding: 14px 10px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}

.data-table th {
  color: var(--text-muted);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 800;
}

.data-table td {
  color: var(--text);
  font-weight: 600;
}

.data-table tbody tr:hover {
  background: rgba(109, 40, 217, 0.04);
}

.share-badge,
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
}

.share-badge {
  background: rgba(109, 40, 217, 0.1);
  color: var(--color-accent);
}

.status-badge.active {
  background: rgba(15, 157, 138, 0.12);
  color: var(--color-secondary);
}

.status-badge.suspended {
  background: rgba(255, 122, 0, 0.12);
  color: var(--color-primary);
}

.product-name-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.muted {
  color: var(--text-muted);
  font-size: 0.72rem;
  line-height: 1.45;
  font-weight: 500;
}

@media (max-width: 900px) {
  .sales-dashboard-grid {
    grid-template-columns: 1fr;
  }

  .sales-card,
  .stock-card {
    grid-column: auto;
  }
}

@media (max-width: 620px) {
  .dashboard-card {
    padding: 16px;
  }

  .chart-kpis {
    grid-template-columns: 1fr;
  }

  .card-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
