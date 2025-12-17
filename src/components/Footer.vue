<template>
  <footer class="footer">
    <div class="footer-grid">

      <!-- RESOURCES -->
      <div class="footer-brand">
        <div class="footer-resources-section">
          <img src="/images/ocLoGo.png" alt="O!clok Store Logo" class="footer-logo" />
          <h3>Resources</h3>
        </div>

        <div class="footer-links">
          <a href="#">Help Center</a>
          <a href="#">User Guide</a>
          <a href="#">Community Forum</a>
          <a href="#">Partner Program</a>
        </div>
      </div>

      <!-- FAQ LINKS -->
      <div>
        <h3>FAQs</h3>
        <div class="footer-links">
          <router-link :to="{ path: '/faq', hash: '#order' }">How do I place an order?</router-link>
          <router-link :to="{ path: '/faq', hash: '#payment' }">Payment Methods</router-link>
          <router-link :to="{ path: '/faq', hash: '#delivery' }">Delivery Tracking</router-link>
          <router-link :to="{ path: '/faq', hash: '#technician' }">Finding Technicians</router-link>
          <router-link :to="{ path: '/faq', hash: '#returns' }">Returns & Refunds</router-link>
        </div>
      </div>

      <!-- SOCIAL + CONTACT -->
      <div>
        <h3>Follow Us</h3>

        <div class="social-icons">
          <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-linkedin-in"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
        </div>

        <div class="contact-group">
          <div class="contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>Kisumu, Kenya</span>
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
      </div>

    </div>

    <div class="footer-bottom">
      <p>© 2025 O!clok Media — All Rights Reserved.</p>
      <a href="#" class="back-to-top" @click.prevent="scrollToTop">↑ Back to Top</a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #222;
  color: #ddd;
  padding: 50px 20px;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 40px;
}

.footer-logo {
  height: 70px;
  margin-bottom: 10px;
}

.footer h3 {
  color: #ff6600;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.footer-resources-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-links a,
.footer-links router-link {
  color: #ddd;
  text-decoration: none;
  font-size: 0.95rem;
  transition: 0.3s;
}

.footer-links a:hover,
.footer-links router-link:hover {
  color: #ff6600;
}

.social-icons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.social-icons a {
  color: #fff;
  background: #ff6600;
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 1.2rem;
  transition: transform 0.2s, background 0.3s;
}

.social-icons a:hover {
  transform: scale(1.15);
  background: #cc5200;
}

.contact-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ddd;
}

.contact-item i {
  color: #ff6600;
  width: 20px;
}

.footer-bottom {
  border-top: 1px solid #444;
  margin-top: 40px;
  padding-top: 15px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 0.9rem;
}

.back-to-top {
  color: #ffcc00;
  text-decoration: none;
  transition: 0.3s;
}

.back-to-top:hover {
  color: #ff6600;
}
</style>
