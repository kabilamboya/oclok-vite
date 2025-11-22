<template>
  <section class="faq-section" aria-label="Frequently Asked Questions">
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
          <details :id="item.id" :open="item.id === activeHash">
            <summary>
              <i class="fas fa-angle-right"></i>
              {{ item.question }}
            </summary>
            <p>{{ item.answer }}</p>
          </details>
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
      activeHash: null,
      faqData: [
        {
          title: "Ordering",
          icon: "fas fa-shopping-cart",
          items: [
            {
              id: "order",
              question: "How do I place an order?",
              answer: "Browse products, add to cart, and follow checkout steps to complete your order.",
            },
            {
              id: "payment",
              question: "What payment methods are supported?",
              answer: "We accept M-Pesa, Airtel Money, Visa, Mastercard, and select bank transfers.",
            },
            {
              id: "cancel-order",
              question: "Can I change or cancel my order after placing it?",
              answer: "Yes — if your order hasn’t been dispatched yet. Contact support as soon as possible.",
            },
          ],
        },
        {
          title: "Delivery",
          icon: "fas fa-truck",
          items: [
            {
              id: "delivery",
              question: "How do I track my delivery?",
              answer: "You’ll receive a tracking link via SMS or email once your order is shipped.",
            },
            {
              id: "outside-nairobi",
              question: "Do you deliver outside Nairobi or Kisumu?",
              answer: "Yes, we deliver across Kenya including Vihiga, Eldoret, and Mombasa.",
            },
            {
              id: "technician",
              question: "Where can I get a reliable technician?",
              answer: "Use our 'Book a Technician' feature to connect with certified professionals near you.",
            },
          ],
        },
        {
          title: "Support & Returns",
          icon: "fas fa-undo-alt",
          items: [
            {
              id: "returns",
              question: "Do you offer returns or refunds?",
              answer: "You can request a return within 7 days. Refunds are processed within 3–5 business days.",
            },
            {
              id: "wrong-product",
              question: "What if I receive the wrong product?",
              answer: "Contact us with your order number and a photo. We’ll arrange a replacement or refund.",
            },
            {
              id: "warranty",
              question: "Is there a warranty on products?",
              answer: "Many electronics come with a manufacturer’s warranty. Details are on each product page.",
            },
          ],
        },
        {
          title: "Account & Security",
          icon: "fas fa-user-shield",
          items: [
            {
              id: "reset-password",
              question: "How do I reset my password?",
              answer: "Click 'Forgot Password' on the login page and follow the instructions.",
            },
            {
              id: "data-safety",
              question: "Is my personal data safe?",
              answer: "Yes. We use encrypted servers and never share your data without consent.",
            },
          ],
        },
        {
          title: "Product Information",
          icon: "fas fa-box-open",
          items: [
            {
              id: "stock-check",
              question: "How do I know if a product is in stock?",
              answer: "If it’s listed with an 'Add to Cart' button, it’s available.",
            },
            {
              id: "request-product",
              question: "Can I request a product that’s not listed?",
              answer: "Yes! Use our contact form or WhatsApp line to suggest a product.",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.activeHash = this.$route.hash?.replace("#", "") || null;
  },
  watch: {
    '$route.hash'(newHash) {
      this.activeHash = newHash?.replace("#", "") || null;
    }
  }
};
</script>

<style scoped>
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
  color: #f4b400;
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
  color: #f4b400;
  margin-right: 8px;
}

.faq-category ul {
  list-style: none;
  padding-left: 0;
}

details {
  background: #f9f9f9;
  border-radius: 6px;
  padding: 10px 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

summary {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}

summary:hover {
  color: #f4b400;
}

details p {
  margin-top: 8px;
  color: #555;
}
</style>
