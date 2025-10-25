<template>
  <div class="card" :style="{ borderTop: '5px solid ' + item.color }">
    <img :src="item.image" :alt="item.name" class="card-img" />

    <div class="card-body">
      <h3 class="card-name">{{ item.name }}</h3>
      <p class="card-specialty">{{ item.specialty }}</p>
      <p class="card-location">📍 {{ item.location }}</p>

      <p class="card-bio">
        {{ item.bio.length > 100 ? item.bio.slice(0, 100) + '...' : item.bio }}
      </p>

      <div class="card-experience">
        <strong>{{ item.experience }}</strong> years experience
      </div>

      <div class="card-projects">
        <details>
          <summary>Projects</summary>
          <ul>
            <li v-for="(list, key) in item.projects" :key="key">
              <strong>{{ key }}:</strong>
              <ul>
                <li v-for="p in list" :key="p">{{ p }}</li>
              </ul>
            </li>
          </ul>
        </details>
      </div>
    </div>

    <div class="card-footer">
      <button class="book-btn" @click="$emit('book', item)">Book</button>
      <a :href="'mailto:' + item.contact.email" class="contact-btn">Email</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.card-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.card-body {
  padding: 1rem;
  flex-grow: 1;
}

.card-name {
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.card-specialty {
  color: #555;
  font-weight: bold;
}

.card-location {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 0.5rem;
}

.card-bio {
  font-size: 0.9rem;
  color: #444;
  margin-bottom: 0.5rem;
}

.card-experience {
  font-size: 0.9rem;
  color: #222;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-projects details {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 0.85rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem;
  border-top: 1px solid #eee;
  background: #fafafa;
}

.book-btn,
.contact-btn {
  flex: 1;
  text-align: center;
  margin: 0 0.25rem;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.book-btn {
  background: #007bff;
  color: #fff;
}
.book-btn:hover {
  background: #0056b3;
}

.contact-btn {
  background: #28a745;
  color: #fff;
  text-decoration: none;
}
.contact-btn:hover {
  background: #1e7e34;
}
</style>
