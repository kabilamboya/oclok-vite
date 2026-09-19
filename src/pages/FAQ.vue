<template>
  <div class="faq-page">
    <header class="faq-hero">
      <h1>Frequently Asked Questions</h1>
      <p>Quick answers to common questions about ordering, payment, delivery, technicians, and returns.</p>
    </header>

    <nav class="faq-nav">
      <a href="#order">How do I place an order?</a>
      <a href="#payment">Payment Methods</a>
      <a href="#delivery">Delivery Tracking</a>
      <a href="#technician">Finding Technicians</a>
      <a href="#returns">Returns and Refunds</a>
    </nav>

    <main class="faq-content">
      <section id="order" class="faq-section">
        <h2>How do I place an order?</h2>
        <p>Browse the Store or Service pages, add items or services to your cart, then proceed to checkout. Provide shipping details and confirm your order. You will receive an order confirmation by email.</p>
      </section>

      <section id="payment" class="faq-section">
        <h2>Payment Methods</h2>
        <p>We accept major debit/credit cards and mobile money where available. Payment options are shown at checkout. If you need an alternate method, contact our support team via the Contact Us links in the footer.</p>
      </section>

      <section id="delivery" class="faq-section">
        <h2>Delivery Tracking</h2>
        <p>After your order ships, you will receive tracking details. Use the tracking link in your order confirmation to follow progress. For help, open a support request through the Support page.</p>
      </section>

      <section id="technician" class="faq-section">
        <h2>Finding Technicians</h2>
        <p>Visit the Technicians directory to browse profiles and filter by expertise and location. Each profile contains contact and booking information.</p>
      </section>

      <section id="returns" class="faq-section">
        <h2>Returns and Refunds</h2>
        <p>If an item is eligible for return, follow the Returns flow in your account or contact support. Refunds are processed after we receive and inspect the returned item; processing time may vary.</p>
      </section>
    </main>

  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

function focusHash() {
  const hash = window.location.hash;
  const id = hash ? decodeURIComponent(hash.slice(1)) : null;
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;

  // Smooth scroll to the section and focus it for keyboard users
  try {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) {
    // fallback
    el.scrollIntoView();
  }

  // Make focusable and focus without additional scrolling
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });

  // Highlight the focused tile
  document.querySelectorAll('.faq-section').forEach((s) => s.classList.remove('is-focused'));
  el.classList.add('is-focused');
}

onMounted(() => {
  // run after render so elements exist
  nextTick(() => focusHash());
  window.addEventListener('hashchange', focusHash);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', focusHash);
});

// Some router navigations update the URL without firing `hashchange`.
watch(() => route.hash, (h) => {
  if (h) {
    // give router time to render
    setTimeout(focusHash, 50);
  }
});
</script>

<style scoped>
.faq-hero{
  max-width:900px;
  margin:36px auto 16px;
  text-align:center;
}
.faq-nav{
  display:flex;
  gap:12px;
  justify-content:center;
  flex-wrap:wrap;
  margin-bottom:24px;
}
.faq-nav a{
  color:var(--color-primary);
  text-decoration:none;
  padding:8px 12px;
  background:rgba(0,0,0,0.04);
  border-radius:6px;
}
.faq-content{
  max-width:900px;
  margin:0 auto 60px;
  padding:0 18px;
  display:flex;
  flex-direction:column;
  gap:18px;
}

.faq-section{
  background:var(--bg-panel, #0b1220);
  border:1px solid rgba(255,255,255,0.04);
  padding:18px;
  border-radius:10px;
  box-shadow:0 6px 18px rgba(2,6,23,0.45);
  transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  width:100%;
}

.faq-section h2{
  margin:0 0 10px;
  color:var(--color-secondary);
}

.faq-section p{
  color:var(--text-muted-dark);
  line-height:1.7;
  margin:0;
}

.faq-section:focus,
.faq-section.is-focused{
  transform:translateY(-6px);
  border-color:var(--color-primary);
  box-shadow:0 12px 30px rgba(0,0,0,0.55);
  outline:3px solid rgba(59,130,246,0.12);
}

@media(max-width:760px){
  .faq-content{ flex-direction:column; }
}
</style>
