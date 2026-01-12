<template>
  <section class="cyber-layout">
    <!-- SIDEBAR NAVIGATION -->
    <aside class="cyber-sidebar">
      <h2 class="sidebar-title">O!clok Cyber</h2>
      <nav class="sidebar-nav">
        <router-link to="/cyber/creator" class="nav-link" active-class="active-link">✍️ Writer</router-link>
        <router-link to="/cyber/mockups" class="nav-link" active-class="active-link">🖼 Mockups</router-link>
        <router-link to="/cyber/gallery" class="nav-link" active-class="active-link">🎨 Gallery</router-link>
      </nav>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <div class="cyber-main">
      <!-- HEADER -->
      <header class="cyber-header">
        <h1>Convenience. Essence. Value.</h1>
      </header>

      <!-- ROUTER VIEW CONTENT -->
      <main class="cyber-content">
        <router-view />
      </main>
    </div>
  </section>

  <!-- TESTIMONIALS -->
  <section class="testimonials">
    <h2>What Our Clients Say</h2>
    <div class="testimonial-grid">
      <article v-for="(item, i) in testimonials" :key="i">
        <p>“{{ item.message }}”</p>
        <strong>{{ item.name }}</strong>
      </article>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  { name: "James O.", message: "Professional cyber solutions delivered on time." },
  { name: "Linda K.", message: "Creative, secure and highly reliable." },
  { name: "Mark T.", message: "Excellent design and fast delivery!" },
  { name: "Sophia R.", message: "Highly recommended for cyber projects." },
]
</script>

<style scoped>
/* ===== LAYOUT ===== */
.cyber-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #121212;
  color: #f0f0f0;
}

/* ===== SIDEBAR ===== */
.cyber-sidebar {
  width: 220px;
  background-color: #1a1a1a;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #333;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-title {
  font-size: 1.5rem;
  color: #ffd600;
  margin-bottom: 2rem;
  text-align: center;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-link {
  color: #f0f0f0;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  border-radius: 5px;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: #ffd60033;
  color: #ffd600;
}

.active-link {
  background-color: #ffd600;
  color: #121212;
}

/* ===== MAIN CONTENT ===== */
.cyber-main {
  margin-left: 220px;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

/* HEADER */
.cyber-header {
  text-align: center;
  margin-bottom: 2rem;
}

.cyber-header h1 {
  font-size: 2rem;
  color: #ffd600;
}

/* ROUTER VIEW CONTENT */
.cyber-content {
  flex: 1;
  padding: 1rem;
  background-color: #1c1c1c;
  border-radius: 10px;
}

/* ===== TESTIMONIALS ===== */
.testimonials {
  background: #f8fafc;
  padding: 6rem 2rem;
  text-align: center;
}

.testimonials h2 {
  color: #121212;
  font-size: 2rem;
  margin-bottom: 3rem;
}

.testimonial-grid {
  display: grid;
  gap: 2rem;
  max-width: 900px;
  margin: auto;
}

.testimonial-grid article {
  background: #fff;
  color: #121212;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.testimonial-grid article:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.testimonial-grid article p {
  font-style: italic;
  margin-bottom: 1rem;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .cyber-layout {
    flex-direction: column;
  }

  .cyber-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    flex-direction: row;
    justify-content: center;
    padding: 1rem 0;
    border-right: none;
    border-bottom: 1px solid #333;
  }

  .sidebar-nav {
    flex-direction: row;
    gap: 1rem;
  }

  .cyber-main {
    margin-left: 0;
    padding: 1rem;
  }

  .cyber-header h1 {
    font-size: 1.5rem;
  }

  .testimonial-grid {
    gap: 1.5rem;
  }
}
</style>
