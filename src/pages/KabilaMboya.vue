<template>
  <main class="kabila-page">
    <div class="top-bar">
      <RouterLink to="/technicians" class="back-link">Back to Doctors</RouterLink>
    </div>

    <section id="about" class="hero-card">
      <img :src="profileImage" alt="Kabila Mboya" class="profile-image" />
      <div>
        <h1>Kabila Mboya</h1>
        <p class="role">Creative Frontend Developer and Electrical Systems Technician</p>
        <p>
          Practical builder focused on modern web experiences, technician tooling, and reliable service workflows
          for O!clok operations.
        </p>
      </div>
    </section>

    <nav class="quick-nav">
      <a v-for="item in navItems" :key="item.id" :href="`#${item.id}`">{{ item.label }}</a>
    </nav>

    <section id="skills" class="card">
      <h2>Skills</h2>
      <div class="skill-list">
        <div v-for="skill in skills" :key="skill.name" class="skill-item">
          <div class="skill-head">
            <span>{{ skill.name }}</span>
            <span>{{ skill.level }}%</span>
          </div>
          <div class="meter">
            <div class="meter-fill" :style="{ width: `${skill.level}%` }"></div>
          </div>
        </div>
      </div>
    </section>

    <section id="projects" class="card">
      <h2>Projects</h2>
      <div class="project-columns">
        <div>
          <h3>Completed</h3>
          <article v-for="project in completedProjects" :key="project.title" class="project-card">
            <h4>{{ project.title }}</h4>
            <p>{{ project.description }}</p>
            <small>{{ project.time }}</small>
          </article>
        </div>

        <div>
          <h3>Ongoing</h3>
          <article v-for="project in ongoingProjects" :key="project.title" class="project-card">
            <h4>{{ project.title }}</h4>
            <p>{{ project.description }}</p>
            <small>{{ project.time }}</small>
          </article>
        </div>
      </div>
    </section>

    <section id="certifications" class="card">
      <h2>Certifications</h2>
      <ul class="cert-list">
        <li v-for="cert in certifications" :key="cert.title">
          <h4>{{ cert.title }}</h4>
          <p>{{ cert.description }}</p>
        </li>
      </ul>
    </section>

    <section id="blogs" class="card">
      <h2>Blogs and Insights</h2>
      <div class="blog-carousel">
        <img :src="currentBlog.image" :alt="currentBlog.title" class="blog-image" />
        <div class="blog-content">
          <h3>{{ currentBlog.title }}</h3>
          <p>{{ currentBlog.description }}</p>
          <div class="blog-actions">
            <button @click="prevBlog">Prev</button>
            <button @click="nextBlog">Next</button>
          </div>
        </div>
      </div>
    </section>

    <section id="chat" class="chat-anchor"></section>
    <div class="chatbot-container">
      <div v-if="isChatOpen" class="chat-window">
        <h4>Chat with Kabila</h4>
        <p>Welcome. Ask about web projects, technician services, or O!clok collaborations.</p>
        <button class="chat-close" @click="isChatOpen = false">Close</button>
      </div>
      <button class="chat-toggle" @click="isChatOpen = !isChatOpen">Chat</button>
    </div>

    <footer class="page-footer">
      <p>Kisumu, Kenya | kabilamboya@gmail.com</p>
    </footer>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import profileImage from '../assets/images/Mboya.JPG';
import blogImage1 from '../assets/images/BANNER001.jpg';
import blogImage2 from '../assets/images/DRONE.jpg';
import blogImage3 from '../assets/images/ROBOto.jpg';

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'blogs', label: 'Blogs' },
  { id: 'chat', label: 'Chat' },
];

const skills = [
  { name: 'Typing', level: 90 },
  { name: 'CSS', level: 85 },
  { name: 'React', level: 75 },
  { name: 'JavaScript', level: 80 },
  { name: 'Playwright', level: 90 },
  { name: 'Packet Tracer', level: 85 },
  { name: 'Illustrator', level: 75 },
  { name: 'Photoshop', level: 80 },
];

const completedProjects = [
  {
    title: 'Cyber Branding Frontend',
    description: 'Built campaign-ready UI flows for O!clok cyber services with responsive page architecture.',
    time: '3 weeks',
  },
  {
    title: 'Doctor Profile Dashboard',
    description: 'Implemented profile metrics, projects chart, and communication actions for technician pages.',
    time: '2 weeks',
  },
];

const ongoingProjects = [
  {
    title: 'Store Conversion Upgrade',
    description: 'Improving product listing relevance, cart behavior, and fulfillment handoff visibility.',
    time: 'In progress',
  },
  {
    title: 'Automation Assistant Integrations',
    description: 'Extending chatbot and WhatsApp-based service workflows for customer operations.',
    time: 'Ongoing',
  },
];

const certifications = [
  {
    title: 'Frontend Engineering Certificate',
    description: 'Advanced UI architecture, performance optimization, and maintainable component systems.',
  },
  {
    title: 'Network and Systems Fundamentals',
    description: 'Structured networking, troubleshooting, and secure infrastructure basics.',
  },
  {
    title: 'Digital Media Production',
    description: 'Content strategy, visual systems, and multimedia campaign execution.',
  },
];

const blogs = [
  {
    title: 'Building Practical Service Dashboards',
    description: 'How to structure technician-facing interfaces for speed, trust, and accountability.',
    image: blogImage1,
  },
  {
    title: 'Automation for Local Service Businesses',
    description: 'Using bots and lightweight integrations to reduce response time and increase conversions.',
    image: blogImage2,
  },
  {
    title: 'Human-Centered Technical Design',
    description: 'Balancing technical depth with usability in customer-facing products.',
    image: blogImage3,
  },
];

const activeBlog = ref(0);
const isChatOpen = ref(false);

const currentBlog = computed(() => blogs[activeBlog.value]);

const nextBlog = () => {
  activeBlog.value = (activeBlog.value + 1) % blogs.length;
};

const prevBlog = () => {
  activeBlog.value = (activeBlog.value - 1 + blogs.length) % blogs.length;
};
</script>

<style scoped>
.kabila-page {
  max-width: 1040px;
  margin: 0 auto;
  padding: 1.5rem;
  display: grid;
  gap: 1rem;
}

.top-bar {
  display: flex;
  justify-content: flex-start;
}

.back-link {
  text-decoration: none;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  color: #111827;
  font-weight: 600;
}

.hero-card {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 1rem;
  background: #111827;
  color: #f9fafb;
  border-radius: 16px;
  padding: 1rem;
}

.profile-image {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #f59e0b;
}

.role {
  color: #fbbf24;
  font-weight: 700;
}

.quick-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.quick-nav a {
  text-decoration: none;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  color: #111827;
  font-weight: 600;
  font-size: 0.85rem;
}

.card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1rem;
}

.skill-list {
  display: grid;
  gap: 0.7rem;
}

.skill-head {
  display: flex;
  justify-content: space-between;
  font-size: 0.92rem;
  font-weight: 600;
}

.meter {
  width: 100%;
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #f97316);
}

.project-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.project-card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.75rem;
  margin-bottom: 0.7rem;
  background: #f9fafb;
}

.project-card h4 {
  margin: 0 0 0.4rem;
}

.project-card p {
  margin: 0 0 0.5rem;
  color: #374151;
}

.cert-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.65rem;
}

.cert-list li {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.75rem;
}

.blog-carousel {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1rem;
  align-items: center;
}

.blog-image {
  width: 100%;
  height: 210px;
  object-fit: cover;
  border-radius: 10px;
}

.blog-content h3 {
  margin-top: 0;
}

.blog-actions {
  display: flex;
  gap: 0.5rem;
}

.blog-actions button {
  border: 1px solid #f59e0b;
  background: transparent;
  color: #b45309;
  border-radius: 8px;
  padding: 0.45rem 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.chatbot-container {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 1200;
}

.chat-window {
  width: 290px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  background: #111827;
  color: #f9fafb;
  padding: 0.8rem;
  margin-bottom: 0.55rem;
}

.chat-window h4 {
  margin: 0 0 0.4rem;
  color: #fbbf24;
}

.chat-close,
.chat-toggle {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.chat-close {
  background: #374151;
  color: #ffffff;
}

.chat-toggle {
  background: #f59e0b;
  color: #111827;
}

.page-footer {
  text-align: center;
  color: #4b5563;
  padding: 1rem 0 2.2rem;
}

@media (max-width: 860px) {
  .hero-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .profile-image {
    margin: 0 auto;
  }

  .project-columns,
  .blog-carousel {
    grid-template-columns: 1fr;
  }
}
</style>
