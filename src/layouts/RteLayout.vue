<template>
  <section class="rte-layout">
    <div v-if="$slots.toolbar" class="rte-toolbar-slot">
      <slot name="toolbar" />
    </div>

    <div class="rte-body" :style="bodyStyle">
      <aside v-if="hasAside && asidePosition === 'left'" class="rte-aside">
        <slot name="aside" />
      </aside>

      <div class="rte-main">
        <slot name="main" />
      </div>

      <aside v-if="hasAside && asidePosition === 'right'" class="rte-aside">
        <slot name="aside" />
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, useSlots } from "vue";

const props = defineProps({
  zoom: { type: Number, default: 100 },
  columns: {
    type: String,
    default: "minmax(0, 1.5fr) minmax(320px, 0.5fr)",
  },
  asidePosition: { type: String, default: "right" },
});

const slots = useSlots();
const hasAside = computed(() => !!slots.aside);

const bodyStyle = computed(() => ({
  transform: `scale(${props.zoom / 100})`,
  transformOrigin: "0 0",
  gridTemplateColumns: hasAside.value ? props.columns : "minmax(0, 1fr)",
}));
</script>

<style scoped>
.rte-layout {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.rte-toolbar-slot {
  flex-shrink: 0;
}

.rte-body {
  flex: 1;
  min-height: 0;
  display: grid;
  gap: 0.9rem;
  overflow: auto;
}

.rte-main,
.rte-aside {
  min-height: 0;
}

@media (max-width: 1200px) {
  .rte-body {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 900px) {
  .rte-body {
    transform: none !important;
    width: 100%;
  }
}
</style>
