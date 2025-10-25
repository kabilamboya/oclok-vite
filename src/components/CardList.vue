<template>
  <div class="cards-container"> <!-- use global container class -->
    <CardItem
      v-for="item in cardItems"
      :key="item.id"
      :item="item"
      :type="type"
    />
  </div>
</template>

<script>
import CardItem from './CardItem.vue';

export default {
  name: 'CardsList',
  components: { CardItem },
  props: {
    cardItems: { type: Array, required: true },
    type: { type: String, required: true }
  }
};
</script>

<style scoped>
/* Optional: any overrides specific to this component */
.cards-container {
  justify-content: flex-start; /* ensures cards align to start */
}
</style>
