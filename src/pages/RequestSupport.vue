<template>
  <main class="support-page">
    <header class="support-hero">
      <p class="eyebrow">Support & delivery</p>
      <h1>Request help from O!clok</h1>
      <p class="intro">
        Tell us what you need and we will follow up with the right support, delivery coordination,
        or specialist guidance.
      </p>

      <div class="quick-links" aria-label="Quick links to other O!clok sections">
        <router-link to="/store" class="quick-link">Browse store</router-link>
        <router-link to="/media" class="quick-link">Explore media</router-link>
        <router-link to="/cyber" class="quick-link">Open cyber hub</router-link>
      </div>
    </header>

    <QuickOrderForm
      title="Need a delivery or support request?"
      subtitle="Share your goal and we will follow up with you shortly."
      page="website"
    />
  </main>
</template>

<script setup>
import QuickOrderForm from '../components/QuickOrderForm.vue';
</script>

<style scoped>
.support-page {
  display: grid;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.2rem 3rem;
}

.support-hero {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.72));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 26px;
  padding: 2rem 1.5rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.15);
}

.eyebrow {
  margin: 0 0 0.5rem;
  color: #ffb36b;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.support-hero h1 {
  margin: 0;
  color: #fff;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
}

.intro {
  max-width: 760px;
  margin: 0.9rem 0 0;
  color: #dbeafe;
  font-size: 1.02rem;
  line-height: 1.7;
}

.quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.quick-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  transition: transform 0.18s ease, border-color 0.18s ease;
}

.quick-link:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 179, 107, 0.45);
}

@media (max-width: 700px) {
  .support-page {
    padding-top: 1rem;
  }

  .support-hero {
    padding: 1.4rem 1rem;
  }
}
</style>
