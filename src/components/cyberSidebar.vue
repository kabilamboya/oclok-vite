<template>
  <aside class="cyber-sidebar">
    <h2 class="sidebar-title">O!clok Cyber</h2>
    <h2 class="canvas-title">Canvas</h2>

    <div class="sidebar-cta-group">
      <router-link to="/cyber/creator" class="sidebar-cta primary-cta">
        Writing Canvas
      </router-link>
      <router-link to="/cyber/mockups" class="sidebar-cta secondary-cta">
        Design Canvas
      </router-link>
    </div>

    <nav class="sidebar-nav">
      <span class="nav-section">CREATE</span>
      <router-link to="/cyber/creator" class="nav-link" active-class="active-link">
        AI Prompt Studio
      </router-link>

      <span class="nav-section">DESIGN</span>
      <router-link to="/cyber/mockups" class="nav-link" active-class="active-link">
        Mockups
      </router-link>
      <router-link to="/cyber/gallery" class="nav-link" active-class="active-link">
        Gallery
      </router-link>
    </nav>
  </aside>
</template>

<script setup></script>

<style scoped>
.cyber-sidebar {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  background-color: #1a1a1a;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #2a2a2a;
  font-family: "Inter", sans-serif;
}

.sidebar-title {
  font-size: 1.4rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  text-align: center;
  font-weight: bold;
}

.canvas-title {
  font-size: 1rem;
  color: #ffffff;
  margin: 0 0 0.85rem;
  text-align: center;
  font-weight: 700;
}

.sidebar-cta-group {
  display: grid;
  gap: 0.55rem;
  margin-bottom: 1rem;
}

.sidebar-cta {
  display: block;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 700;
  padding: 0.55rem 0.75rem;
  text-align: center;
  transition: all 0.25s ease;
}

.primary-cta {
  background-color: #ffd600;
  color: #121212;
}

.primary-cta:hover {
  transform: translateY(-2px);
}

.secondary-cta {
  border: 1px solid #ffd600;
  color: #ffd600;
}

.secondary-cta:hover {
  background-color: rgba(255, 214, 0, 0.15);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-section {
  position: relative;
  font-size: 0.7rem;
  letter-spacing: 1.5px;
  opacity: 0.6;
  margin: 1.5rem 0 0.5rem;
}

.nav-section::after {
  content: "";
  display: block;
  height: 1px;
  background: #ff6600;
  margin-top: 0.5rem;
}

.nav-link {
  color: #f0f0f0;
  text-decoration: none;
  font-weight: 600;
  padding: 0.55rem 0.8rem;
  border-radius: 8px;
  transition: all 0.25s ease;
}

.nav-link:hover {
  background-color: rgba(255, 214, 0, 0.15);
  color: #ffd600;
  transform: translateX(4px);
}

.active-link {
  background-color: #ffd600;
  color: #121212;
  box-shadow: 0 0 12px rgba(255, 214, 0, 0.4);
}

@media (max-width: 768px) {
  .cyber-sidebar {
    position: static;
    width: 100%;
    height: auto;
    flex-direction: column;
    justify-content: flex-start;
    border-right: none;
    border-bottom: 1px solid #2a2a2a;
    padding: 1rem 0.5rem;
  }

  .sidebar-title,
  .canvas-title {
    text-align: center;
  }

  .sidebar-cta-group {
    grid-template-columns: 1fr 1fr;
  }

  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .nav-section {
    display: none;
  }
}
</style>
