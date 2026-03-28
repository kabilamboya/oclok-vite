```vue
<template>
  <div class="dashboard-wrapper">

    <!-- HEADER -->
    <section class="dashboard-header">
      <h1>Hellen – Sales & Customer Engagement Assistant</h1>
      <p class="employee-info">
        Delivering excellence in customer satisfaction and operational efficiency
      </p>
    </section>

    <!-- PROFILE -->
    <section class="profile-section">
      <h2>Professional Profile</h2>
      <p>
        Customer-focused sales and engagement professional with experience in
        retail operations, digital marketing, and client relationship
        management. Skilled at maintaining transaction accuracy, assisting
        customers efficiently, and supporting operational decisions through
        performance insights and analytics.
      </p>
    </section>

    <!-- PERFORMANCE METRICS -->
    <section class="summary-grid">
      <div class="summary-card">
        <h3>👥 Total Customers Assisted</h3>
        <p class="value">2,900+</p>
        <span class="badge positive">Consistent</span>
      </div>

      <div class="summary-card">
        <h3>📊 Sales Accuracy</h3>
        <p class="value">95%</p>
        <span class="badge positive">Excellent</span>
      </div>

      <div class="summary-card">
        <h3>🔄 Repeat Customers</h3>
        <p class="value">+28%</p>
        <span class="badge neutral">Improved</span>
      </div>

      <div class="summary-card">
        <h3>⏱️ Attendance Score</h3>
        <p class="value">98%</p>
        <span class="badge positive">Reliable</span>
      </div>
    </section>

    <!-- EXPERIENCE -->
    <section class="full-section">
      <h2>Work Experience</h2>

      <div class="job">
        <h3>Business Development Associate – Dooprime</h3>
        <span class="date">2025 – Present</span>
        <ul>
          <li>Onboarded and supported new trading clients.</li>
          <li>Guided customers through account setup and verification.</li>
          <li>Managed lead generation and client communication.</li>
        </ul>
      </div>

      <div class="job">
        <h3>Office Administrator – Q Zone Pest Management</h3>
        <span class="date">2024 – 2025</span>
        <ul>
          <li>Handled client correspondence and scheduling.</li>
          <li>Maintained office communication systems.</li>
          <li>Supported operational administration tasks.</li>
        </ul>
      </div>

      <div class="job">
        <h3>Social Media Content Creator – Freelance</h3>
        <span class="date">2022 – 2023</span>
        <ul>
          <li>Produced marketing content for brands.</li>
          <li>Analyzed engagement metrics.</li>
          <li>Applied SEO and hashtag strategies.</li>
        </ul>
      </div>

      <div class="job">
        <h3>Social Media Manager – FUNK Media</h3>
        <span class="date">2019 – 2021</span>
        <ul>
          <li>Managed social media campaigns.</li>
          <li>Tracked engagement analytics.</li>
          <li>Developed digital marketing strategies.</li>
        </ul>
      </div>
    </section>

    <!-- EDUCATION -->
    <section class="full-section">
      <h2>Education</h2>

      <div class="job">
        <h3>University of Nairobi</h3>
        <span class="date">2017 – 2022</span>
        <p>Bachelor of Arts – Tourism, Language & Communications</p>
      </div>

      <div class="job">
        <h3>Alliance Française Nairobi</h3>
        <span class="date">2018</span>
        <p>French A1 Certificate</p>
      </div>
    </section>

    <!-- SKILLS -->
    <section class="full-section">
      <h2>Skills</h2>

      <div class="skills">
        <span>Customer Engagement</span>
        <span>Sales Operations</span>
        <span>CRM Systems</span>
        <span>Content Creation</span>
        <span>Digital Marketing</span>
        <span>MS Office</span>
      </div>
    </section>

    <!-- LANGUAGES -->
    <section class="full-section">
      <h2>Languages</h2>

      <ul class="list">
        <li>English – Fluent</li>
        <li>Kiswahili – Fluent</li>
        <li>French – Basic</li>
      </ul>
    </section>

    <!-- HIGHLIGHTS -->
    <section class="two-cols">
      <div class="column">
        <h2>Sales & Customer Service Highlights</h2>
        <ul class="list">
          <li>Assisted 20–35 customers daily with personalized service.</li>
          <li>Maintained 95% accuracy in sales transactions.</li>
          <li>Improved customer retention through follow-up engagement.</li>
        </ul>
      </div>

      <div class="column">
        <h2>Operational Contributions</h2>
        <ul class="list">
          <li>Maintained organized retail displays.</li>
          <li>Ensured availability of fast-moving items.</li>
          <li>Supported inventory performance analysis.</li>
        </ul>
      </div>
    </section>

    <!-- CHARTS -->
    <section class="full-section">
      <h2>Performance Analytics</h2>

      <div class="chart-row">
        <div class="chart-box">
          <h3>Monthly Sales</h3>
          <BarChart :chart-data="salesChartData" :chart-options="chartOptions" />
        </div>

        <div class="chart-box">
          <h3>Customer Types</h3>
          <PieChart :chart-data="customerChartData" :chart-options="chartOptions" />
        </div>
      </div>
    </section>

    <!-- ACTIONS -->
    <section class="action-bar">
      <button class="btn primary" @click="printPage">Print / Save</button>
      <button class="btn" @click="downloadPDF">Download PDF</button>
    </section>

    <!-- REFEREES -->
    <section class="full-section">
      <h2>Referees</h2>

      <div class="ref">
        <p><strong>Wonipher Manyara</strong></p>
        <p>Funk Media Manager</p>
        <p>0725 592 641</p>
      </div>

      <div class="ref">
        <p><strong>Polycarp Odima</strong></p>
        <p>Retail Supervisor</p>
        <p>+254 722 849 377</p>
      </div>

      <div class="ref">
        <p><strong>Iman Ibrahim</strong></p>
        <p>Retail Supervisor</p>
        <p>+254 112 255 639</p>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from "vue"
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PieController, ArcElement } from "chart.js"
import { Bar as BarChart, Pie as PieChart } from "vue-chartjs"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement
)

const salesChartData = ref({
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Sales",
      data: [400, 300, 500, 200, 700, 600],
      backgroundColor: "#0f62fe"
    }
  ]
})

const customerChartData = ref({
  labels: ["New", "Returning"],
  datasets: [
    {
      data: [70, 30],
      backgroundColor: ["#0f62fe", "#10b981"]
    }
  ]
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "bottom" }
  }
}

function printPage() {
  window.print()
}

function downloadPDF() {
  const element = document.querySelector(".dashboard-wrapper")

  html2canvas(element, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")

    const width = pdf.internal.pageSize.getWidth()
    const height = (canvas.height * width) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, width, height)
    pdf.save("hellen-performance-cv.pdf")
  })
}
</script>

<style scoped>
.dashboard-wrapper{
  max-width:1000px;
  margin:auto;
  padding:32px;
  background:#f4f6fa;
  font-family:Arial, Helvetica, sans-serif;
}

.dashboard-header h1{
  font-size:28px;
}

.employee-info{
  color:#6b7280;
  font-weight:600;
}

.profile-section{
  margin-top:25px;
  background:#fff;
  padding:20px;
  border-radius:10px;
}

.summary-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:18px;
  margin-top:28px;
}

.summary-card{
  background:#fff;
  padding:20px;
  border-radius:12px;
  border:1px solid #e5e7eb;
}

.value{
  font-size:24px;
  font-weight:700;
}

.badge{
  padding:4px 8px;
  border-radius:6px;
  font-size:12px;
}

.badge.positive{
  background:#d1fae5;
  color:#10b981;
}

.badge.neutral{
  background:#fef3c7;
  color:#f59e0b;
}

.two-cols{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:28px;
  margin-top:32px;
}

.full-section{
  margin-top:32px;
}

.skills{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}

.skills span{
  background:#eef2ff;
  padding:6px 12px;
  border-radius:6px;
}

.list{
  padding-left:20px;
}

.chart-row{
  display:flex;
  flex-wrap:wrap;
  gap:24px;
}

.chart-box{
  flex:1;
  min-width:300px;
  background:#fff;
  padding:16px;
  border-radius:10px;
}

.action-bar{
  margin-top:40px;
  display:flex;
  gap:12px;
}

.btn{
  padding:10px 16px;
  border-radius:8px;
  cursor:pointer;
  border:1px solid #ddd;
}

.btn.primary{
  background:#0f62fe;
  color:#fff;
}

.ref{
  margin-top:10px;
}

@media(max-width:760px){
  .two-cols{
    grid-template-columns:1fr;
  }
}

@media (max-width: 900px) {
  .dashboard-wrapper{
    padding:24px;
  }

  .dashboard-header h1{
    font-size:22px;
  }
}

@media (max-width: 700px) {
  .chart-row{
    flex-direction:column;
  }

  .chart-box{
    min-width:0;
  }

  .action-bar{
    flex-direction:column;
    align-items:stretch;
  }

  .btn{
    width:100%;
  }

  .chatbot-container{
    right:12px;
    bottom:12px;
  }

  .chat-window{
    width:min(92vw, 320px);
  }
}

@media (max-width: 520px) {
  .dashboard-wrapper{
    padding:16px;
  }

  .summary-grid{
    grid-template-columns:1fr;
  }

  .blog-actions{
    flex-direction:column;
    align-items:stretch;
  }

  .blog-actions button{
    width:100%;
  }
}
</style>
```
