<template>
  <div class="page">
    <section class="hero" aria-hidden="false">
      <div class="header-container">
        <h1>
          Welcome to
          <span class="hero-brand">
            <span class="hero-brand-name">O!clok</span>
            <span class="hero-brand-service">services</span>
          </span>
        </h1>
        <div class="background-notanimated">
          <p ref="animatedText" class="animated-text play">{{ currentPhrase }}</p>
        </div>
      </div>
    </section>

    <section class="trusted-by">
      <div class="section-shell">
        <p class="eyebrow">Trusted By</p>
        <div class="trusted-top">
          <div class="trusted-stats">
            <div v-for="stat in trustedStats" :key="stat.label" class="stat-card">
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </div>
          </div>
          <div class="logo-row">
            <span v-for="brand in trustedBy" :key="brand">{{ brand }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="services-section">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Our Services</p>
          <h2>Smart services for fast-moving teams and growing brands.</h2>
        </div>

        <div class="services-grid">
          <article v-for="service in featuredServices" :key="service.id" class="service-card">
            <div class="service-icon">
              <i :class="['fas', service.icon]"></i>
            </div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description[0] }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="featured-word">
      <div class="section-shell featured-word-card">
        <p class="eyebrow">Featured Word</p>
        <h2>“We turn everyday delivery and digital needs into calm, dependable experiences.”</h2>
        <p>From smart logistics to creative media, O!clok builds practical solutions that feel effortless.</p>
      </div>
    </section>

    <section class="why-oclok">
      <div class="section-shell why-grid">
        <div class="why-intro">
          <p class="eyebrow">Why O!clok</p>
          <h2>Built around convenience, trust, and measurable value.</h2>
          <img src="/images/deliDrone.jpeg" alt="Drone delivery illustration" class="why-image" />
        </div>
        <div class="why-list">
          <div v-for="point in whyPoints" :key="point.title" class="why-item">
            <h3>{{ point.title }}</h3>
            <p>{{ point.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Testimonials</p>
          <h2>Clients trust us to keep their work moving.</h2>
        </div>
        <div class="testimonial-grid">
          <article v-for="item in testimonials" :key="item.name" class="testimonial-card">
            <img :src="item.image" :alt="item.name" class="testimonial-image" />
            <p>“{{ item.quote }}”</p>
            <strong>{{ item.name }}</strong>
            <span>{{ item.role }}</span>
          </article>
        </div>
      </div>
    </section>

    <section class="latest-articles">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Latest Posts</p>
          <h2>Fresh updates from the O!clok team.</h2>
        </div>
        <div v-if="posts.length" class="article-grid">
          <article v-for="post in posts" :key="post.id" class="article-card">
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
            <small>{{ formatDate(post.date) }}</small>
            <a :href="post.url" target="_blank" rel="noopener noreferrer">View on LinkedIn</a>
          </article>
        </div>
        <p v-else class="empty-state">Posts will appear here as soon as they are added.</p>
      </div>
    </section>

    <section class="contact-cta">
      <div class="section-shell contact-card">
        <h2>Ready to launch something smarter?</h2>
        <p>Let’s create a delivery, media, or digital experience that fits your goals.</p>
        <div class="contact-actions">
          <a href="mailto:cambridgemediam@gmail.com" class="primary-btn">Email Us</a>
          <a href="tel:+254732379292" class="secondary-btn">Call Now</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import services from '../data/services.json'

const featuredServices = services.slice(0, 4)
const trustedBy = ['Kisumu SMEs', 'Campus Networks', 'Creative Brands', 'Local Entrepreneurs']
const trustedStats = [
  { value: '50+', label: 'Clients served' },
  { value: '24/7', label: 'Support coverage' },
  { value: '98%', label: 'Repeat engagement' }
]
const whyPoints = [
  {
    title: 'Fast delivery',
    description: 'We move orders and information quickly so your customers stay informed.'
  },
  {
    title: 'Human-centered support',
    description: 'Every service is designed to feel clear, personal, and dependable.'
  },
  {
    title: 'Growth-ready technology',
    description: 'We combine practical tools, media, and infrastructure for long-term momentum.'
  }
]
const testimonials = [
  {
    name: 'Winnie A.',
    role: 'Small Business Owner',
    quote: 'Their team made our launch feel effortless and professional.',
    image: '/images/ROBOto.jpg'
  },
  {
    name: 'Daniel M.',
    role: 'Creative Director',
    quote: 'The delivery and digital support helped us respond faster than ever.',
    image: '/images/dgtl.jpg'
  }
]
const posts = ref([])

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Animated phrases
const phrases = [
  'We serve individuals, families, and businesses',
  'by providing convenient technical services.',
  'Saving you time through smart digital solutions'
]
const phraseIndex = ref(0)
const currentPhrase = ref('Empowering smart living through innovation')
const animatedText = ref(null)
let phraseTimer = null

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
  const elements = document.querySelectorAll('.animate-on-scroll')
  const triggerBottom = window.innerHeight * 0.85
  elements.forEach(el => {
    const top = el.getBoundingClientRect().top
    if (top < triggerBottom) el.classList.add('show')
  })
}

onMounted(async () => {
  _playOnce()
  phraseTimer = setInterval(_nextPhrase, 4000)
  window.addEventListener('scroll', handleScroll)
  handleScroll()

  try {
    const response = await fetch('/linkedin-posts.json')
    if (!response.ok) throw new Error('Unable to load posts')
    posts.value = await response.json()
  } catch (error) {
    console.error('Could not load LinkedIn posts:', error)
  }
})

onBeforeUnmount(() => {
  if (phraseTimer) clearInterval(phraseTimer)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/*================================
O!clok Design System
================================*/
:root {
  --primary: var(--color-primary);
  --primary-dark: var(--color-primary-hover);
  --secondary: var(--color-secondary);
  --dark: var(--bg-dark);
  --dark2: var(--surface-dark);
  --grey: var(--text-muted);
  --light: var(--surface-alt);
  --radius: var(--radius-lg);
  --shadow: var(--shadow-md);
  --transition: 0.35s ease;
  --max-width: 1200px;
}

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

html{
  scroll-behaviour:smooth;
}

body {
  font-family: Inter, Segoe UI, Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

.page{
  overflow-x:hidden;
}

.hero{

background:
linear-gradient(
180deg,
rgba(15,17,24,0.88),
rgba(15,17,24,0.62),
rgba(15,17,24,0.88)),
url('/images/deliDrone.jpeg') center/cover no-repeat;

min-height:78vh;
display:flex;
align-items:center;
padding:clamp(64px, 8vw, 96px) 24px;
position:relative;

overflow:hidden;

}

.hero::before{

content:"";

position:absolute;

width:450px;

height:450px;

background:

radial-gradient(
circle,
rgba(15,157,138,.18),
transparent);

top:-180px;

right:-120px;

border-radius:50%;

}

.hero::after{

content:"";

position:absolute;

width:350px;

height:350px;

background:

radial-gradient(
circle,
rgba(255,122,0,.18),
transparent);

bottom:-120px;

left:-80px;

border-radius:50%;

}

.header-container{

position:relative;

z-index:2;

display:grid;

grid-template-columns:

1.2fr
1fr;

gap:clamp(24px, 5vw, 50px);

align-items:center;

width:min(100%, var(--max-width));

margin:auto;

}

.header-container h1{

font-size:

clamp(
2.6rem,
5vw,
4.7rem);

font-weight:800;

line-height:1.05;

color:white;

margin:0;

}

.hero-brand{
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.hero-brand-name{
  color: var(--primary);
}

.hero-brand-service{
  color: var(--secondary);
}
.background-notanimated{

background:

rgba(255,255,255,.08);

backdrop-filter:

blur(14px);

border:

1px solid rgba(255,255,255,.08);

border-radius:14px;

padding:18px 24px;

display:flex;

align-items:center;

justify-content:flex-start;

min-height:86px;

width:min(100%, 520px);

box-shadow:

var(--shadow);

}

.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15,17,24,0.24), rgba(15,17,24,0.84));
  z-index: 1;
}

.header-container {
  position: relative;
  z-index: 2;
}
.animated-text{

font-size:

clamp(
1rem,
2vw,
1.3rem);

font-weight:500;

color:white;

margin:0;

opacity:0;

transform:

translateY(30px);

}

.animated-text.play{

animation:

fadeTicker

4s ease;

}

@keyframes fadeTicker{

0%{

opacity:0;

transform:
translateY(25px);

}

15%{

opacity:1;

transform:
translateY(0);

}

80%{

opacity:1;

transform:
translateY(0);

}

100%{

opacity:0;

transform:
translateY(-25px);

}

}
.hero-buttons{

display:flex;

gap:18px;

margin-top:35px;

flex-wrap:wrap;

}

.hero-btn{

padding:

14px 28px;

border-radius:50px;

font-weight:700;

transition:.3s;

text-decoration:none;

}

.hero-btn-primary{

background:var(--primary);

color:white;

}

.hero-btn-primary:hover{

background:var(--primary-dark);

transform:translateY(-3px);

}

.hero-btn-outline{

border:2px solid white;

color:white;

}

.hero-btn-outline:hover{

background:white;

color:#111;

}
@media(max-width:900px){

.hero{

padding:50px 20px;

}

.header-container{

grid-template-columns:1fr;

text-align:center;

gap:30px;

}

.background-notanimated{

justify-content:center;

min-height:72px;

margin-inline:auto;

}

.header-container h1{

font-size:2.4rem;

}

.about-container{

grid-template-columns:1fr;

}

.about-image{

order:1;

}

.about-text{

order:2;

}

}

@media(max-width:600px){

.hero{

padding:40px 16px;

min-height:auto;

}

.header-container h1{

font-size:clamp(1.9rem, 7vw, 2.4rem);

line-height:1.15;

}

.background-notanimated{

padding:16px;

width:100%;

}

.animated-text{

text-align:center;

font-size:1rem;

}

.tabs{

padding:0 16px;

margin-bottom:32px;

}

.tabs button{

max-width:none;

flex-basis:100%;

}

.about{

padding:40px 16px 60px;

}

.about-image img{

height:280px;

min-height:280px;

border-radius:18px;

}

.tab-content{

padding:28px;

}

}


/*================================
ABOUT SECTION
================================*/
.about {
  padding: clamp(64px, 8vw, 92px) 24px 100px;
  background: var(--surface-alt);
}

.about-container {
  max-width:var(--max-width);
  margin:auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 60px);
  align-items: center;
}

.about-image{

    position:relative;

}

.about-image img{

    width:100%;

    height:auto;

    min-height:320px;

    aspect-ratio:4 / 5;

    object-fit:cover;

    border-radius:22px;

    box-shadow:
    0 25px 60px rgba(0,0,0,.18);

    transition:.45s ease;

}

.about-image img:hover{

    transform:
    scale(1.02);

}
.about-text{

display:flex;

flex-direction:column;

justify-content:center;

}
.tabs{

display:flex;

justify-content:center;

align-items:center;

gap:16px;

max-width:var(--max-width);

margin:0 auto 45px;

padding:0 24px;

flex-wrap:wrap;

}
.tabs button{

background:var(--surface);

border:none;

padding:14px 28px;

border-radius:50px;

cursor:pointer;

font-size:15px;

font-weight:700;

color:var(--text-muted);

transition:.35s ease;

box-shadow:0 10px 24px rgba(0,0,0,.08);

flex:1 1 220px;

max-width:220px;

}

.tabs button:hover{

transform:

translateY(-3px);

background:var(--secondary);

color:var(--surface);

}

.tabs button.active{

background:var(--primary);

color:var(--surface);

box-shadow:

0 15px 35px rgba(255,107,26,.35);

}
.tab-content{

background:var(--surface);

padding:40px;

border-radius:22px;

box-shadow:

0 20px 45px rgba(0,0,0,.08);

opacity:0;

transform:

translateY(35px);

transition:

.6s ease;

}
.tab-content.show{

opacity:1;

transform:

translateY(0);

}
.tab-content h2{

font-size:

clamp(
1.9rem,
3vw,
2.5rem);

margin-bottom:20px;

color:var(--dark);

font-weight:800;

position:relative;

}

.tab-content h2::after{

content:"";

display:block;

width:70px;

height:5px;

margin-top:12px;

border-radius:5px;

background:

linear-gradient(
90deg,
#ff6b1a,
#18d5c2);

}
.tab-content p{

margin-bottom:18px;

font-size:1.05rem;

line-height:1.8;

color:var(--grey);

}
.social-icons{

display:flex;

gap:16px;

margin-top:35px;

}
.social-icons a{

width:52px;

height:52px;

border-radius:50%;

display:flex;

justify-content:center;

align-items:center;

background:var(--surface);

color:var(--primary);

font-size:20px;

text-decoration:none;

box-shadow:

0 15px 35px rgba(0,0,0,.08);

transition:.35s ease;

}
.social-icons a:hover{

background:var(--primary);

color:var(--surface);

transform:

translateY(-6px);

}
.animate-on-scroll{

opacity:0;

transform:

translateY(35px);

transition:

all .8s ease;

}

.animate-on-scroll.show{

opacity:1;

transform:

translateY(0);

}

@media(max-width:900px){

.about{

padding:60px 20px;

}

.about-container{

grid-template-columns:1fr;

gap:40px;

}

.about-image{

order:1;

}

.about-text{

order:2;

}

.about-image img{

height:380px;

}

.tabs{

justify-content:center;

}

}
@media(max-width:600px){

.about{

padding:40px 16px;

}

.about-image img{

height:280px;

border-radius:18px;

}

.tab-content{

padding:28px;

}

.tab-content h2{

font-size:1.7rem;

}

.tab-content p{

font-size:.97rem;

}

.tabs button{

width:100%;

}

.social-icons{

justify-content:center;

}

}

/* ===========================
   FEATURED PROJECTS
=========================== */

.featured-projects{
    padding:90px 24px;
    background:linear-gradient(
        180deg,
        var(--surface-alt) 0%,
        var(--bg) 100%
    );
}

.featured-projects .section-title{

    text-align:center;

    font-size:
    clamp(2.2rem,4vw,3.4rem);

    color:var(--text);

    font-weight:800;

    margin-bottom:16px;

}

.projects-subtitle{

    max-width:700px;

    margin:0 auto 60px;

    text-align:center;

    color:var(--grey);

    font-size:1.05rem;

}

.projects-grid{

    max-width:1200px;

    margin:auto;

    display:grid;

    grid-template-columns:
    repeat(auto-fit,minmax(280px,1fr));

    gap:32px;

}
.project-card{

    background:var(--surface);

    border-radius:22px;

    height:100%;

    overflow:hidden;

    box-shadow:

    0 20px 45px rgba(0,0,0,.08);

    transition:

    transform .35s ease,

    box-shadow .35s ease;

    display:flex;

    flex-direction:column;

}
.project-card:hover{

    transform:
    translateY(-12px);

    box-shadow:

    0 30px 60px rgba(0,0,0,.15);

}
.project-card img{

    width:100%;

    height:220px;

    object-fit:cover;

    transition:.45s ease;

}

.project-card:hover img{

    transform:scale(1.05);

}
.project-content{

    padding:28px;

    display:flex;

    flex-direction:column;

    flex:1;

    justify-content:space-between;

}
.project-source{

    display:inline-flex;

    align-items:center;

    width:max-content;

    padding:

    6px 14px;

    background:

    rgba(15,157,138,.12);

    color:var(--color-secondary);

    border-radius:30px;

    font-size:.75rem;

    font-weight:700;

    letter-spacing:.05em;

    margin-bottom:18px;

}
.project-content h3{

    font-size:1.45rem;

    margin-bottom:14px;

    color:var(--text);

}
.project-content p{

    color:var(--grey);

    line-height:1.7;

    margin-bottom:25px;

    flex:1;

}
.project-btn{

    align-self:flex-start;

    text-decoration:none;

    padding:

    14px 26px;

    border-radius:50px;

    background:

    linear-gradient(
    135deg,
    var(--primary),
    var(--secondary));

    color:var(--surface);

    font-weight:700;

    transition:.35s ease;

}
.project-btn:hover{

    transform:
    translateY(-3px);

    box-shadow:

    0 14px 30px rgba(255,107,26,.35);

}

.fade-up{

    opacity:0;

    transform:translateY(35px);

    transition:.7s ease;

}

.fade-up.show{

    opacity:1;

    transform:translateY(0);

}
.section-title::after{

    content:"";

    display:block;

    width:80px;

    height:5px;

    margin:18px auto 0;

    border-radius:50px;

    background:

    linear-gradient(
        90deg,
        var(--color-primary),
        var(--color-secondary));

}
@media(max-width:900px){

.featured-projects{

padding:70px 20px;

}

.projects-grid{

gap:24px;

}

.project-card img{

height:200px;

}

}
@media(max-width:600px){

.featured-projects{

padding:50px 16px;

}

.projects-grid{

grid-template-columns:1fr;

}

.project-card{

border-radius:18px;

}

.project-card img{

height:180px;

}

.project-content{

padding:22px;

}

.project-content h3{

font-size:1.25rem;

}

.project-btn{

width:100%;

text-align:center;

}

}

/* ===========================
   NEW HOMEPAGE SECTIONS
=========================== */
.section-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-primary);
}
.section-heading {
  max-width: 720px;
  margin-bottom: 36px;
}
.section-heading h2,
.why-grid h2,
.featured-word-card h2,
.contact-card h2 {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  color: var(--text);
  margin: 0;
}
.trusted-by,
.services-section,
.featured-word,
.why-oclok,
.testimonials,
.latest-articles,
.contact-cta {
  padding: 72px 0;
}
.trusted-by {
  background: var(--surface-alt);
}
.trusted-top {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.trusted-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}
.stat-card {
  padding: 18px 20px;
  border-radius: 16px;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stat-card strong {
  font-size: 1.4rem;
  color: var(--color-primary);
}
.stat-card span {
  color: var(--text-muted);
  font-size: 0.95rem;
}
.logo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}
.logo-row span {
  padding: 12px 18px;
  border-radius: 999px;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  color: var(--text);
  font-weight: 600;
}
.services-grid,
.testimonial-grid,
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}
.service-card,
.testimonial-card,
.article-card {
  padding: 24px;
  border-radius: 20px;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}
.service-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(24, 213, 194, 0.16);
  color: var(--color-primary);
  margin-bottom: 16px;
}
.service-card h3,
.article-card h3,
.why-item h3 {
  margin: 0 0 10px;
  font-size: 1.1rem;
}
.service-card p,
.article-card p,
.why-item p,
.testimonial-card p,
.contact-card p,
.featured-word-card p {
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
}
.featured-word-card {
  padding: 40px 32px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(24, 213, 194, 0.12), rgba(255, 107, 26, 0.12));
}
.why-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 32px;
  align-items: start;
}
.why-intro {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.why-image {
  width: 100%;
  max-width: 420px;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: var(--shadow-md);
}
.why-list {
  display: grid;
  gap: 16px;
}
.why-item {
  padding: 18px 20px;
  border-radius: 16px;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}
.testimonial-card strong {
  display: block;
  margin-top: 16px;
  color: var(--text);
}
.testimonial-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 14px;
  margin-bottom: 16px;
}
.testimonial-card span {
  color: var(--text-muted);
  font-size: 0.95rem;
}
.article-card a {
  display: inline-block;
  margin-top: 16px;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
}
.contact-card {
  padding: 40px 32px;
  border-radius: 24px;
  background: var(--bg-dark);
  color: var(--text-dark);
}
.contact-card p {
  color: rgba(255, 255, 255, 0.72);
  margin-top: 10px;
}
.contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 24px;
}
.primary-btn,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
}
.primary-btn {
  background: var(--color-primary);
  color: var(--text-dark);
}
.secondary-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: var(--text-dark);
}
@media (max-width: 900px) {
  .why-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 600px) {
  .trusted-by,
  .services-section,
  .featured-word,
  .why-oclok,
  .testimonials,
  .latest-articles,
  .contact-cta {
    padding: 56px 0;
  }
  .section-shell {
    padding: 0 16px;
  }
  .featured-word-card,
  .contact-card {
    padding: 28px 20px;
  }
  .contact-actions {
    flex-direction: column;
  }
}
</style>
