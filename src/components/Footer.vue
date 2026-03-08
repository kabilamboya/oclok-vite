<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <section class="footer-col footer-brand">
          <div class="brand-head">
            <h3>Resources</h3>
          </div>

          <div class="footer-links">
            <a href="#">Help Center</a>
            <a href="#">User Guide</a>
            <a href="#">Community Forum</a>
            <a href="#">Partner Program</a>
          </div>
        </section>

        <section class="footer-col">
          <h3>FAQs</h3>
          <div class="footer-links">
            <router-link :to="{ path: '/faq', hash: '#order' }">How do I place an order?</router-link>
            <router-link :to="{ path: '/faq', hash: '#payment' }">Payment Methods</router-link>
            <router-link :to="{ path: '/faq', hash: '#delivery' }">Delivery Tracking</router-link>
            <router-link :to="{ path: '/faq', hash: '#technician' }">Finding Technicians</router-link>
            <router-link :to="{ path: '/faq', hash: '#returns' }">Returns and Refunds</router-link>
          </div>
        </section>

        <section class="footer-col">
          <h3>Follow Us</h3>

          <div class="social-icons">
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          </div>

          <h3>Contact Us</h3>

          <div class="contact-group">
            <div class="contact-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>Nairobi, Kisumu, Homabay, Kenya</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-phone-alt"></i>
              <span>+254 732 379 292</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <span>cambridgemediam@gmail.com</span>
            </div>
          </div>
        </section>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} O!clok Media - All Rights Reserved.</p>
        <a href="#" class="back-to-top" @click.prevent="scrollToTop">Back to top</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();

const scrollToTop = () => {
  if (typeof window === 'undefined') return;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
.footer {
  background: #1f1f1f;
  color: #ddd;
  padding: 52px 20px 28px;
  text-align: left;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-auto-rows: 1fr;
  gap: 32px;
  align-items: start;
}

.footer-col {
  height: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto 1fr;
  align-content: start;
  gap: 12px;
  padding: 16px;
  border: 1px solid #3b3b3b;
  border-radius: 12px;
  background: #262626;
}

.brand-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer h3 {
  color: #ff7a00;
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.2;
}

.footer-links {
  display: grid;
  align-content: start;
  gap: 8px;
}

.footer-links a {
  color: #ddd;
  text-decoration: none;
  font-size: 0.94rem;
  line-height: 1.35;
}

.footer-links a:hover {
  color: #ff7a00;
}

.social-icons {
  display: flex;
  gap: 10px;
}

.social-icons a {
  color: #fff;
  background: #ff7a00;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 1rem;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.social-icons a:hover {
  transform: translateY(-1px);
  background: #e56600;
}

.contact-group {
  display: grid;
  align-content: start;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.95rem;
  line-height: 1.35;
}

.contact-item i {
  color: #ff7a00;
  width: 18px;
  margin-top: 2px;
}

.footer-bottom {
  border-top: 1px solid #444;
  margin-top: 28px;
  padding-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 0.9rem;
}

.footer-bottom p {
  margin: 0;
}

.back-to-top {
  color: #ff7a00;
  text-decoration: none;
  font-weight: 600;
}

.back-to-top:hover {
  color: #ff9a3d;
}

@media (max-width: 760px) {
  .footer {
    padding: 40px 16px 24px;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
