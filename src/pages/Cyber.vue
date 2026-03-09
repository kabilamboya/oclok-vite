<template>
  <section class="hero" aria-hidden="false">
        <div class="hero-text">
          <h1>Cyber Studio Workspace</h1>
          <p>Header and sidebar stay fixed. Use this interactive area to satisfy your cafe needs</p>
        </div>
  </section>
  <CyberLayout>
    <template #header>
      <h1>Cyber Studio Workspace</h1>
      <p>Header and sidebar stay fixed. Use this interactive area to satisfy your cafe needs</p>
    </template>

    <div class="workspace-root">
      <router-view />
    </div>
  </CyberLayout>
</template>

<script setup>
import CyberLayout from "../layouts/cyberLayout.vue";
</script>

<style scoped>
.workspace-root {
  flex: 1;
  min-height: 0;
  display: flex;
}

.workspace-root > * {
  flex: 1;
  min-height: 0;
}
</style>
