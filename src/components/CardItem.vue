<template>
  <div 
    class="card"
    :class="`card--${item.color || 'default'}`"
    @click="$router.push(`/${type}/${item.id}`)"
  >
    <!-- Optional Icon -->
    <i v-if="item.icon" :class="['fas', item.icon, 'service-icon']"></i>

    <!-- Image -->
    <img v-if="item.image" :src="item.image" :alt="item.title || item.name" />

    <!-- Title -->
    <h2>{{ item.title || item.name }}</h2>

    <!-- Description -->
    <p v-if="item.description">{{ item.description }}</p>

    <!-- Type-specific fields -->
    <div v-if="type === 'products'" class="extra">
      <p><strong>Price:</strong> {{ item.price ? `KSh ${item.price}` : 'Contact us' }}</p>
    </div>

    <div v-if="type === 'technicians'" class="extra">
      <p><strong>Specialty:</strong> {{ item.specialty }}</p>
      <p><strong>Experience:</strong> {{ item.experience }} years</p>
    </div>

    <div v-if="type === 'services'" class="extra">
      <p><strong>Category:</strong> {{ item.category || 'General' }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardItem",
  props: {
    item: { type: Object, required: true },
    type: { type: String, required: true } // "services", "products", "technicians"
  }
};
</script>

<style scoped>
.card {
  /* let flex parent control width, just set max-width */
  max-width: 260px;
  padding: 20px;
  border-radius: 16px;
  color: white;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
  box-sizing: border-box;
}

.card img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 10px;
  margin: 12px 0;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
}

.service-icon {
  font-size: 30px;
  margin-bottom: 10px;
}

.extra {
  margin-top: 10px;
  font-size: 14px;
  background: rgba(255,255,255,0.1);
  padding: 6px;
  border-radius: 8px;
}

/* Color Variants */
.card--green { background: linear-gradient(135deg, #34a853, #0f9d58); }
.card--purple { background: linear-gradient(135deg, #8e24aa, #5e35b1); }
.card--yellow { background: linear-gradient(135deg, #f4b400, #fdd835); color: #333; }
.card--orange { background: linear-gradient(135deg, #f4511e, #fb8c00); }
.card--blue { background: linear-gradient(135deg, #1e88e5, #3949ab); }
.card--default { background: #555; }
</style>
