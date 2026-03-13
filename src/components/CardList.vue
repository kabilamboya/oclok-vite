<template>
  <div class="cards-container"> <!-- use global container class -->
    <CardItem
      v-for="item in cardItems"
      :key="item.id"
      :item="item"
      :type="type"
      :clickable="clickable"
      :show-projects="showProjects"
      :show-experience="showExperience"
      :show-rating="showRating"
      :primary-label="primaryLabel"
      :secondary-label="secondaryLabel"
      :secondary-href="secondaryHref"
      @primary="$emit('primary', $event)"
      @secondary="$emit('secondary', $event)"
      @select="$emit('select', $event)"
    />
  </div>
</template>

<script>
import CardItem from './CardItem.vue';

export default {
  name: 'CardsList',
  emits: ["primary", "secondary", "select"],
  components: { CardItem },
  props: {
    cardItems: { type: Array, required: true },
    type: { type: String, default: "generic" },
    clickable: { type: Boolean, default: false },
    showProjects: { type: Boolean, default: false },
    showExperience: { type: Boolean, default: true },
    showRating: { type: Boolean, default: true },
    primaryLabel: { type: String, default: "" },
    secondaryLabel: { type: String, default: "" },
    secondaryHref: { type: String, default: "" },
  }
};
</script>

<style scoped>
/* Optional: any overrides specific to this component */
.cards-container {
  justify-content: flex-start; /* ensures cards align to start */
}
</style>
