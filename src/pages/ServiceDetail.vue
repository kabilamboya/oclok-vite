<template>
  <div v-if="service" class="service-detail">
    <button class="back-btn" @click="$router.push('/services')">← Back to Services</button>

    <div class="service-card">
      <div class="image-container">
        <img :src="service.image" :alt="service.title" />
      </div>
      <div class="service-info">
        <h1>{{ service.title }}</h1>
        <p>{{ service.description }}</p>
        <button class="book-btn">Book Service</button>
      </div>
    </div>
  </div>
</template>

<script>
import services from '../data/services.json';

export default {
  props: ['id'],
  computed: {
    service() {
      return services.find(s => s.id === parseInt(this.id));
    }
  }
};
</script>

<style scoped>
.service-detail {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
}

.back-btn {
  background: transparent;
  border: none;
  color: #ff6600;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 1rem;
}

.service-card {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  overflow: hidden;
}

.image-container {
  flex: 1 1 300px;
  max-width: 400px;
  background: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.image-container img {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.service-info {
  flex: 2 1 400px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.service-info h1 {
  font-size: 2rem;
  margin-bottom: 15px;
  color: #222;
}

.service-info p {
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 30px;
}

.book-btn {
  background: #ff6600;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.book-btn:hover {
  background: #e65c00;
}

@media (max-width: 768px) {
  .service-card {
    flex-direction: column;
  }
  .image-container, .service-info {
    max-width: 100%;
    flex: 1 1 100%;
  }
}
</style>
