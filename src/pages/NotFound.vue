<template>
  <div class="notfound">
    <h1>404 - Page Not Found</h1>
    <p>Oops! The page you’re looking for doesn’t exist.</p>
    <router-link :to="{ name: 'Home' }">Go back Home</router-link>
  </div>
</template>

<script>
export default {
  name: "NotFound"
};
</script>

<style scoped>
.notfound {
  text-align: center;
  padding: 50px;
}
.notfound h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #ff6600;
}
.notfound p {
  margin-bottom: 20px;
}
</style>
