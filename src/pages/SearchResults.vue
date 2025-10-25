<template>
  <div class="search-results">
    <h2>Search Results for: "{{ searchTerm }}"</h2>
    
    <!-- For now just display query -->
    <p v-if="!searchTerm">No query entered.</p>
    <p v-else>Showing results related to "{{ searchTerm }}"...</p>
  </div>
</template>

<script>
export default {
  name: "SearchResults",
  computed: {
    searchTerm() {
      return this.$route.query.q || "";
    }
  }
};
</script>
