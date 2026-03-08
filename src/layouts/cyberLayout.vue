<template>
  <div class="cyber-layout">
    <!-- Sidebar -->
    <CyberSidebar />

    <!-- Main Area -->
    <div class="cyber-main">
      <!-- Header -->
      <header class="cyber-header">
        <slot name="header" />
      </header>

      <!-- Dynamic Content -->
      <main class="cyber-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import CyberSidebar from "../components/cyberSidebar.vue";
</script>

<style scoped>
.cyber-layout {
  display: flex;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
  background-color: #121212;
  color: #f0f0f0;
  font-family: 'Inter', sans-serif;
}

/* MAIN AREA */
.cyber-main {
  flex: 1; /* remaining width */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;
  padding: 0.75rem;
}

/* HEADER */
.cyber-header {
  flex-shrink: 0;
  text-align: left;
  margin-bottom: 0.6rem;
  padding: 0.2rem 0.35rem;
}

.cyber-header h1 {
  font-size: 2rem;
  color: #ffd600;
}

.cyber-header p {
  opacity: 0.8;
  margin-top: 0.5rem;
}

:deep(.header-actions) {
  margin-top: 1.2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

:deep(.btn) {
  padding: 0.6rem 1.4rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s ease;
}

:deep(.btn.primary) {
  background-color: #ffd600;
  color: #121212;
}

:deep(.btn.primary:hover) {
  transform: translateY(-2px);
}

:deep(.btn.secondary) {
  border: 1px solid #ffd600;
  color: #ffd600;
}

:deep(.btn.secondary:hover) {
  background-color: rgba(255, 214, 0, 0.15);
}

/* CONTENT AREA */
.cyber-content {
  flex: 1; /* fills remaining space */
  min-height: 0;
  padding: 0.55rem;
  display: flex;
  overflow: hidden;
  border-radius: 14px;
  background:
    linear-gradient(transparent 24px, rgba(255,255,255,0.03) 25px),
    linear-gradient(90deg, transparent 24px, rgba(255,255,255,0.03) 25px);
  background-size: 25px 25px;
}

:deep(.workspace-root) {
  flex: 1;
  min-height: 0;
  display: flex;
}

:deep(.workspace-root > *) {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .cyber-layout {
    flex-direction: column;
  }

  .cyber-main {
    padding: 1rem;
  }
}
</style>
