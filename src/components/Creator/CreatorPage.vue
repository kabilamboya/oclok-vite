<template>
  <section class="creator-wrapper">
    <!-- PAGE TITLE -->
    <h1 class="title">Convenience. Essence. Value</h1>

    <!-- TABS NAVIGATION -->
    <div class="tabs">
      <button
        :class="['tab', activeTab === 'writer' && 'active']"
        @click="activeTab = 'writer'"
      >
        ✍️ Writer
      </button>

      <button
        :class="['tab', activeTab === 'mockup' && 'active']"
        @click="activeTab = 'mockup'"
      >
        🎨 Mockup Studio
      </button>

      <button
        :class="['tab', activeTab === 'gallery' && 'active']"
        @click="activeTab = 'gallery'"
      >
        🖼 Design Gallery
      </button>
    </div>

    <!-- TAB CONTENT -->
    <div class="tab-content">
      <Writer
        v-if="activeTab === 'writer'"
        @add-to-cart="forwardToCart"
      />

      <Mockup
        v-if="activeTab === 'mockup'"
        @add-to-cart="forwardToCart"
      />

      <Gallery
        v-if="activeTab === 'gallery'"
      />
    </div>
  </section>
</template>

<script>
import Writer from "@/components/Creator/WriterPage.vue";
import Mockup from "@/components/Creator/MockupPage.vue";
import Gallery from "@/components/Creator/DesignGallery.vue";

export default {
  name: "CreatorPage",
  components: {
    Writer,
    Mockup,
    Gallery
  },
  data() {
    return {
      activeTab: "writer"
    };
  },
  methods: {
    forwardToCart(item) {
      this.$emit("add-to-cart", item);
    }
  }
};
</script>

<style scoped>
.creator-wrapper {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  color: #f0f0f0;
}

.title {
  text-align: center;
  font-size: 2rem;
  color: #ffd600;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.tab {
  padding: 0.5rem 1rem;
  background: #1c1c1c;
  border: 1px solid #333;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
}

.tab.active {
  background: #ffd600;
  color: #121212;
  border-color: #ffd600;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
