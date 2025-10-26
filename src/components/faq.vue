<template>
  <section class="faq-section">
    <h2>Frequently Asked Questions</h2>

    <div
      v-for="(category, index) in faqData"
      :key="index"
      class="faq-category"
    >
      <h3>
        <i :class="category.icon"></i>
        {{ category.title }}
      </h3>
      <ul>
        <li v-for="(item, i) in category.items" :key="i">
          <a :href="item.link">
            <i class="fas fa-angle-right"></i>
            {{ item.question }}
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: "Faq",
  data() {
    return {
      faqData: [
        {
          title: "Ordering",
          icon: "fas fa-shopping-cart",
          items: [
            { question: "How do I place an order?", link: "/faq/how-to-place-order" },
            { question: "What payment methods are supported?", link: "/faq/payment-methods" },
          ],
        },
        {
          title: "Delivery",
          icon: "fas fa-truck",
          items: [
            { question: "How do I track my delivery?", link: "/faq/track-delivery" },
            { question: "Where can I get a reliable technician?", link: "/faq/find-technician" },
          ],
        },
        {
          title: "Support & Returns",
          icon: "fas fa-undo-alt",
          items: [
            { question: "Do you offer returns/refunds?", link: "/faq/returns-refunds" },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Reset & body styles not needed, component scoped */

.faq-section {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.faq-section h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #f4b400; /* Brand accent */
}

.faq-category {
  margin-bottom: 20px;
}

.faq-category h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #444;
}

.faq-category h3 i {
  color: #f4b400; /* icon accent */
  margin-right: 8px;
}

.faq-category ul {
  list-style: none;
}

.faq-category li {
  margin: 8px 0;
}

.faq-category a {
  text-decoration: none;
  color: #333;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  font-weight: 500;
}

.faq-category a i {
  margin-right: 8px;
  color: #f4b400;
}

.faq-category a:hover {
  color: #f4b400;
  transform: translateX(5px);
}
</style>
