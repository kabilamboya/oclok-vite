<template>
  <div class="cyber-layout">
    <!-- Sidebar -->
    <CyberSidebar />

    <!-- Main Area -->
    <div class="cyber-main">
      <!-- Dynamic Workspace Content -->
      <main class="cyber-content">
        <div class="workspace-root">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from "vue";
import CyberSidebar from "../components/cyberSidebar.vue";

onMounted(() => {
  if (typeof document === "undefined") return;
  document.body.classList.add("cyber-mode");
});

onBeforeUnmount(() => {
  if (typeof document === "undefined") return;
  document.body.classList.remove("cyber-mode");
});

</script>

<style scoped>
.cyber-layout {
  display: flex;
  min-height: 100vh;
  height: 100%;
  overflow: hidden;
  background-color: #121212;
  color: #f0f0f0;
  font-family: 'Inter', sans-serif;
}

/* MAIN AREA */
.cyber-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;
  padding: 0.4rem;
}

.btn {
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s ease;
  font-size: 0.85rem;
}

.btn.primary {
  background-color: #ffd600;
  color: #121212;
}

.btn.primary:hover {
  transform: translateY(-2px);
}

.btn.secondary {
  border: 1px solid #ffd600;
  color: #ffd600;
}

.btn.secondary:hover {
  background-color: rgba(255, 214, 0, 0.15);
}

/* CONTENT AREA */
.cyber-content {
  flex: 1;
  min-height: 0;
  padding: 0.35rem;
  display: flex;
  overflow: auto;
  border-radius: 14px;
  background:
    linear-gradient(transparent 24px, rgba(255,255,255,0.03) 25px),
    linear-gradient(90deg, transparent 24px, rgba(255,255,255,0.03) 25px);
  background-size: 25px 25px;
}

/* Workspace container */
.workspace-root {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.workspace-root > * {
  flex: 1;
  min-height: 0;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .cyber-layout {
    flex-direction: column;
    min-height: 100dvh;
  }

  .cyber-main {
    padding: 0.8rem;
  }

  .cyber-content {
    padding: 0.25rem;
  }
}
</style>
