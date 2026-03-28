<template>
  <div class="page">
  <section class="hero" aria-hidden="false">
    <!-- Header -->
      <div class="header-container">
        <h1>Welcome to <strong> O!clok services </strong></h1>
        <div class="background-notanimated">
        <p ref="animatedText" class="animated-text play">{{ currentPhrase }}</p>
        </div>
      </div>
    </section>

      <!-- Tabs -->
          <div class="tabs">
            <button :class="{ active: activeTab==='about' }" @click="activeTab='about'">About Us</button>
            <button :class="{ active: activeTab==='mission' }" @click="activeTab='mission'">Our Mission</button>
            <button :class="{ active: activeTab==='vision' }" @click="activeTab='vision'">Our Vision</button>
          </div>

    <!-- Hero / About Tabs Section -->
    <section class="about">
      <div class="about-container">
        <!-- Left Image -->
        <div class="about-image">
          <img src="/images/deliDrone.jpeg" alt="O!clok Store Team" />
        </div>

        <!-- Right Tab Content -->
        <div class="about-text">
          <!-- Tab Panels -->
          <div class="tab-panels">
            <div
              v-show="activeTab==='about'"
              :class="['tab-content', 'animate-on-scroll', { show: activeTab === 'about' }]"
            >
              <h2>About Us</h2>
              <p>
                At <strong>O!clok Services</strong> we provide reliable delivery services using both trained human couriers and emerging autonomous systems, alongside digital marketing,
                web development, and media services that help businesses grow.
              </p>
              <p>
                Our work is built on <strong>convenience, essence, and value</strong> - bringing practical solutions closer to people,
                businesses, and communities, right when they are needed.
              </p>
            </div>

            <div
              v-show="activeTab==='mission'"
              :class="['tab-content', 'animate-on-scroll', { show: activeTab === 'mission' }]"
            >
              <h2>Our Mission</h2>
              <p>
                To provide convenient, efficient, and technology-enabled delivery and digital services that empower individuals
                and businesses to operate smarter and faster.
              </p>
              <p>
                We are committed to combining innovation with a human-centered approach to ensure trust, accessibility,
                and long-term value for every customer we serve.
              </p>
            </div>

            <div
              v-show="activeTab==='vision'"
              :class="['tab-content', 'animate-on-scroll', { show: activeTab === 'vision' }]"
            >
              <h2>Our Vision</h2>
              <p>
                To become a leading smart logistics and digital services platform, shaping the future of delivery,
                commerce, and online engagement across Kenya and beyond.
              </p>
            </div>
          </div>

          <!-- Social Icons -->
          <div class="social-icons animate-on-scroll">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-linkedin-in"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </section>

  <!-- Featured Services from Other Pages -->
  <section class="featured-projects">
    <h2 class="section-title">Our Top Services</h2>
    <p class="projects-subtitle">Highlights pulled from key pages across O!clok.</p>

    <div class="projects-grid">
      <article
        v-for="project in featuredProjects"
        :key="project.id"
        class="project-card animate-on-scroll"
      >
        <img :src="project.image" :alt="project.title" />
        <div class="project-content">
          <span class="project-source">{{ project.source }}</span>
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <RouterLink :to="project.route" class="project-btn">Open Page</RouterLink>
        </div>
      </article>
    </div>
  </section>
</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import services from '../data/services.json'

// Featured services
const featuredServices = services.filter(s => s.featured)

const featuredProjects = [
  {
    id: 1,
    title: 'Media Campaign Studio',
    source: 'From Media Page',
    description: 'Podcast, interview, and content production workflows for brand storytelling.',
    image: '/images/BiGmage.jpg',
    route: '/media'
  },
  {
    id: 2,
    title: 'Creator Lab',
    source: 'From Cyber Page',
    description: 'Writing, mockups, and creative workflows for digital product delivery.',
    image: '/images/dgtl.jpg',
    route: '/cyber/creator'
  },
  {
    id: 3,
    title: 'City Discovery Routes',
    source: 'From Discover Page',
    description: 'Location-based recommendations and curated experiences around Kisumu.',
    image: '/images/AMAZINGRACE.jpg',
    route: '/discover'
  },
  {
    id: 4,
    title: 'Smart Commerce',
    source: 'From Store Page',
    description: 'Products and checkout-ready flows designed for fast online purchases.',
    image: '/images/ROBOto.jpg',
    route: '/products'
  }
]

// Tabs
const activeTab = ref('about')

// Search & filters
const searchQuery = ref('')
const selectedCategory = ref('')
const categories = ["Electronics", "Home", "Fashion"]

// Animated phrases
const phrases = [
  "We serve individuals, families, and businesses",
  "by providing convenient technical services.",
  "Saving you time through smart digital solutions"
]
const phraseIndex = ref(0)
const currentPhrase = ref("Empowering smart living through innovation")
const animatedText = ref(null)
let phraseTimer = null

// Functions
const _playOnce = () => {
  const el = animatedText.value
  if (!el) return
  el.classList.remove('play')
  void el.offsetWidth
  el.classList.add('play')
}

const _nextPhrase = () => {
  phraseIndex.value = (phraseIndex.value + 1) % phrases.length
  currentPhrase.value = phrases[phraseIndex.value]
  _playOnce()
}

const handleScroll = () => {
  const elements = document.querySelectorAll(".animate-on-scroll")
  const triggerBottom = window.innerHeight * 0.85
  elements.forEach(el => {
    const top = el.getBoundingClientRect().top
    if (top < triggerBottom) el.classList.add("show")
  })
}

// Lifecycle
onMounted(() => {
  _playOnce()
  phraseTimer = setInterval(_nextPhrase, 4000)
  window.addEventListener("scroll", handleScroll)
  handleScroll() // initial check
})

onBeforeUnmount(() => {
  if (phraseTimer) clearInterval(phraseTimer)
  window.removeEventListener("scroll", handleScroll)
})
</script>

<style scoped>
.logo {
  width: 56px;
}

.header-container h1 {
  margin-left: 5px; /* FIXED */
  font-size: 2rem;
  color: #ffffff;
  white-space: nowrap;
}

/* Header container – ONE ROW */
.header-container {
  display: flex;
  align-items: center;
  gap: 20px;

  padding: 10px 20px;
  min-height: 20vh;
  width: 100%;
  box-sizing: border-box;
}

/* Static ticker background – EDGE TO EDGE */
.background-notanimated {
  background: rgba(255, 102, 0, 0.95);
  height: 45px;
  padding: 10px 5px;
  border-radius: 5px;

  flex: 1;                 /* 🔑 fills remaining row space */
  overflow: hidden;

  display: flex;
  align-items: center;
}

/* Animated text ONLY */
.animated-text {
  font-size: 1.4rem;
  color: #fff;
  white-space: nowrap;
  line-height: 1.2;      /* 🔑 removes extra vertical space */
  margin: 30px;
  display: flex;
  align-items: center;
  height: 100%;

  opacity: 0;
  transform: translateY(100%);
}

.animated-text.play {
  animation: verticalTicker 4s ease-in-out forwards;
}

/* Vertical ticker animation */
@keyframes verticalTicker {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  15% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-120%);
  }
}

/* --- About Tabs --- */
/* About Section */
.about {
  padding: 20px 10px; /* reduce top/bottom padding */
}

.about-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;         /* reduce gap between image & text */
  align-items: flex-start; /* align top */
  padding: 15px;     /* less padding */
  background: #fff;
  color: #111;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.about-image {
  flex: 1;
  text-align: left;
}

.about-image img {
  max-width: 100%;
  border-radius: 12px;
  display: block;
}

.about-text {
  flex: 1;
  padding: 10px 15px;  /* reduce padding */
  text-align: left;    /* optional, cleaner layout */
}

.tab-content h2 {
  margin: 0 0 10px 0;   /* reduce top/bottom margin */
  font-size: 1.5rem;    /* slightly smaller */
  color: #ff6600;
}

.tab-content p {
  margin: 5px 0;        /* tighter spacing */
  line-height: 1.4;     /* slightly compact */
  color: #333;
}

/* Social Icons */
.social-icons {
  display: flex;
  padding-top: 20px;
  margin-top: 10px;      /* reduce extra spacing */
  justify-content: flex-start;
  gap: 10px;
}

.tabs { 
  display: flex; 
  gap: 10px; 
  justify-content: flex-end; 
  margin-right: 100px; 
  margin-bottom: 20px; 
}

.tabs button { 
  background: #ffcc99 !important;
  border: none; 
  padding: 10px 18px; 
  border-radius: 6px; 
  cursor: pointer; 
  font-weight: bold; 
  transition: all 0.3s ease; 
  color: #111 !important;
}

.tabs button:hover { 
  background: #ff6600 !important;
  color: #fff !important;
}

.tabs button.active { 
  background: #ff6600 !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.5) !important;
}
.tab-content { transition: all 0.6s ease; opacity:0; transform:translateX(40px); }
.tab-content.show { opacity:1; transform:translateX(0); }
.animate-on-scroll { opacity:0; transform:translateY(30px); transition: all 0.8s ease-out; }
.animate-on-scroll.show { opacity:1; transform:translateY(0); }
.social-icons a { color:#fff; background:#ff6600; width:40px; height:40px; display:flex; justify-content:center; align-items:center; border-radius:50%; font-size:1.2rem; transition: transform 0.2s, background 0.3s; }
.social-icons a:hover { transform:scale(1.2); background:#cc5200; color:#fff; }

/* --- Top Services --- */
.featured-services {
  padding: 60px 30px;
  background: #fafafa;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 40px;
  color: #222;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 25px;
}

.service-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
}

.service-card:hover {
  transform: translateY(-6px);
}

.service-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.card-content {
  padding: 18px;
}

.card-content h3 {
  margin: 0 0 8px;
  font-size: 1.2rem;
}

.card-content p {
  font-size: 0.95rem;
  line-height: 1.4;
  color: #555;
}

.price {
  display: block;
  margin: 10px 0;
  font-weight: bold;
  color: #ff6600;
}

.cta-btn {
  background: #ff6600;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.cta-btn:hover {
  background: #e65a00;
}

/* --- Featured Projects --- */
.featured-projects {
  padding: 60px 30px;
  background: #fff7f2;
}

.projects-subtitle {
  text-align: center;
  margin: -20px auto 36px;
  max-width: 720px;
  color: #6b7280;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.project-card {
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.12);
}

.project-card img {
  width: 100%;
  height: 170px;
  object-fit: cover;
}

.project-content {
  padding: 16px;
}

.project-source {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #ff6600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.project-content h3 {
  margin: 0 0 8px;
  font-size: 1.1rem;
}

.project-content p {
  margin: 0 0 14px;
  font-size: 0.92rem;
  color: #4b5563;
  line-height: 1.5;
}

.project-btn {
  display: inline-block;
  background: #ff6600;
  color: #ffffff;
  text-decoration: none;
  padding: 9px 14px;
  border-radius: 7px;
  font-weight: 600;
}

.project-btn:hover {
  background: #e65a00;
}

/* --- Responsive --- */
@media(max-width:768px){.about-container{flex-direction:column;text-align:center;}.about-text{text-align:center;}.social-icons{justify-content:center;}}

@media (max-width: 900px) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
  }

  .header-container h1 {
    white-space: normal;
    font-size: 1.7rem;
  }

  .background-notanimated {
    width: 100%;
    height: 40px;
  }

  .animated-text {
    font-size: 1rem;
    margin: 0;
  }

  .tabs {
    justify-content: center;
    margin-right: 0;
    flex-wrap: wrap;
  }
}

@media (max-width: 600px) {
  .tabs {
    gap: 6px;
  }

  .tabs button {
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .about-container {
    padding: 12px;
  }
}
</style>
