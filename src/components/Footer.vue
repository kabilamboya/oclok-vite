<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <section class="footer-col">
          <h3>Mission</h3>
          <div class="footer-links mission-vision">
            <div class="vision-block">
              <p>To make delivery and digital services easier, faster, and more trusted for individuals and businesses.</p>
            </div>
            <div class="vision-block">
              <h4>Vision</h4>
              <p>To become a leading smart platform that shapes the future of logistics, commerce, and digital engagement.</p>
            </div>
          </div>
        </section>
        
        <section class="footer-col footer-brand">
          <div class="brand-head">
            <h3>Resources</h3>
          </div>

          <div class="footer-links">
            <a href="#">Help Center</a>
            <a href="#">User Guide</a>
          </div>

          <div class="brand-head">
            <h3>Donations</h3>
          </div>

          <div class="footer-links">
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
            <a href="#" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
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
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
/* ===========================
   FOOTER
=========================== */

.footer{

background:var(--bg-dark);

color:var(--text-dark);

padding:80px 24px 30px;

}

.footer-inner{

max-width:1200px;

margin:auto;

}

.footer-grid{

display:grid;

grid-template-columns:

repeat(auto-fit,minmax(260px,1fr));

gap:50px;

margin-bottom:50px;

}

.footer-col h3{

font-size:1.25rem;

margin-bottom:20px;

color:var(--color-secondary);

}

.footer-links{

display:flex;

flex-direction:column;

gap:14px;

}

.footer-links a{

text-decoration:none;

color:var(--text-muted-dark);

transition:.3s;

}

.footer-links a:hover{

color:var(--color-primary);

padding-left:6px;

}

.mission-vision{
  gap: 18px;
}

.vision-block{
  padding: 14px 0;
  border-top: 1px solid rgba(255,255,255,.08);
}

.vision-block:first-child{
  border-top: 0;
  padding-top: 0;
}

.vision-block h4{
  margin: 0 0 6px;
  color: var(--color-secondary);
}

.vision-block p{
  margin: 0;
  color: var(--text-muted-dark);
  line-height: 1.7;
}

.social-icons{

display:flex;

gap:14px;

margin:20px 0;

}

.social-icons a{

width:32px;

height:32px;

border-radius:50%;

display:flex;

justify-content:center;

align-items:center;

background:rgba(255,255,255,.08);

color:var(--text-dark);

transition:.3s;

font-size:18px;

}

.social-icons a:hover{

background:var(--color-primary);

transform:translateY(-4px);

}

.contact-group{

display:flex;

flex-direction:column;

gap:16px;

margin-top:18px;

}

.contact-item{

display:flex;

gap:14px;

align-items:flex-start;

color:#cbd5e1;

}

.contact-item i{

color:var(--color-secondary);

margin-top:3px;

}

.footer-bottom{

border-top:1px solid rgba(255,255,255,.08);

padding-top:30px;

display:flex;

justify-content:space-between;

align-items:center;

flex-wrap:wrap;

gap:15px;

}

.footer-bottom p{

color:#94a3b8;

}

@media(max-width:768px){

.footer{

padding:60px 20px;

}

.footer-grid{

gap:35px;

}

.footer-bottom{

flex-direction:column;

text-align:center;

}

.social-icons{

justify-content:center;

}

}
</style>

