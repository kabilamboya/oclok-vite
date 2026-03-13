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

      <!-- Footer -->
      <footer class="cyber-footer">
        <slot name="header" />
        <div v-if="headerActions.length" class="header-actions">
          <button
            v-for="action in headerActions"
            :key="action.label"
            :class="['btn', action.type || 'primary']"
            @click="action.handler"
          >
            {{ action.label }}
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from "vue";
import { useRoute } from "vue-router";
import CyberSidebar from "../components/cyberSidebar.vue";

const route = useRoute();

onMounted(() => {
  if (typeof document === "undefined") return;
  document.body.classList.add("cyber-mode");
});

onBeforeUnmount(() => {
  if (typeof document === "undefined") return;
  document.body.classList.remove("cyber-mode");
});

const dispatchHeaderEvent = (name) => () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name));
};

// Header actions driven by the current cyber route
const headerActions = computed(() => {
  switch (route.name) {
    case "Mockups":
      return [
        {
          label: "Export PNG",
          type: "secondary",
          handler: dispatchHeaderEvent("cyber:mockups-export"),
        },
        {
          label: "Refresh Mockups",
          type: "primary",
          handler: dispatchHeaderEvent("cyber:mockups-refresh"),
        },
      ];
    case "Writer":
      return [
        {
          label: "Copy Draft",
          type: "secondary",
          handler: dispatchHeaderEvent("cyber:writer-copy"),
        },
        {
          label: "Clear Draft",
          type: "secondary",
          handler: dispatchHeaderEvent("cyber:writer-clear"),
        },
      ];
    default:
      return [];
  }
});
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
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;
  padding: 0.4rem;
}

/* HEADER */
.cyber-footer {
  flex-shrink: 0;
  text-align: left;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.3rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.cyber-footer h1 {
  font-size: 1.25rem;
  color: #ffd600;
  margin: 0;
}

.cyber-footer p {
  display: none;
}

/* Header actions buttons */
.header-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
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
  gap: 0.4rem;
}

.workspace-root > * {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.65rem;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.03);
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
