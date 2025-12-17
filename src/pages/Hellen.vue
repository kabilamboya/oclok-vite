<template>
  <div class="dashboard-wrapper">
    <!-- Header Section -->
    <section class="dashboard-header">
      <h1>Hellen – Sales & Customer Engagement Assistant</h1>
      <p class="employee-info">Delivering excellence in customer satisfaction and operational efficiency</p>
    </section>

    <!-- Summary Cards -->
    <section class="summary-grid">
      <div class="summary-card">
        <h3><span class="icon">👥</span> Total Customers Assisted</h3>
        <p class="value">2,900+</p>
        <span class="badge positive">Consistent</span>
      </div>

      <div class="summary-card">
        <h3><span class="icon">📊</span> Sales Accuracy</h3>
        <p class="value">95%</p>
        <span class="badge positive">Excellent</span>
      </div>

      <div class="summary-card">
        <h3><span class="icon">🔄</span> Repeat Customers</h3>
        <p class="value">+28%</p>
        <span class="badge neutral">Improved</span>
      </div>

      <div class="summary-card">
        <h3><span class="icon">⏱️</span> Attendance Score</h3>
        <p class="value">98%</p>
        <span class="badge positive">Reliable</span>
      </div>
    </section>

    <!-- Two Column Highlights -->
    <section class="two-cols">
      <div class="column">
        <h2>Sales & Customer Service Highlights</h2>
        <ul class="list">
          <li>Consistently assisted 20–35 customers per day with personalized recommendations.</li>
          <li>Maintained 95% accuracy in transaction logging and cash reconciliation.</li>
          <li>Enhanced customer retention via proactive post-purchase engagement.</li>
        </ul>
      </div>

      <div class="column">
        <h2>Operational Contributions</h2>
        <ul class="list">
          <li>Organized and restocked shelves to ensure optimal product presentation.</li>
          <li>Ensured continuous availability of fast-moving items.</li>
          <li>Supported monthly product performance analysis to inform inventory decisions.</li>
        </ul>
      </div>
    </section>

    <!-- Additional Contributions -->
    <section class="full-section">
      <h2>Additional Contributions</h2>
      <ul class="list">
        <li>Provided onboarding training for new staff members.</li>
        <li>Collected customer feedback to guide product improvement and pricing adjustments.</li>
      </ul>
    </section>

    <!-- Supporting Documents -->
    <section class="full-section attachments">
      <h2>Supporting Documents</h2>
      <ol>
        <li>Monthly sales summaries</li>
        <li>Stock & inventory reports</li>
        <li>Customer feedback logs</li>
        <li>Shift & attendance history</li>
      </ol>
      <p class="note">Ensure sensitive information is redacted before sharing.</p>
    </section>

    <!-- Action Buttons -->
    <section class="action-bar">
      <button class="btn primary" @click="printPage">Print / Save</button>
      <button class="btn" @click="downloadPDF">Download PDF</button>
    </section>

    <!-- Charts Section -->
    <section class="full-section" id="charts-section">
      <h2>Performance Analysis</h2>
      <div class="chart-row">
        <div class="chart-box">
          <h3>Sales (Categories)</h3>
          <BarChart :chart-data="salesChartData" :chart-options="chartOptions" />
        </div>

        <div class="chart-box">
          <h3>Customer Types</h3>
          <PieChart :chart-data="customerChartData" :chart-options="chartOptions" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PieController, ArcElement } from 'chart.js'
import { Bar, Pie } from 'vue-chartjs'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PieController, ArcElement)

const salesChartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Sales',
      data: [400, 300, 500, 200, 700, 600],
      backgroundColor: '#0f62fe'
    }
  ]
})

const customerChartData = ref({
  labels: ['New', 'Returning'],
  datasets: [
    {
      data: [70, 30],
      backgroundColor: ['#0f62fe', '#10b981']
    }
  ]
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    tooltip: { enabled: true }
  }
}

function printPage() { window.print() }

function downloadPDF() {
  const element = document.querySelector('.dashboard-wrapper')
  html2canvas(element, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('hellen-dashboard.pdf')
  })
}
</script>

<style scoped>
:root {
  --bg: #f4f6fa;
  --card: #fff;
  --text-dark: #0b1220;
  --muted: #6b7280;
  --primary: #0f62fe;
  --positive: #10b981;
  --neutral: #f59e0b;
  --border: #e5e7eb;
}

.dashboard-wrapper {
  max-width: 1000px;
  margin: auto;
  padding: 32px;
  background: var(--bg);
}

.dashboard-header h1 {
  font-size: 28px;
  margin: 0;
  color: var(--text-dark);
}

.employee-info {
  font-size: 16px;
  font-weight: 600;
  margin-top: 4px;
  color: var(--muted);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
  margin-top: 28px;
}

.summary-card {
  background: var(--card);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  transition: all 0.3s ease;
}
.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.summary-card h3 { 
  font-size: 15px; 
  color: var(--text-dark); 
  margin-bottom: 6px;
}
.summary-card .icon {
  margin-right: 6px;
}
.value { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
.badge { padding: 4px 8px; font-size: 12px; border-radius: 6px; }
.badge.positive { background: #d1fae5; color: var(--positive); }
.badge.neutral { background: #fef3c7; color: var(--neutral); }

.two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin-top: 32px;
}
.column h2 { font-size: 18px; color: var(--text-dark); } 
.list { margin-top: 10px; padding-left: 20px; color: var(--text-dark); } 
.list li { margin-bottom: 10px; line-height: 1.6; }

.full-section { margin-top: 32px; } 
.full-section h2 { font-size: 18px; color: var(--text-dark); } 

.attachments ol { padding-left: 20px; } 
.note { font-size: 13px; color: var(--muted); margin-top: 8px; }

.action-bar {
  margin-top: 40px;
  display: flex;
  gap: 12px;
}
.btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}
.btn:hover { transform: translateY(-2px); }
.btn.primary {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.chart-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 24px;
}
.chart-box { 
  flex: 1; 
  min-width: 300px; 
  background: var(--card); 
  padding: 16px; 
  border-radius: 10px; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
}

@media (max-width: 760px) {
  .two-cols { grid-template-columns: 1fr; }
  .chart-row { flex-direction: column; }
}
</style>
