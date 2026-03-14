<template>
  <aside class="cyber-sidebar">
    <h2 class="sidebar-title" aria-label="O!clok Cyber" title="O!clok Cyber">O!</h2>

    <nav class="sidebar-nav">
      <!-- CREATE Section -->
      <span class="nav-section">CREATE</span>
      <router-link
        to="/cyber/prompts"
        class="nav-link"
        active-class="active-link"
        aria-label="AI Prompt Training"
        title="AI Prompt Training"
      >
        <i class="fas fa-brain"></i>
        <span class="nav-label">Train Prompts</span>
      </router-link>
      <router-link
        to="/cyber/writer"
        class="nav-link"
        active-class="active-link"
        aria-label="Writing Canvas"
        title="Writing Canvas"
      >
        <i class="fas fa-pen"></i>
        <span class="nav-label">Writer</span>
      </router-link>

      <!-- DESIGN Section -->
      <span class="nav-section">DESIGN</span>
      <router-link
        to="/cyber/mockups"
        class="nav-link"
        active-class="active-link"
        aria-label="Design Canvas"
        title="Design Canvas"
      >
        <i class="fas fa-paint-brush"></i>
        <span class="nav-label">Mockups</span>
      </router-link>
      <router-link
        to="/cyber/gallery"
        class="nav-link"
        active-class="active-link"
        aria-label="Gallery"
        title="Gallery"
      >
        <i class="fas fa-images"></i>
        <span class="nav-label">Gallery</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup></script>

<style scoped>
.cyber-sidebar {
  width: 72px;
  flex-shrink: 0;
  height: 100vh;
  background-color: #1a1a1a;
  padding: 1.2rem 0.6rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #2a2a2a;
  font-family: "Inter", sans-serif;
  align-items: center;
}

.sidebar-title {
  font-size: 1.1rem;
  color: #ffd600;
  text-align: center;
  margin-bottom: 1.2rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  width: 100%;
  align-items: center;
}

.nav-section {
  display: none;
}

.nav-link {
  color: #f0f0f0;
  text-decoration: none;
  font-weight: 600;
  width: 44px;
  height: 44px;
  padding: 0.4rem;
  border-radius: 12px;
  transition: all 0.25s ease;
  display: grid;
  place-items: center;
}

.nav-link:hover {
  background-color: rgba(255, 214, 0, 0.15);
  color: #ffd600;
}

.active-link {
  background-color: #ffd600;
  color: #121212;
  box-shadow: 0 0 12px rgba(255, 214, 0, 0.4);
}

.nav-label {
  display: none;
}

.nav-link i {
  font-size: 1.05rem;
}
</style>
