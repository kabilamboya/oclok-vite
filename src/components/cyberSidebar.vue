<template>
  <aside class="cyber-sidebar" :class="{ 'is-collapsed': isCollapsed }">
    <div class="sidebar-top">
      <div class="sidebar-brand">
        <span class="brand-mark">OC</span>
        <span class="brand-text">Cyber Studio</span>
      </div>
      <button
        class="collapse-toggle"
        type="button"
        :aria-expanded="!isCollapsed"
        :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="toggleCollapse"
      >
        <i class="fas" :class="isCollapsed ? 'fa-angle-double-right' : 'fa-angle-double-left'"></i>
      </button>
    </div>

    <nav class="sidebar-nav" aria-label="Cyber navigation">
      <router-link
        :to="{ name: 'CyberHome' }"
        class="nav-link"
        exact-active-class="active-link"
        aria-label="Cyber Home"
        title="Cyber Home"
      >
        <i class="fas fa-home"></i>
        <span class="nav-label">Home</span>
      </router-link>

      <div class="nav-group">
        <button
          v-if="!isCollapsed"
          class="nav-section"
          type="button"
          :class="{ 'is-active': isCreateActive }"
          :aria-expanded="isCreateExpanded"
          @click="toggleCreate"
        >
          <span>CREATE</span>
          <i class="fas" :class="isCreateExpanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
        </button>
        <div v-show="isCreateExpanded" class="nav-group-links">
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
        </div>
      </div>

      <div class="nav-group">
        <button
          v-if="!isCollapsed"
          class="nav-section"
          type="button"
          :class="{ 'is-active': isDesignActive }"
          :aria-expanded="isDesignExpanded"
          @click="toggleDesign"
        >
          <span>DESIGN</span>
          <i class="fas" :class="isDesignExpanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
        </button>
        <div v-show="isDesignExpanded" class="nav-group-links">
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
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const STORAGE_KEY = "oclok_cyber_sidebar_collapsed";

const isCollapsed = ref(true);
const isCreateOpen = ref(true);
const isDesignOpen = ref(true);

const routeName = computed(() => (typeof route.name === "string" ? route.name : ""));
const isCreateActive = computed(() => ["Prompts", "Writer"].includes(routeName.value));
const isDesignActive = computed(() => ["Mockups", "Gallery"].includes(routeName.value));

const isCreateExpanded = computed(
  () => isCollapsed.value || isCreateOpen.value || isCreateActive.value
);
const isDesignExpanded = computed(
  () => isCollapsed.value || isDesignOpen.value || isDesignActive.value
);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const toggleCreate = () => {
  isCreateOpen.value = !isCreateOpen.value;
};

const toggleDesign = () => {
  isDesignOpen.value = !isDesignOpen.value;
};

onMounted(() => {
  if (typeof window === "undefined") return;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  isCollapsed.value = stored === "true";
});

watch(isCollapsed, (value) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, String(value));
});
</script>

<style scoped>
.cyber-sidebar {
  width: 240px;
  flex-shrink: 0;
  height: 100vh;
  background-color: #1a1a1a;
  padding: 1.2rem 0.9rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #2a2a2a;
  font-family: "Inter", sans-serif;
  transition: width 0.25s ease, padding 0.25s ease;
}

.cyber-sidebar.is-collapsed {
  width: 72px;
  padding: 1.2rem 0.6rem;
}

.sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
}

.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255, 214, 0, 0.18);
  color: #ffd600;
  display: grid;
  place-items: center;
  font-weight: 700;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}

.brand-text {
  font-weight: 700;
  font-size: 0.95rem;
  color: #f2f2f2;
  white-space: nowrap;
}

.collapse-toggle {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid #2a2a2a;
  background: transparent;
  color: #cfcfcf;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.collapse-toggle:hover {
  border-color: #ffd600;
  color: #ffd600;
}

.cyber-sidebar.is-collapsed .brand-text {
  display: none;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  width: 100%;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.nav-group-links {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.nav-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.35rem 0.6rem;
  border: none;
  background: transparent;
  color: #9b9b9b;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s ease;
}

.nav-section.is-active {
  color: #ffd600;
}

.nav-link {
  color: #f0f0f0;
  text-decoration: none;
  font-weight: 600;
  width: 100%;
  height: 44px;
  padding: 0.4rem 0.7rem;
  border-radius: 12px;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 0.7rem;
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
  font-size: 0.92rem;
}

.nav-link i {
  font-size: 1.05rem;
}

.cyber-sidebar.is-collapsed .sidebar-nav {
  align-items: center;
}

.cyber-sidebar.is-collapsed .nav-section {
  display: none;
}

.cyber-sidebar.is-collapsed .nav-link {
  width: 44px;
  padding: 0.4rem;
  justify-content: center;
}

.cyber-sidebar.is-collapsed .nav-label {
  display: none;
}

@media (max-width: 768px) {
  .cyber-sidebar {
    width: 100% !important;
    height: auto;
    flex-direction: row;
    align-items: center;
    padding: 0.6rem;
    gap: 0.6rem;
    border-right: none;
    border-bottom: 1px solid #2a2a2a;
    overflow-x: auto;
  }

  .sidebar-top {
    margin-bottom: 0;
    flex: 0 0 auto;
  }

  .sidebar-brand .brand-text {
    display: none;
  }

  .sidebar-nav {
    flex-direction: row;
    gap: 0.4rem;
    width: auto;
    overflow-x: auto;
  }

  .nav-group,
  .nav-group-links {
    flex-direction: row;
  }

  .nav-section {
    display: none !important;
  }

  .nav-link {
    width: 44px;
    padding: 0.4rem;
    justify-content: center;
    flex: 0 0 auto;
  }

  .nav-label {
    display: none !important;
  }
}
</style>
