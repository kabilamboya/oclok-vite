<script setup>
import { computed, ref } from "vue";
import places from "../data/places.json";
import PlaceCard from "../components/PlaceCard.vue";
import {
  createDeliboisMembership,
  createDeliboisOrder,
} from "../services/delibois.service";

const search = ref("");
const activeCategory = ref("All");

const cityCoverage = [
  {
    city: "Kisumu",
    note: "CBD and wider metro errands for personal and business requests.",
  },
  {
    city: "Nairobi",
    note: "Scheduled city runs, pickups, and wait-and-deliver support.",
  },
  {
    city: "Homa Bay",
    note: "Local errands, document drop-offs, and parcel handling.",
  },
];

const pricingCards = [
  {
    title: "Within CBD",
    price: "KES 300",
    detail: "Fixed standard errand rate inside CBD zones.",
  },
  {
    title: "Outside CBD",
    price: "From KES 500",
    detail: "Rate depends on distance and delivery complexity.",
  },
  {
    title: "Intercounty",
    price: "Custom quote",
    detail: "We also run intercounty errands with planned routing.",
  },
];

const membershipBenefits = [
  "Access Delibois errand requests in your city.",
  "Flexible schedule for part-time or full-time runs.",
  "Priority dispatch for reliable members.",
  "Structured intercounty assignment opportunities.",
];

const supportedCities = ["Kisumu", "Nairobi", "Homa Bay", "Intercounty"];
const whatsappNumber = "254732379292"; // WhatsApp international format
const phoneDisplay = "+254 0732379292"; // Display format for call/booking
const orderTypes = [
  "Package pick-up and delivery",
  "Grocery and shopping errand",
  "Queue and wait-for service",
  "Business errand support",
];
const transportModes = ["Motorbike", "Bicycle", "Car", "Public Transport"];

const createDefaultOrderForm = () => ({
  customerName: "",
  phone: "",
  email: "",
  city: "Kisumu",
  orderType: orderTypes[0],
  pickup: "",
  dropoff: "",
  preferredTime: "",
  notes: "",
  urgent: false,
});

const createDefaultMembershipForm = () => ({
  fullName: "",
  phone: "",
  email: "",
  baseCity: "Kisumu",
  transportMode: transportModes[0],
  availability: "",
  experience: "",
  agreeToPolicy: false,
});

const orderForm = ref(createDefaultOrderForm());
const membershipForm = ref(createDefaultMembershipForm());
const orderErrors = ref({});
const membershipErrors = ref({});
const orderFeedback = ref({ type: "", message: "" });
const membershipFeedback = ref({ type: "", message: "" });
const orderSubmitting = ref(false);
const membershipSubmitting = ref(false);
const latestOrder = ref(null);

const pictorials = [
  {
    src: "/images/DELIBOIS.jpg",
    alt: "Delibois delivery visuals",
    title: "On-ground errands",
    caption: "Fast city pickups and drop-offs for urgent day-to-day tasks.",
  },
  {
    src: "/images/deliDrone.jpeg",
    alt: "Delibois delivery operations",
    title: "Route efficiency",
    caption: "Planned dispatching to keep delivery windows predictable.",
  },
  {
    src: "/images/robOTS.jpg",
    alt: "Delibois mobility support",
    title: "Intercounty coverage",
    caption: "From same-city tasks to long-route errand coordination.",
  },
];

const discoverCategories = computed(() => [
  "All",
  ...new Set(places.map((place) => place.category)),
]);

const filtered = computed(() => {
  const query = search.value.trim().toLowerCase();
  return places
    .filter((place) => {
      const inCategory =
        activeCategory.value === "All" || place.category === activeCategory.value;
      const text = `${place.name} ${place.location} ${place.category} ${place.description}`.toLowerCase();
      const matchesQuery = !query || text.includes(query);
      return inCategory && matchesQuery;
    })
    .sort((a, b) => b.rating - a.rating);
});

const featuredCount = computed(() => places.length);

function sanitize(value) {
  return String(value || "").trim();
}

function validatePhone(value) {
  const clean = sanitize(value);
  return /^\+?[0-9\s-]{9,15}$/.test(clean);
}

function toFriendlyDate(isoValue) {
  const parsed = new Date(isoValue || Date.now());
  return Number.isNaN(parsed.getTime()) ? new Date().toLocaleString() : parsed.toLocaleString();
}

function openWhatsAppMessage(message) {
  if (typeof window === "undefined") return;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function buildOrderWhatsAppMessage(payload) {
  return [
    "Delibois Order Request",
    `Name: ${payload.customerName || "-"}`,
    `Phone: ${payload.phone || "-"}`,
    `Email: ${payload.email || "-"}`,
    `City/Route: ${payload.city || "-"}`,
    `Order Type: ${payload.orderType || "-"}`,
    `Pickup: ${payload.pickup || "-"}`,
    `Drop-off: ${payload.dropoff || "-"}`,
    `Preferred Time: ${payload.preferredTime || "-"}`,
    `Urgent: ${payload.urgent ? "Yes" : "No"}`,
    `Notes: ${payload.notes || "-"}`,
  ].join("\n");
}

function buildMembershipWhatsAppMessage(payload) {
  return [
    "Delibois Membership Application",
    `Full Name: ${payload.fullName || "-"}`,
    `Phone: ${payload.phone || "-"}`,
    `Email: ${payload.email || "-"}`,
    `Base City: ${payload.baseCity || "-"}`,
    `Transport Mode: ${payload.transportMode || "-"}`,
    `Availability: ${payload.availability || "-"}`,
    `Experience: ${payload.experience || "-"}`,
  ].join("\n");
}

function validateOrderForm() {
  const errors = {};
  if (!sanitize(orderForm.value.customerName)) errors.customerName = "Full name is required.";
  if (!validatePhone(orderForm.value.phone)) errors.phone = "Use a valid phone number.";
  if (!sanitize(orderForm.value.city)) errors.city = "Select a service location.";
  if (!sanitize(orderForm.value.orderType)) errors.orderType = "Select an order type.";
  if (!sanitize(orderForm.value.pickup)) errors.pickup = "Pickup location is required.";
  if (!sanitize(orderForm.value.dropoff)) errors.dropoff = "Drop-off location is required.";
  if (!sanitize(orderForm.value.preferredTime)) errors.preferredTime = "Choose preferred time.";
  orderErrors.value = errors;
  return Object.keys(errors).length === 0;
}

async function submitOrder() {
  if (orderSubmitting.value) return;
  if (!validateOrderForm()) {
    orderFeedback.value = {
      type: "error",
      message: "Please fill all required order details.",
    };
    return false;
  }

  orderSubmitting.value = true;
  orderFeedback.value = { type: "", message: "" };

  try {
    const response = await createDeliboisOrder(orderForm.value);
    const saved = response?.data || response;
    const requestId = saved.id || `DLB-${String(Date.now()).slice(-6)}`;
    latestOrder.value = {
      ...saved,
      requestId,
      orderType: saved.order_type || saved.orderType,
      submittedAt: toFriendlyDate(saved.created_at),
    };
    orderFeedback.value = {
      type: "success",
      message: `Order request ${requestId} received and saved. A Delibois agent will contact you shortly.`,
    };
    orderErrors.value = {};
    orderForm.value = createDefaultOrderForm();
    return true;
  } catch (error) {
    orderFeedback.value = {
      type: "error",
      message:
        error.message ||
        "Could not submit the order right now. Please call +254 732 379 292 for urgent requests.",
    };
    return false;
  } finally {
    orderSubmitting.value = false;
  }
}

async function submitOrderWhatsApp() {
  const snapshot = { ...orderForm.value };
  const saved = await submitOrder();
  if (!saved) return;

  openWhatsAppMessage(buildOrderWhatsAppMessage(snapshot));
  orderFeedback.value = {
    type: "success",
    message:
      "Order saved successfully. WhatsApp chat opened with your prefilled order details.",
  };
}

function validateMembershipForm() {
  const errors = {};
  if (!sanitize(membershipForm.value.fullName)) errors.fullName = "Full name is required.";
  if (!validatePhone(membershipForm.value.phone)) errors.phone = "Use a valid phone number.";
  if (!sanitize(membershipForm.value.baseCity)) errors.baseCity = "Select your base city.";
  if (!sanitize(membershipForm.value.transportMode)) errors.transportMode = "Select transport mode.";
  if (!sanitize(membershipForm.value.availability)) errors.availability = "Share your availability.";
  if (!membershipForm.value.agreeToPolicy) errors.agreeToPolicy = "You must agree before applying.";
  membershipErrors.value = errors;
  return Object.keys(errors).length === 0;
}

async function submitMembership() {
  if (membershipSubmitting.value) return;
  if (!validateMembershipForm()) {
    membershipFeedback.value = {
      type: "error",
      message: "Please complete the required membership fields.",
    };
    return false;
  }

  membershipSubmitting.value = true;
  membershipFeedback.value = { type: "", message: "" };

  try {
    const response = await createDeliboisMembership(membershipForm.value);
    const saved = response?.data || response;
    membershipFeedback.value = {
      type: "success",
      message: `Application received (${saved.id || "recorded"}). Our Delibois team will review and contact you.`,
    };
    membershipErrors.value = {};
    membershipForm.value = createDefaultMembershipForm();
    return true;
  } catch (error) {
    membershipFeedback.value = {
      type: "error",
      message:
        error.message ||
        "Could not submit your membership application right now. Please retry in a few minutes.",
    };
    return false;
  } finally {
    membershipSubmitting.value = false;
  }
}

async function submitMembershipWhatsApp() {
  const snapshot = { ...membershipForm.value };
  const saved = await submitMembership();
  if (!saved) return;

  openWhatsAppMessage(buildMembershipWhatsAppMessage(snapshot));
  membershipFeedback.value = {
    type: "success",
    message:
      "Application saved successfully. WhatsApp chat opened with your prefilled membership details.",
  };
}
</script>

<template>

  <section class="hero" aria-hidden="false">
      <div class="hero-text">
        <h1>Relax! Let Us run your errands</h1>
        <p>Our delibois bet on convenience.</p>
      </div>
  </section>

  <main class="discover-page">
    <section class="delibois-hero">
      <div class="hero-copy">
        <p class="eyebrow">Delibois Errand Services</p>
        <h1>Run your errands without losing your day</h1>
        <p class="hero-text">
          We run errands in <strong>Homa Bay</strong>, <strong>Nairobi</strong>, and
          <strong>Kisumu</strong>. Transparent pricing and practical delivery support for
          homes and businesses.
        </p>
        <div class="hero-actions">
          <a class="cta primary" href="tel:+254732379292">Call to book</a>
          <a class="cta secondary" href="mailto:cambridgemediam@gmail.com">Send request</a>
        </div>
      </div>
      <div class="hero-panel">
        <h2>Quick rates</h2>
        <ul>
          <li><span>Within CBD</span><strong>KES 300</strong></li>
          <li><span>Outside CBD</span><strong>From KES 500</strong></li>
          <li><span>Intercounty errands</span><strong>Available</strong></li>
        </ul>
      </div>
    </section>

    <section class="operations">
      <article class="coverage card">
        <h2>Where we operate</h2>
        <p>Delibois teams handle direct requests across these cities:</p>
        <div class="zone-grid">
          <div v-for="zone in cityCoverage" :key="zone.city" class="zone-item">
            <h3>{{ zone.city }}</h3>
            <p>{{ zone.note }}</p>
          </div>
        </div>
      </article>

      <article class="pricing card">
        <h2>Transparent pricing</h2>
        <p>Simple base rates with clear escalation for longer routes.</p>
        <div class="pricing-grid">
          <div v-for="rate in pricingCards" :key="rate.title" class="pricing-item">
            <h3>{{ rate.title }}</h3>
            <p class="price">{{ rate.price }}</p>
            <p>{{ rate.detail }}</p>
          </div>
        </div>
      </article>
    </section>

    <section class="pictorials">
      <div class="section-head">
        <h2>Delibois pictorials</h2>
        <p>Visual snapshots of how we execute errands and delivery flow.</p>
      </div>
      <div class="pictorial-grid">
        <article v-for="item in pictorials" :key="item.title" class="pictorial-card">
          <img :src="item.src" :alt="item.alt" loading="lazy" />
          <div class="pictorial-copy">
            <h3>{{ item.title }}</h3>
            <p>{{ item.caption }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="engagement">
      <article class="card">
        <div class="section-head">
          <h2>Become a Deliboi member</h2>
          <p>Join our errand network and run requests in Homa Bay, Nairobi, Kisumu, and intercounty routes.</p>
        </div>
        <ul class="benefit-list">
          <li v-for="benefit in membershipBenefits" :key="benefit">{{ benefit }}</li>
        </ul>

        <form class="smart-form" @submit.prevent="submitMembership">
          <div class="form-grid two">
            <label class="field">
              <span>Full name *</span>
              <input v-model="membershipForm.fullName" type="text" placeholder="Your full name" />
              <small v-if="membershipErrors.fullName" class="field-error">{{ membershipErrors.fullName }}</small>
            </label>
            <label class="field">
              <span>Phone number *</span>
              <input v-model="membershipForm.phone" type="tel" placeholder="+254..." />
              <small v-if="membershipErrors.phone" class="field-error">{{ membershipErrors.phone }}</small>
            </label>
          </div>

          <div class="form-grid two">
            <label class="field">
              <span>Email (optional)</span>
              <input v-model="membershipForm.email" type="email" placeholder="name@email.com" />
            </label>
            <label class="field">
              <span>Base city *</span>
              <select v-model="membershipForm.baseCity">
                <option v-for="city in supportedCities" :key="city" :value="city">{{ city }}</option>
              </select>
              <small v-if="membershipErrors.baseCity" class="field-error">{{ membershipErrors.baseCity }}</small>
            </label>
          </div>

          <div class="form-grid two">
            <label class="field">
              <span>Transport mode *</span>
              <select v-model="membershipForm.transportMode">
                <option v-for="mode in transportModes" :key="mode" :value="mode">{{ mode }}</option>
              </select>
              <small v-if="membershipErrors.transportMode" class="field-error">{{ membershipErrors.transportMode }}</small>
            </label>
            <label class="field">
              <span>Availability *</span>
              <input
                v-model="membershipForm.availability"
                type="text"
                placeholder="e.g. Weekdays 8am - 6pm"
              />
              <small v-if="membershipErrors.availability" class="field-error">{{ membershipErrors.availability }}</small>
            </label>
          </div>

          <label class="field">
            <span>Errand or delivery experience</span>
            <textarea
              v-model="membershipForm.experience"
              rows="3"
              placeholder="Share any delivery, rider, or field support experience"
            ></textarea>
          </label>

          <label class="checkbox-line">
            <input v-model="membershipForm.agreeToPolicy" type="checkbox" />
            <span>I confirm my details are correct and I am ready for Delibois assignments.</span>
          </label>
          <small v-if="membershipErrors.agreeToPolicy" class="field-error">{{ membershipErrors.agreeToPolicy }}</small>

          <div class="form-btn-row">
            <button class="form-btn" type="submit" :disabled="membershipSubmitting">
              {{ membershipSubmitting ? "Submitting..." : "Apply for membership" }}
            </button>
            <button
              class="form-btn secondary"
              type="button"
              :disabled="membershipSubmitting"
              @click="submitMembershipWhatsApp"
            >
              {{ membershipSubmitting ? "Submitting..." : "Save + WhatsApp" }}
            </button>
          </div>
          <p
            v-if="membershipFeedback.message"
            :class="['form-feedback', membershipFeedback.type]"
          >
            {{ membershipFeedback.message }}
          </p>
        </form>
      </article>

      <article class="card">
        <div class="section-head">
          <h2>Place an errand order</h2>
          <p>Fill this form to request pickup, delivery, wait-for service, or business errands.</p>
        </div>

        <form class="smart-form" @submit.prevent="submitOrder">
          <div class="form-grid two">
            <label class="field">
              <span>Customer name *</span>
              <input v-model="orderForm.customerName" type="text" placeholder="Full name" />
              <small v-if="orderErrors.customerName" class="field-error">{{ orderErrors.customerName }}</small>
            </label>
            <label class="field">
              <span>Phone number *</span>
              <input v-model="orderForm.phone" type="tel" placeholder="+254..." />
              <small v-if="orderErrors.phone" class="field-error">{{ orderErrors.phone }}</small>
            </label>
          </div>

          <div class="form-grid two">
            <label class="field">
              <span>Email (optional)</span>
              <input v-model="orderForm.email" type="email" placeholder="name@email.com" />
            </label>
            <label class="field">
              <span>City / route *</span>
              <select v-model="orderForm.city">
                <option v-for="city in supportedCities" :key="city" :value="city">{{ city }}</option>
              </select>
              <small v-if="orderErrors.city" class="field-error">{{ orderErrors.city }}</small>
            </label>
          </div>

          <div class="form-grid two">
            <label class="field">
              <span>Order type *</span>
              <select v-model="orderForm.orderType">
                <option v-for="type in orderTypes" :key="type" :value="type">{{ type }}</option>
              </select>
              <small v-if="orderErrors.orderType" class="field-error">{{ orderErrors.orderType }}</small>
            </label>
            <label class="field">
              <span>Preferred time *</span>
              <input v-model="orderForm.preferredTime" type="datetime-local" />
              <small v-if="orderErrors.preferredTime" class="field-error">{{ orderErrors.preferredTime }}</small>
            </label>
          </div>

          <label class="field">
            <span>Pickup location *</span>
            <input v-model="orderForm.pickup" type="text" placeholder="Building, street, landmark" />
            <small v-if="orderErrors.pickup" class="field-error">{{ orderErrors.pickup }}</small>
          </label>

          <label class="field">
            <span>Drop-off location *</span>
            <input v-model="orderForm.dropoff" type="text" placeholder="Destination details" />
            <small v-if="orderErrors.dropoff" class="field-error">{{ orderErrors.dropoff }}</small>
          </label>

          <label class="field">
            <span>Order notes</span>
            <textarea
              v-model="orderForm.notes"
              rows="3"
              placeholder="Package details, queue instructions, or delivery constraints"
            ></textarea>
          </label>

          <label class="checkbox-line">
            <input v-model="orderForm.urgent" type="checkbox" />
            <span>Mark as urgent priority request</span>
          </label>

          <div class="form-btn-row">
            <button class="form-btn" type="submit" :disabled="orderSubmitting">
              {{ orderSubmitting ? "Submitting..." : "Submit errand order" }}
            </button>
            <button
              class="form-btn secondary"
              type="button"
              :disabled="orderSubmitting"
              @click="submitOrderWhatsApp"
            >
              {{ orderSubmitting ? "Submitting..." : "Save + WhatsApp" }}
            </button>
          </div>
          <p v-if="orderFeedback.message" :class="['form-feedback', orderFeedback.type]">
            {{ orderFeedback.message }}
          </p>
        </form>

        <aside v-if="latestOrder" class="latest-order">
          <h3>Latest order summary</h3>
          <p><strong>Request ID:</strong> {{ latestOrder.requestId }}</p>
          <p><strong>Type:</strong> {{ latestOrder.orderType }}</p>
          <p><strong>Route:</strong> {{ latestOrder.city }}</p>
          <p><strong>Pickup:</strong> {{ latestOrder.pickup }}</p>
          <p><strong>Drop-off:</strong> {{ latestOrder.dropoff }}</p>
          <p><strong>Submitted:</strong> {{ latestOrder.submittedAt }}</p>
        </aside>
      </article>
    </section>

    <section class="discover-locations">
      <div class="section-head">
        <h2>Discover Kisumu</h2>
        <p>{{ featuredCount }} places listed. Filter by category or search by name and location.</p>
      </div>

      <div class="controls">
        <input
          v-model="search"
          class="search"
          type="search"
          placeholder="Search places, category, or location"
        />
        <div class="category-tabs">
          <button
            v-for="category in discoverCategories"
            :key="category"
            type="button"
            :class="['tab', { active: activeCategory === category }]"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div class="places-scroll" role="region" aria-label="Discover places list">
        <div v-if="filtered.length" class="grid">
          <PlaceCard
            v-for="place in filtered"
            :key="place.id"
            :place="place"
          />
        </div>
        <div v-else class="empty-state">
          <h3>No places matched your search</h3>
          <p>Try another keyword or switch category to "All".</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.discover-page {
  --bg: #0f1218;
  --panel: #171b23;
  --soft-panel: #1d2330;
  --line: #2c3442;
  --accent: #ff7a18;
  --accent-soft: #ffb25f;
  --text: #ecf1f6;
  --muted: #afbac8;
  max-width: 1180px;
  margin: 0 auto;
  padding: 22px 18px 44px;
  color: var(--text);
  font-family: "Manrope", "Segoe UI", sans-serif;
}

.hero {
  background: 
    linear-gradient(135deg, rgba(15, 18, 24, 0.75) 0%, rgba(21, 26, 35, 0.85) 100%),
    url('/images/delivery.jpg') center / cover no-repeat;
  border-radius: 18px;
  padding: 64px 24px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  margin-bottom: 22px;
}

.hero-text {
  max-width: 600px;
}

.hero-text h1 {
  margin: 0 0 12px;
  font-size: clamp(2rem, 3vw, 2.6rem);
  line-height: 1.2;
  color: var(--text);
  font-weight: 700;
}

.hero-text p {
  margin: 0;
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  color: var(--muted);
}

.delibois-hero {
  background:
    radial-gradient(circle at right top, rgba(255, 138, 44, 0.35), transparent 48%),
    linear-gradient(145deg, #151a23 0%, #0f131a 100%);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 24px;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 18px;
}

.eyebrow {
  margin: 0;
  color: var(--accent-soft);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.76rem;
  font-weight: 700;
}

.hero-copy h1 {
  margin: 10px 0 10px;
  line-height: 1.2;
  font-size: clamp(1.7rem, 2.6vw, 2.3rem);
}

.hero-text {
  margin: 0;
  max-width: 60ch;
  color: var(--muted);
}

.hero-actions {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cta {
  text-decoration: none;
  font-weight: 700;
  border-radius: 10px;
  padding: 10px 14px;
  border: 1px solid transparent;
}

.cta.primary {
  background: var(--accent);
  color: #101318;
}

.cta.secondary {
  border-color: #596171;
  color: var(--text);
}

.hero-panel {
  background: rgba(23, 27, 35, 0.86);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 16px;
}

.hero-panel h2 {
  margin: 0;
  font-size: 1rem;
}

.hero-panel ul {
  list-style: none;
  margin: 14px 0 0;
  padding: 0;
}

.hero-panel li {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid #2b3340;
  color: var(--muted);
}

.hero-panel li:last-child {
  border-bottom: none;
}

.hero-panel strong {
  color: #ffd6a7;
}

.operations {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 16px;
}

.card h2 {
  margin: 0;
  font-size: 1.14rem;
}

.card > p {
  margin: 8px 0 14px;
  color: var(--muted);
}

.zone-grid,
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.zone-item,
.pricing-item {
  background: var(--soft-panel);
  border: 1px solid #2f3746;
  border-radius: 10px;
  padding: 10px;
}

.zone-item h3,
.pricing-item h3 {
  margin: 0;
  font-size: 0.96rem;
}

.zone-item p,
.pricing-item p {
  margin: 7px 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.pricing-item .price {
  color: #ffd6a7;
  font-weight: 700;
}

.pictorials,
.discover-locations {
  margin-top: 18px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 16px;
}

.engagement {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.section-head h2 {
  margin: 0;
  font-size: 1.18rem;
}

.section-head p {
  margin: 8px 0 0;
  color: var(--muted);
}

.pictorial-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.pictorial-card {
  background: var(--soft-panel);
  border-radius: 12px;
  border: 1px solid #2f3746;
  overflow: hidden;
}

.pictorial-card img {
  width: 100%;
  height: 190px;
  object-fit: cover;
  display: block;
}

.pictorial-copy {
  padding: 10px;
}

.pictorial-copy h3 {
  margin: 0;
  font-size: 0.96rem;
}

.pictorial-copy p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 0.88rem;
}

.benefit-list {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.benefit-list li {
  background: var(--soft-panel);
  border: 1px solid #2f3746;
  border-radius: 10px;
  padding: 9px 10px;
  color: var(--muted);
  font-size: 0.9rem;
}

.smart-form {
  margin-top: 14px;
  display: grid;
  gap: 10px;
}

.form-grid {
  display: grid;
  gap: 10px;
}

.form-grid.two {
  grid-template-columns: 1fr 1fr;
}

.field {
  display: grid;
  gap: 6px;
}

.field span {
  font-size: 0.84rem;
  color: #dbe2eb;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  border: 1px solid #374155;
  background: #0f131a;
  color: var(--text);
  border-radius: 10px;
  padding: 10px 12px;
  font: inherit;
  box-sizing: border-box;
}

.field textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--muted);
  font-size: 0.88rem;
}

.checkbox-line input {
  margin-top: 3px;
}

.field-error {
  color: #fda4af;
  font-size: 0.78rem;
}

.form-btn {
  border: 0;
  border-radius: 10px;
  background: var(--accent);
  color: #101318;
  font-weight: 700;
  padding: 11px 14px;
  cursor: pointer;
}

.form-btn:hover {
  filter: brightness(1.05);
}

.form-btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.form-btn.secondary {
  background: transparent;
  color: #ffd6a7;
  border: 1px solid #ffb26a;
}

.form-btn.secondary:hover {
  background: rgba(255, 122, 24, 0.12);
}

.form-btn:disabled {
  cursor: not-allowed;
  opacity: 0.65;
  filter: none;
}

.form-feedback {
  margin: 0;
  padding: 9px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
}

.form-feedback.success {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.45);
  color: #86efac;
}

.form-feedback.error {
  background: rgba(248, 113, 113, 0.15);
  border: 1px solid rgba(248, 113, 113, 0.45);
  color: #fecaca;
}

.latest-order {
  margin-top: 12px;
  border: 1px solid #2f3746;
  border-radius: 10px;
  background: var(--soft-panel);
  padding: 10px;
}

.latest-order h3 {
  margin: 0 0 8px;
  font-size: 0.94rem;
}

.latest-order p {
  margin: 4px 0;
  font-size: 0.86rem;
  color: var(--muted);
}

.controls {
  margin-top: 14px;
}

.search {
  width: 100%;
  border: 1px solid #374155;
  background: #0f131a;
  color: var(--text);
  border-radius: 10px;
  padding: 12px;
}

.category-tabs {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tab {
  border: 1px solid #3a4457;
  background: #151a23;
  color: #dbe2eb;
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.82rem;
}

.tab.active {
  border-color: #ff8a2c;
  background: rgba(255, 138, 44, 0.16);
  color: #ffe3c0;
}

.grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.places-scroll {
  margin-top: 14px;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 6px;
  overscroll-behavior: contain;
  border-radius: 12px;
}

.places-scroll::-webkit-scrollbar {
  width: 8px;
}

.places-scroll::-webkit-scrollbar-thumb {
  background: #2f3746;
  border-radius: 999px;
}

.places-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.empty-state {
  margin-top: 0;
  border: 1px dashed #42506a;
  border-radius: 10px;
  padding: 18px;
  text-align: center;
}

.empty-state h3 {
  margin: 0;
  font-size: 1rem;
}

.empty-state p {
  margin: 8px 0 0;
  color: var(--muted);
}

@media (max-width: 980px) {
  .delibois-hero,
  .operations,
  .engagement {
    grid-template-columns: 1fr;
  }

  .zone-grid,
  .pricing-grid,
  .pictorial-grid {
    grid-template-columns: 1fr 1fr;
  }

  .hero {
    min-height: 280px;
    padding: 48px 18px;
  }
}

@media (max-width: 640px) {
  .discover-page {
    padding: 14px 12px 28px;
  }

  .delibois-hero {
    padding: 16px;
  }

  .hero {
    min-height: 240px;
    padding: 36px 14px;
    margin-bottom: 14px;
  }

  .hero-text h1 {
    margin-bottom: 8px;
  }

  .zone-grid,
  .pricing-grid,
  .pictorial-grid,
  .form-grid.two {
    grid-template-columns: 1fr;
  }

  .places-scroll {
    max-height: 320px;
  }
}
</style>
