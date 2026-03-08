<template>
  <CyberLayout>
    <template #header>
      <h1>Cyber Studio Workspace</h1>
      <p>Header and sidebar stay fixed. The remaining area is your active creation canvas.</p>
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
