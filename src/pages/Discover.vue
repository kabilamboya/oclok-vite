<script setup>
import { computed, ref, watch, nextTick } from "vue";
import places from "../data/places.json";
import estateLocations from "../data/estateLocations.json";
import estatePhases from "../data/estatePhases.json";
import PlaceCard from "../components/PlaceCard.vue";
import {
  createDeliboisOrder,
} from "../services/delibois.service";
import { getRegisteredUser } from "../services/auth.service";

const search = ref("");
const activeCategory = ref("All");


const kisumu_estates = computed(() => [
  "CBD",
  ...estatePhases.flatMap((phase) => phase.estates),
]);

const whatsappNumber = "254732379292"; // WhatsApp international format
const orderTypes = [
  "Local cab driver request",
  "Kisumu city & environment visit",
  "Parcel pick-up",
  "Grocery/household shopping",
  "Supermarket shopping",
  "Parcel drop-off",
  "Wait-for service",
  "Office errands",
  "B2B deliveries",
  "B2C deliveries",
  "Guest pick-up",
  "Items return",
];

const createDefaultOrderForm = () => ({
  customerName: "",
  phone: "",
  email: "",
  estate: "CBD",
  orderType: orderTypes[0],
  recipientName: "",
  recipientPhone: "",
  sameAsCustomer: false,
  pickup: "",
  dropoff: "",
  preferredTime: "",
  notes: "",
  urgent: false,
  accountType: "novice customer",
});

const createEmptyOrderItemDetails = () => ({
  show: false,
  title: "",
  image: "",
  imageFile: null,
  videoFile: null,
  mediaType: null,
  description: "",
  instructions: "",
  fragile: false,
});

const orderForm = ref(createDefaultOrderForm());
const orderErrors = ref({});
const orderFeedback = ref({ type: "", message: "" });
const orderSubmitting = ref(false);
const latestOrder = ref(null);
const orderTab = ref("personal"); // "personal" or "items"
const orderTabsRef = ref(null);

const orderItemDetails = ref(createEmptyOrderItemDetails());

const serviceCards = [
  {
    icon: "🚚",
    title: "Parcel Delivery",
    description: "Fast same-day parcel pickup and delivery across Kisumu.",
  },
  {
    icon: "⏳",
    title: "Wait-in-Line Services",
    description: "Save time with queue waiting services for bills, permits and appointments.",
  },
  {
    icon: "🛍️",
    title: "Shopping Assistance",
    description: "Personal shopping help for clothes, food and household essentials.",
  },
  {
    icon: "🔁",
    title: "Item Returns",
    description: "Convenient returns delivery for online orders and store exchanges.",
  },
  {
    icon: "🛒",
    title: "Grocery Shopping",
    description: "Shop from local supermarkets and deliver groceries to your door.",
  },
  {
    icon: "📄",
    title: "Document Delivery",
    description: "Secure document pickup, drop-off and courier support for important files.",
  },
];

const mapPoints = [
  { name: "CBD", description: "Central dispatch hub for fast city pickups.", x: 50, y: 54, color: "#3b82f6" },
  { name: "Milimani", description: "Upper residential area with quiet streets.", x: 68, y: 30, color: "#60a5fa" },
  { name: "Stage", description: "Busy market and commuter hotspot.", x: 72, y: 18, color: "#60a5fa" },
  { name: "Obunga", description: "Popular residential zone with quick access routes.", x: 16, y: 42, color: "#f59e0b" },
  { name: "Kisian", description: "Suburban area with steady daily traffic.", x: 19, y: 67, color: "#f59e0b" },
  { name: "Nyamasaria", description: "Growing residential estate and family homes.", x: 30, y: 18, color: "#10b981" },
  { name: "Mowlem", description: "Commercial route near key transport lines.", x: 86, y: 58, color: "#10b981" },
  { name: "Nyalenda", description: "Dense local neighborhood with active demand.", x: 39, y: 83, color: "#10b981" },
  { name: "Dunga", description: "Waterfront area with scenic travel corridors.", x: 81, y: 46, color: "#8b5cf6" },
  { name: "Manyatta", description: "Busy residential quarter and service corridor.", x: 88, y: 32, color: "#8b5cf6" },
  { name: "Tom Mboya", description: "Urban neighborhood with strong local connectivity.", x: 58, y: 82, color: "#8b5cf6" },
  { name: "Kibuye", description: "Riverline area with easy pickup access.", x: 27, y: 41, color: "#06b6d4" },
  { name: "Arina", description: "A growing route for local errands and travel.", x: 73, y: 24, color: "#06b6d4" },
  { name: "Kondele", description: "Fast-growing residential zone toward the west.", x: 32, y: 86, color: "#06b6d4" },
  { name: "Kaloleni", description: "Steady neighborhood with high support demand.", x: 75, y: 82, color: "#06b6d4" },
  { name: "Mamboleo", description: "Southern estate with direct service routes.", x: 78, y: 76, color: "#ef4444" },
  { name: "Lolwe", description: "Southwest area with convenient residential access.", x: 12, y: 80, color: "#ef4444" },
  { name: "Kanyamedha", description: "South side destination with easy coordination.", x: 63, y: 80, color: "#ef4444" },
  { name: "RIAT", description: "Academic and residential zone for quick errands.", x: 34, y: 31, color: "#ef4444" },
  { name: "Pipeline", description: "Commercial route with strong local demand.", x: 72, y: 20, color: "#f59e0b" },
];

const activeMapPoint = ref(null);

function getMapPointByName(name) {
  return mapPoints.find((point) => point.name === name) || null;
}

function getMapCalloutStyle(name) {
  const point = getMapPointByName(name);
  if (!point) return {};

  return {
    left: `${point.x}%`,
    top: `${point.y}%`,
    "--callout-color": point.color,
  };
}

// Watch for sameAsCustomer toggle to update recipient fields
watch(() => orderForm.value.sameAsCustomer, (newVal) => {
  if (newVal) {
    orderForm.value.recipientName = orderForm.value.customerName;
    orderForm.value.recipientPhone = orderForm.value.phone;
  } else {
    orderForm.value.recipientName = "";
    orderForm.value.recipientPhone = "";
  }
});

watch([
  () => orderForm.value.customerName,
  () => orderForm.value.phone,
], ([name, phone]) => {
  if (orderForm.value.sameAsCustomer) {
    orderForm.value.recipientName = name;
    orderForm.value.recipientPhone = phone;
  }
});

const pictorials = [
  {
    src: "/images/nicROBOt.jpg",
    alt: "Parcel pickup and delivery",
    title: "Robot Delivery",
    caption: "Fast and secure pickup and delivery across all Kisumu estates.",
  },
  {
    src: "/images/deliDrone.jpeg",
    alt: "Drone delivery services",
    title: "Drone Delivery Services",
    caption: "Remote delivery of household items below 3kgs.",
  },
  {
    src: "/images/robOTS.jpg",
    alt: "Wait-for and office errands",
    title: "Wait-for & Office Errands",
    caption: "Queue wait services, office tasks, and business errands.",
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

// Get available locations for selected estate
const availableLocations = computed(() => {
  return estateLocations[orderForm.value.estate] || [];
});

function phaseClass(phase) {
  const normalized = String(phase || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const phaseClassMap = {
    "central-zone": "phase-cbd-zone",
    "western-zone": "phase-west-zone",
    "northern-zone": "phase-north-zone",
    "eastern-zone": "phase-east-zone",
    "southern-zone": "phase-south-zone",
  };

  return phaseClassMap[normalized] || `phase-${normalized}`;
}

// Get current delivery cost based on selected estate's zone
const currentDeliveryCost = computed(() => {
  const phase = estatePhases.find(p => p.estates.includes(orderForm.value.estate));
  return phase ? phase.price : "N/A";
});

// Reset pickup/dropoff locations when estate changes
watch(() => orderForm.value.estate, () => {
  orderForm.value.pickup = "";
  orderForm.value.dropoff = "";
});

function sanitize(value) {
  return String(value || "").trim();
}

function applyStoredAccountProfile() {
  const user = getRegisteredUser();
  if (!user) return;
  orderForm.value.customerName = user.name || orderForm.value.customerName;
  orderForm.value.email = user.email || orderForm.value.email;
  orderForm.value.accountType = user.account_type || user.accountType || orderForm.value.accountType;
  if (orderForm.value.sameAsCustomer) {
    orderForm.value.recipientName = user.name || orderForm.value.recipientName;
    orderForm.value.recipientPhone = orderForm.value.phone || orderForm.value.recipientPhone;
  }
}

function validatePhone(value) {
  const clean = sanitize(value).replace(/[\s\-()]/g, "");
  return /^(?:\+254|254|0)?7\d{8}$/.test(clean);
}

function toFriendlyDate(isoValue) {
  const parsed = new Date(isoValue || Date.now());
  return Number.isNaN(parsed.getTime()) ? new Date().toLocaleString() : parsed.toLocaleString();
}

function isPersonalDetailsComplete() {
  const baseReady =
    sanitize(orderForm.value.customerName) &&
    validatePhone(orderForm.value.phone) &&
    sanitize(orderForm.value.estate);

  if (!baseReady) return false;
  if (orderForm.value.sameAsCustomer) return true;

  return (
    sanitize(orderForm.value.recipientName) &&
    validatePhone(orderForm.value.recipientPhone)
  );
}

const canProceedToItemsTab = computed(() => isPersonalDetailsComplete());

function scrollToOrderTabs() {
  const target = orderTabsRef.value?.closest?.(".engagement") || orderTabsRef.value;
  if (target && typeof target.scrollIntoView === "function") {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function openWhatsAppMessage(message) {
  if (typeof window === "undefined") return;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function formatFileSize(bytes) {
  if (!bytes || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let value = Number(bytes);
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(1)} ${units[i]}`;
}

function buildOrderWhatsAppMessage(payload) {
  const recipientName = payload.sameAsCustomer ? payload.customerName : payload.recipientName;
  const recipientPhone = payload.sameAsCustomer ? payload.phone : payload.recipientPhone;
  const mediaSize = payload.itemDetails?.mediaFileSize ? formatFileSize(payload.itemDetails.mediaFileSize) : "-";
  const mediaPreview = payload.itemDetails?.mediaPreviewAvailable ? "Yes" : "No";

  return [
    "Delibois Order Request",
    "--- Sender ---",
    `Sender name: ${payload.customerName || "-"}`,
    `Sender phone: ${payload.phone || "-"}`,
    `Sender email: ${payload.email || "-"}`,
    "--- Recipient ---",
    `Recipient name: ${recipientName || "-"}`,
    `Recipient phone: ${recipientPhone || "-"}`,
    "--- Delivery ---",
    `Estate: ${payload.estate || "-"}`,
    `Order type: ${payload.orderType || "-"}`,
    `Delivery cost: ${payload.deliveryCost || "-"}`,
    `Pickup: ${payload.pickup || "-"}`,
    `Drop-off: ${payload.dropoff || "-"}`,
    `Preferred time: ${payload.preferredTime || "-"}`,
    `Urgent: ${payload.urgent ? "Yes" : "No"}`,
    "--- Item ---",
    `Title: ${payload.itemDetails?.title || "-"}`,
    `Description: ${payload.itemDetails?.description || "-"}`,
    `Instructions: ${payload.itemDetails?.instructions || "-"}`,
    `Fragile / delicate: ${payload.itemDetails?.fragile || "No"}`,
    `Media type: ${payload.itemDetails?.mediaType || "none"}`,
    `Media file: ${payload.itemDetails?.mediaFileName || "none"}`,
    `Media size: ${mediaSize}`,
    `Media preview included: ${mediaPreview}`,
    "--- Notes ---",
    `${payload.notes || "-"}`,
  ].join("\n");
}

function getFormErrors(includeItemDetails = false) {
  const errors = {};

  if (!sanitize(orderForm.value.customerName)) errors.customerName = "Full name is required.";
  if (!validatePhone(orderForm.value.phone)) errors.phone = "Use a valid phone number.";
  if (!sanitize(orderForm.value.estate)) errors.estate = "Select an estate.";

  if (!orderForm.value.sameAsCustomer) {
    if (!sanitize(orderForm.value.recipientName)) errors.recipientName = "Recipient name is required.";
    if (!validatePhone(orderForm.value.recipientPhone)) errors.recipientPhone = "Use a valid recipient phone number.";
  }

  if (includeItemDetails) {
    if (!sanitize(orderItemDetails.value.title)) errors.itemTitle = "Item title is required.";
    if (!sanitize(orderForm.value.orderType)) errors.orderType = "Select an order type.";
    if (!sanitize(orderForm.value.pickup)) errors.pickup = "Pickup location is required.";
    if (!sanitize(orderForm.value.dropoff)) errors.dropoff = "Drop-off location is required.";
    if (!sanitize(orderForm.value.preferredTime)) errors.preferredTime = "Choose preferred time.";
  }

  return errors;
}

function validateOrderForm() {
  orderErrors.value = getFormErrors(true);
  return Object.keys(orderErrors.value).length === 0;
}

function validatePersonalDetails() {
  orderErrors.value = getFormErrors();
  return Object.keys(orderErrors.value).length === 0;
}

function proceedToItemsTab() {
  if (validatePersonalDetails()) {
    orderTab.value = "items";
    nextTick(scrollToOrderTabs);
  }
}

if (typeof window !== 'undefined') {
  applyStoredAccountProfile();
}

function goToPersonalDetails() {
  orderTab.value = "personal";
  nextTick(scrollToOrderTabs);
}

function startLocalDriverRequest() {
  orderForm.value.orderType = "Local cab driver request";
  orderForm.value.notes = "Request a local cab driver to take me through Kisumu and the surrounding environment / attractions.";
  orderTab.value = "personal";
  nextTick(scrollToOrderTabs);
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
  const snapshot = {
    ...orderForm.value,
    deliveryCost: currentDeliveryCost.value,
    customerRole: orderForm.value.accountType || "novice customer",
    itemDetails: {
      title: orderItemDetails.value.title,
      description: orderItemDetails.value.description,
      instructions: orderItemDetails.value.instructions,
      mediaType: orderItemDetails.value.mediaType || "none",
      mediaFileName: orderItemDetails.value.imageFile?.name || orderItemDetails.value.videoFile?.name || "",
      mediaFileSize: orderItemDetails.value.imageFile?.size || orderItemDetails.value.videoFile?.size || 0,
      mediaPreviewAvailable: Boolean(orderItemDetails.value.imageFile || orderItemDetails.value.videoFile),
      fragile: orderItemDetails.value.fragile ? "Yes" : "No",
    },
  }; // Capture form data before clearing

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
      message: `Order request ${requestId} received and saved. Opening WhatsApp to confirm details...`,
    };
    orderErrors.value = {};
    orderForm.value = createDefaultOrderForm();
    orderItemDetails.value = createEmptyOrderItemDetails();

    const message = buildOrderWhatsAppMessage(snapshot);
    openWhatsAppMessage(message);

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

function handleMediaUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  if (!isImage && !isVideo) return;

  if (isImage) {
    orderItemDetails.value.imageFile = file;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      orderItemDetails.value.image = loadEvent.target?.result || "";
      orderItemDetails.value.mediaType = "image";
    };
    reader.readAsDataURL(file);
    return;
  }

  orderItemDetails.value.videoFile = file;
  orderItemDetails.value.mediaType = "video";
  orderItemDetails.value.image = URL.createObjectURL(file);
}
</script>

<template>

  <section class="hero" aria-hidden="false">
      <div class="hero-text">
        <h1>
          <span class="hero-accent-primary">Your Personal Errand</span>
          <span class="hero-accent-white"> Partner in Kisumu</span>
        </h1>
        <p class="hero-accent-secondary">Shopping. Deliveries. Pickups. Returns. All in one place.</p>
      </div>
  </section>

  <main class="discover-page">

    <section class="request-layout">
      <aside class="request-side-panel">
        <div class="panel-header">
          <span class="panel-kicker">What we handle</span>
          <h3>Local support for daily life</h3>
        </div>
        <div class="panel-stack">
          <article v-for="card in serviceCards.slice(0, 4)" :key="card.title" class="service-card static-card">
            <div class="service-icon">{{ card.icon }}</div>
            <div>
              <h3>{{ card.title }}</h3>
              <p>{{ card.description }}</p>
            </div>
          </article>
        </div>
      </aside>

      <section class="engagement request-form-panel" aria-label="Request a local delivery or driver">
        <article class="card">
          <div class="section-head">
            <span class="section-kicker">We bet on convenience</span>
            <h2>Schedule a Delivery</h2>
          </div>

          <div class="driver-request-banner">
            <div>
              <p class="driver-request-label">Need a local cab driver?</p>
              <h3>Request a driver to guide you through Kisumu and its surroundings.</h3>
            </div>
            <button class="driver-request-btn" type="button" @click="startLocalDriverRequest">
              Book Driver
            </button>
          </div>

          <div class="order-tabs" ref="orderTabsRef">
            <button
              type="button"
              :class="['tab-btn', { 'active-primary': orderTab === 'personal' }]"
              @click="orderTab = 'personal'; nextTick(scrollToOrderTabs)"
            >
              <span class="tab-number">1</span>
              Sender & Recipient Details
            </button>
            <button
              type="button"
              :class="['tab-btn', { 'active-secondary': orderTab === 'items', disabled: !canProceedToItemsTab }]"
              @click="proceedToItemsTab"
              :disabled="!canProceedToItemsTab"
            >
              <span class="tab-number">2</span>
              Item Details
            </button>
          </div>
          <p class="tab-hint" v-if="!canProceedToItemsTab">Complete sender and recipient details first to unlock item details.</p>

          <form v-if="orderTab === 'personal'" class="smart-form" @submit.prevent="proceedToItemsTab">
            <div class="form-grid two">
              <label class="field">
                <span>Customer name <span class="required">*</span></span>
                <input v-model="orderForm.customerName" type="text" placeholder="Full name" />
                <small v-if="orderErrors.customerName" class="field-error">{{ orderErrors.customerName }}</small>
              </label>
              <label class="field">
                <span>Phone number <span class="required">*</span></span>
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
                <span>Estate / Area <span class="required">*</span></span>
                <select v-model="orderForm.estate">
                  <option v-for="estate in kisumu_estates" :key="estate" :value="estate">{{ estate }}</option>
                </select>
                <small v-if="orderErrors.estate" class="field-error">{{ orderErrors.estate }}</small>
                <small class="cost-display">Delivery cost: {{ currentDeliveryCost }}</small>
              </label>
            </div>

            <label class="checkbox-line">
              <input v-model="orderForm.sameAsCustomer" type="checkbox" />
              <span>Recipient is the same person (use my details above)</span>
            </label>

            <div v-if="!orderForm.sameAsCustomer" class="form-grid two">
              <label class="field">
                <span>Recipient name <span class="required">*</span></span>
                <input v-model="orderForm.recipientName" type="text" placeholder="Full name" />
                <small v-if="orderErrors.recipientName" class="field-error">{{ orderErrors.recipientName }}</small>
              </label>
              <label class="field">
                <span>Recipient phone <span class="required">*</span></span>
                <input v-model="orderForm.recipientPhone" type="tel" placeholder="+254..." />
                <small v-if="orderErrors.recipientPhone" class="field-error">{{ orderErrors.recipientPhone }}</small>
              </label>
            </div>

            <div class="tab-actions">
              <button class="form-btn primary" type="submit">Next: Item Details →</button>
            </div>
          </form>

          <form v-if="orderTab === 'items'" class="smart-form" @submit.prevent="submitOrder">
            <div class="form-section">
              <h3 class="section-title">Item Information</h3>

              <label class="field">
                <span>Item title <span class="required">*</span></span>
                <input v-model="orderItemDetails.title" type="text" placeholder="e.g., Electronics package" />
                <small v-if="orderErrors.itemTitle" class="field-error">{{ orderErrors.itemTitle }}</small>
              </label>

              <label class="field">
                <span>Upload media - image or video (optional)</span>
                <input type="file" accept="image/*,video/*" @change="handleMediaUpload" />
                <small class="field-hint">Supported: JPG, PNG, GIF, WebP, MP4, WebM</small>
              </label>

              <label class="field">
                <span>Item Description</span>
                <textarea
                  v-model="orderItemDetails.description"
                  rows="3"
                  placeholder="Describe the item, condition, special handling needs"
                ></textarea>
              </label>

              <label class="field">
                <span>Delivery instructions</span>
                <textarea
                  v-model="orderItemDetails.instructions"
                  rows="3"
                  placeholder="e.g., Place on porch, fragile, requires signature"
                ></textarea>
              </label>

              <div class="checkbox-row">
                <label class="checkbox-line">
                  <input v-model="orderItemDetails.fragile" type="checkbox" />
                  <span>Item is delicate / fragile</span>
                </label>
                <label class="checkbox-line">
                  <input v-model="orderForm.urgent" type="checkbox" />
                  <span>Mark as urgent priority request</span>
                </label>
              </div>

              <label class="field">
                <span>Pickup location / Area <span class="required">*</span></span>
                <select v-model="orderForm.pickup">
                  <option value="">-- Select pickup area --</option>
                  <option v-for="location in availableLocations" :key="location" :value="location">
                    {{ location }}
                  </option>
                </select>
                <small v-if="orderErrors.pickup" class="field-error">{{ orderErrors.pickup }}</small>
              </label>

              <div v-if="orderItemDetails.image" class="item-preview">
                <img v-if="orderItemDetails.mediaType === 'image'" :src="orderItemDetails.image" :alt="orderItemDetails.title" />
                <video v-else-if="orderItemDetails.mediaType === 'video'" :src="orderItemDetails.image" controls style="width: 100%; border-radius: 8px;"></video>
                <div class="preview-text">
                  <h4>{{ orderItemDetails.title }}</h4>
                  <p v-if="orderItemDetails.mediaType === 'image'" class="media-type-badge">📸 Image</p>
                  <p v-else-if="orderItemDetails.mediaType === 'video'" class="media-type-badge">🎥 Video</p>
                  <p>{{ orderItemDetails.description }}</p>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">Delivery Details</h3>

              <div class="form-grid two">
                <label class="field">
                  <span>Service type <span class="required">*</span></span>
                  <select v-model="orderForm.orderType">
                    <option v-for="type in orderTypes" :key="type" :value="type">{{ type }}</option>
                  </select>
                  <small v-if="orderErrors.orderType" class="field-error">{{ orderErrors.orderType }}</small>
                </label>
                <label class="field">
                  <span>Preferred time <span class="required">*</span></span>
                  <input v-model="orderForm.preferredTime" type="datetime-local" />
                  <small v-if="orderErrors.preferredTime" class="field-error">{{ orderErrors.preferredTime }}</small>
                </label>
              </div>

              <label class="field">
                <span>Drop-off location / Area <span class="required">*</span></span>
                <select v-model="orderForm.dropoff">
                  <option value="">-- Select drop-off area --</option>
                  <option v-for="location in availableLocations" :key="location" :value="location">
                    {{ location }}
                  </option>
                </select>
                <small v-if="orderErrors.dropoff" class="field-error">{{ orderErrors.dropoff }}</small>
              </label>

              <label class="field">
                <span>Order notes</span>
                <textarea
                  v-model="orderForm.notes"
                  rows="3"
                  placeholder="Package details, special instructions, or delivery constraints"
                ></textarea>
              </label>
            </div>

            <div class="tab-actions">
              <button class="form-btn secondary" type="button" @click="goToPersonalDetails">← Back</button>
              <button class="form-btn primary" type="submit" :disabled="orderSubmitting">
                {{ orderSubmitting ? "Submitting..." : "Submit order" }}
              </button>
            </div>

            <p v-if="orderFeedback.message" :class="['form-feedback', orderFeedback.type]">
              {{ orderFeedback.message }}
            </p>
          </form>

          <aside v-if="latestOrder && orderTab === 'items'" class="latest-order">
            <h3>Latest order summary</h3>
            <p><strong>Request ID:</strong> {{ latestOrder.requestId }}</p>
            <p><strong>Type:</strong> {{ latestOrder.orderType }}</p>
            <p><strong>Estate:</strong> {{ latestOrder.estate }}</p>
            <p><strong>Pickup:</strong> {{ latestOrder.pickup }}</p>
            <p><strong>Drop-off:</strong> {{ latestOrder.dropoff }}</p>
            <p><strong>Submitted:</strong> {{ latestOrder.submittedAt }}</p>
          </aside>
        </article>
      </section>
    </section>

    <section class="operations">
      <article class="coverage card">
        <div>
          <h2>Service areas in Kisumu</h2>
          <p>We deliver across all these estates from CBD as our central hub:</p>
        <div class="map-container">
          <div class="map-surface">
            <svg viewBox="0 0 800 600" class="estates-map" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cbdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.1" />
                </linearGradient>
                <linearGradient id="west1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0.1" />
                </linearGradient>
                <linearGradient id="northGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.1" />
                </linearGradient>
                <linearGradient id="eastGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.1" />
                </linearGradient>
                <linearGradient id="southGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#ef4444;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#ef4444;stop-opacity:0.1" />
                </linearGradient>
                <linearGradient id="west2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.1" />
                </linearGradient>
              </defs>

              <circle cx="400" cy="300" r="38" fill="#3b82f6" filter="drop-shadow(0 0 12px rgba(59, 130, 246, 0.45))" />
              <text x="400" y="307" text-anchor="middle" fill="#fff" font-weight="800" font-size="18">CBD</text>

              <g id="estates" aria-label="Kisumu service zones map">
                <line x1="400" y1="300" x2="490" y2="120" stroke="url(#cbdGradient)" stroke-width="3" />
                <line x1="400" y1="300" x2="500" y2="180" stroke="url(#cbdGradient)" stroke-width="3" />
                <line x1="400" y1="300" x2="150" y2="240" stroke="url(#west1Gradient)" stroke-width="3" />
                <line x1="400" y1="300" x2="140" y2="390" stroke="url(#west1Gradient)" stroke-width="3" />
                <line x1="400" y1="300" x2="220" y2="100" stroke="url(#northGradient)" stroke-width="3" />
                <line x1="400" y1="300" x2="300" y2="470" stroke="url(#northGradient)" stroke-width="3" />
                <line x1="400" y1="300" x2="650" y2="165" stroke="url(#eastGradient)" stroke-width="3" />
                <line x1="400" y1="300" x2="580" y2="450" stroke="url(#eastGradient)" stroke-width="3" />
                <line x1="400" y1="300" x2="180" y2="420" stroke="url(#west2Gradient)" stroke-width="3" />
                <line x1="400" y1="300" x2="290" y2="470" stroke="url(#west2Gradient)" stroke-width="3" />
                <line x1="400" y1="300" x2="670" y2="460" stroke="url(#southGradient)" stroke-width="3" />
                <line x1="400" y1="300" x2="120" y2="480" stroke="url(#southGradient)" stroke-width="3" />

                <g
                  v-for="point in mapPoints"
                  :key="point.name"
                  class="map-point"
                  :class="{ active: activeMapPoint === point.name }"
                  :tabindex="0"
                  role="button"
                  :aria-label="point.name + ': ' + point.description"
                  @mouseenter="activeMapPoint = point.name"
                  @mouseleave="activeMapPoint = null"
                  @focus="activeMapPoint = point.name"
                  @blur="activeMapPoint = null"
                >
                  <circle :cx="point.x * 8" :cy="point.y * 6" r="18" :fill="point.color" stroke="rgba(10,13,18,0.8)" stroke-width="2.5" />
                  <text
                    class="map-label"
                    :x="point.x * 8"
                    :y="point.y * 6 + 6"
                    text-anchor="middle"
                    :fill="'#ffffff'"
                    font-weight="800"
                    font-size="12"
                  >{{ point.name }}</text>
                </g>
              </g>
            </svg>

            <div
              v-if="activeMapPoint"
              class="map-callout"
              :style="getMapCalloutStyle(activeMapPoint)"
            >
              <strong>{{ activeMapPoint }}</strong>
              <span>{{ getMapPointByName(activeMapPoint)?.description }}</span>
            </div>
          </div>

          <div class="map-legend">
            <div class="legend-title">Service Zones by Phase</div>
            <div class="legend-items">
              <div class="legend-item">
                <span class="legend-color phase-cbd-zone"></span>
                <span class="legend-label">CBD Zone</span>
              </div>
              <div class="legend-item">
                <span class="legend-color phase-west-zone-1"></span>
                <span class="legend-label">West Zone 1</span>
              </div>
              <div class="legend-item">
                <span class="legend-color phase-north-zone"></span>
                <span class="legend-label">North Zone</span>
              </div>
              <div class="legend-item">
                <span class="legend-color phase-east-zone"></span>
                <span class="legend-label">East Zone</span>
              </div>
              <div class="legend-item">
                <span class="legend-color phase-west-zone-2"></span>
                <span class="legend-label">West Zone 2</span>
              </div>
              <div class="legend-item">
                <span class="legend-color phase-south-zone"></span>
                <span class="legend-label">South Zone</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="estates-phases">
        <div v-for="phaseGroup in estatePhases" :key="phaseGroup.phase" class="phase-group">
          <div class="phase-header">
            <span class="phase-badge" :class="phaseClass(phaseGroup.phase)">{{ phaseGroup.phase }}</span>
            <span class="phase-price" :class="phaseClass(phaseGroup.phase)">{{ phaseGroup.price }}</span>
          </div>
          <p class="phase-description">{{ phaseGroup.description }}</p>
          <div class="phase-estates">
            <div v-for="estate in phaseGroup.estates" :key="estate" class="estate-badge" :class="phaseClass(phaseGroup.phase)">{{ estate }}</div>
          </div>
        </div>
      </div>
      </article>
    </section>

    <h3>See how our local errands come together</h3>

    <section class="pictorials">
      <div class="section-head">
        <h2>Using Smart Delibois</h2>
        <p>Smart Delibois technology used to execute errands and delivery flow.</p>
      </div>
      <div class="pictorial-grid horizontal-layout">
        <article v-for="item in pictorials.slice(0, 3)" :key="item.title" class="pictorial-card">
          <img :src="item.src" :alt="item.alt" loading="lazy" />
          <div class="pictorial-copy">
            <h3>{{ item.title }}</h3>
            <p>{{ item.caption }}</p>
          </div>
        </article>
      </div>
    </section>


    <section class="discover-locations">
      <div class="section-head">
        <h2>Explore Kisumu venues & places</h2>
        <p>{{ featuredCount }} places listed across Kisumu. Filter by category or search by name.</p>
      </div>

      <div class="controls">
        <input
          v-model="search"
          class="search"
          type="search"
          aria-label="Search places, category, or location"
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

      <div v-if="filtered.length" class="places-footer">
        <p class="footer-count">
          Showing <strong>{{ filtered.length }}</strong> venue{{ filtered.length !== 1 ? 's' : '' }}
          <span v-if="filtered.length < featuredCount"> out of {{ featuredCount }} total</span>
        </p>
        <p v-if="filtered.length < featuredCount" class="footer-hint">
          💡 Tip: Adjust your search or filter to see more venues
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.discover-page {
  --bg: var(--bg-dark);
  --panel: var(--surface-dark);
  --soft-panel: var(--surface-dark-alt);
  --line: var(--border-dark);
  --accent: var(--color-secondary);
  --accent-soft: var(--color-secondary-hover);
  --text: var(--text-dark);
  --muted: var(--text-muted-dark);
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 18px 54px;
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
  margin-bottom: 18px;
  color: var(--text-dark);
}

.hero-text {
  max-width: 600px;
}

.hero-text h1 {
  margin: 0 0 12px;
  font-size: clamp(2rem, 3vw, 2.6rem);
  line-height: 1.2;
  font-weight: 700;
  color: var(--text);
}

.hero-text h1 .hero-accent-primary {
  color: var(--color-primary);
}

.hero-text h1 .hero-accent-white {
  color: var(--text);
}

.hero-accent-team {
  color: var(--color-secondary);
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
  margin-top: 28px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.card {
  background: var(--color-secondary);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px;
}

.card h2 {
  margin: 0 0 8px 0;
  font-size: 1.14rem;
  font-weight: 700;
}

.card > p {
  margin: 8px 0 14px;
  color: var(--muted);
  font-size: 0.95rem;
}

.item-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 16px;
}

.item-details-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-preview {
  background: var(--soft-panel);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-preview img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.preview-text h3,
.preview-text h4 {
  margin: 0;
  font-size: 1rem;
  color: var(--text);
}

.preview-text p {
  margin: 6px 0;
  font-size: 0.9rem;
  color: var(--muted);
}

.preview-text small {
  color: var(--muted);
  font-size: 0.85rem;
}

.zone-item {
  background: var(--soft-panel);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 14px;
  text-align: center;
}

.zone-item h3 {
  margin: 0;
  font-size: 0.95rem;
}

.zone-grid,
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.map-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
  background: linear-gradient(135deg, rgba(15, 18, 24, 0.5) 0%, rgba(21, 26, 35, 0.5) 100%);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px;
  box-sizing: border-box;
}

.map-surface {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  background: radial-gradient(circle at center, rgba(24, 32, 43, 0.9) 0%, rgba(12, 16, 22, 0.98) 62%, rgba(8, 10, 14, 1) 100%);
  border: 1px solid rgba(118, 138, 167, 0.35);
}

.estates-map {
  width: 100%;
  height: 100%;
  display: block;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.28));
}

#estates {
  outline: none;
}

#estates line {
  opacity: 0.9;
}

.map-point {
  cursor: pointer;
  outline: none;
}

.map-point text {
  font-size: 12px;
  font-weight: 800;
  fill: #ffffff;
  stroke: rgba(15, 18, 24, 0.9);
  stroke-width: 1.1;
  paint-order: stroke;
  transition: transform 0.2s ease, fill 0.2s ease, font-size 0.2s ease, filter 0.2s ease;
  transform-box: fill-box;
  transform-origin: center;
}

.map-point:hover text,
.map-point:focus text,
.map-point.active text {
  fill: #f8fffe;
  font-size: 13px;
  filter: drop-shadow(0 4px 12px rgba(15, 157, 138, 0.6));
}

.map-point:hover circle,
.map-point:focus circle,
.map-point.active circle {
  stroke: rgba(255, 255, 255, 0.9);
  stroke-width: 3;
  transform: scale(1.06);
}

.map-callout {
  position: absolute;
  z-index: 2;
  min-width: 170px;
  max-width: 200px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(13, 17, 23, 0.96);
  border: 1px solid var(--callout-color, rgba(255,255,255,0.3));
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.28);
  transform: translate(-50%, calc(-100% - 14px));
  pointer-events: none;
}

.map-callout::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -7px;
  width: 12px;
  height: 12px;
  background: rgba(13, 17, 23, 0.96);
  border-right: 1px solid var(--callout-color, rgba(255,255,255,0.3));
  border-bottom: 1px solid var(--callout-color, rgba(255,255,255,0.3));
  transform: translateX(-50%) rotate(45deg);
}

.map-callout strong {
  display: block;
  color: var(--text);
  font-size: 0.92rem;
  line-height: 1.2;
  margin-bottom: 4px;
}

.map-callout span {
  display: block;
  color: var(--muted);
  font-size: 0.74rem;
  line-height: 1.45;
}

.map-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: rgba(29, 35, 48, 0.6);
  border: 1px solid var(--line);
  border-radius: 10px;
}

.legend-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.legend-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.legend-color {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
}

.legend-label {
  font-size: 0.82rem;
  color: var(--muted);
  font-weight: 600;
}

.estates-list {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.zone-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.coverage {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  align-items: start;
}

.estates-phases {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.phase-group {
  background: var(--soft-panel);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px;
}

.phase-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  justify-content: space-between;
}

.phase-price {
  background: #ff7a18;
  color: #0f1218;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 8px;
  white-space: nowrap;
}

.phase-badge {
  color: #0f1218;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.phase-price {
  color: #0f1218;
}

.phase-cbd-zone {
  color: var(--phase-cbd-zone);
  background-color: var(--phase-cbd-zone);
  border-color: var(--phase-cbd-zone);
}

.phase-west-zone-1 {
  color: var(--phase-west-zone-1);
  background-color: var(--phase-west-zone-1);
  border-color: var(--phase-west-zone-1);
}

.phase-north-zone {
  color: var(--phase-north-zone);
  background-color: var(--phase-north-zone);
  border-color: var(--phase-north-zone);
}

.phase-east-zone {
  color: var(--phase-east-zone);
  background-color: var(--phase-east-zone);
  border-color: var(--phase-east-zone);
}

.phase-west-zone-2 {
  color: var(--phase-west-zone-2);
  background-color: var(--phase-west-zone-2);
  border-color: var(--phase-west-zone-2);
}

.phase-south-zone {
  color: var(--phase-south-zone);
  background-color: var(--phase-south-zone);
  border-color: var(--phase-south-zone);
}

.legend-color.phase-cbd-zone,
.legend-color.phase-west-zone-1,
.legend-color.phase-north-zone,
.legend-color.phase-east-zone,
.legend-color.phase-west-zone-2,
.legend-color.phase-south-zone {
  display: inline-block;
  width: 14px;
  height: 14px;
}

.phase-header h3 {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text);
}

.phase-description {
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  color: var(--muted);
}

.phase-estates {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.estate-badge {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid currentColor;
  color: var(--text);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  white-space: nowrap;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, opacity 0.2s ease;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
}

.estate-badge:hover,
.estate-badge:focus-visible {
  transform: scale(1.06);
  background: rgba(255, 255, 255, 0.16);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 8px 18px rgba(15, 157, 138, 0.18);
  outline: none;
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
  margin-top: 28px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px;
}

.request-layout {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(420px, 2.2fr);
  gap: 20px;
  align-items: stretch;
  margin-top: 10px;
}

.request-form-panel {
  min-width: 0;
}

.request-side-panel {
  background: var(--soft-panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-header {
  display: grid;
  gap: 8px;
}

.panel-kicker {
  color: #ffb36b;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text);
}

.panel-stack {
  display: grid;
  gap: 12px;
}

.static-card {
  min-height: 0;
}

.engagement {
  margin-top: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.section-head h2 {
  margin: 0;
  font-size: 1.28rem;
  font-weight: 700;
  color: var(--text);
}

.section-head p {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 0.95rem;
}

.pictorial-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.pictorial-grid.horizontal-layout {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.pictorial-card {
  background: var(--soft-panel);
  border-radius: 12px;
  border: 1px solid #2f3746;
  overflow: hidden;
  transition: all 0.3s ease;
}

.pictorial-card:hover {
  border-color: var(--accent);
  box-shadow: 0 6px 16px rgba(255, 122, 24, 0.15);
}

.pictorial-card img {
  width: 100%;
  height: auto;
  max-height: 220px;
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
  margin-top: 16px;
  display: grid;
  gap: 12px;
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

.field span .required {
  color: #ff6b6b;
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
  transition: border-color 0.2s ease;
}

.field:has(.field-error) input,
.field:has(.field-error) select,
.field:has(.field-error) textarea {
  border-color: #dc2626;
  border-width: 2px;
  padding: 9px 11px;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.field:has(.field-error) input:focus,
.field:has(.field-error) select:focus,
.field:has(.field-error) textarea:focus {
  border-color: #dc2626;
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

.checkbox-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.checkbox-line input {
  margin-top: 3px;
}

.field-error {
  color: #dc2626;
  font-size: 0.78rem;
  font-weight: 500;
}

.cost-display {
  color: #10b981;
  font-size: 0.78rem;
  font-weight: 600;
  margin-top: 4px;
  display: block;
}

.field-hint {
  color: var(--muted);
  font-size: 0.75rem;
  font-style: italic;
  margin-top: 4px;
}

.media-type-badge {
  display: inline-block;
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin: 4px 0 !important;
}

.driver-request-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 18px 0 12px;
  padding: 16px 18px;
  border: 1px solid #0f1218; 
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(15, 157, 138, 0.12), rgba(59, 130, 246, 0.08));
}

.driver-request-label {
  margin: 0 0 6px;
  color: #ffb36b;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.driver-request-banner h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text);
}

.driver-request-btn {
  margin: 6px 10px 0;
  border: 1px solid rgba(255, 122, 0, 0.45);
  border-radius: 10px;
  padding: 11px 16px;
  color: #101318;
  background: var(--color-primary);
  font-weight: 800;
  font-size: 0.92rem;
  cursor: pointer;
  transition: background 0.25s ease, filter 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
  box-shadow: 0 6px 18px rgba(255, 122, 0, 0.22);
}

.driver-request-btn:hover {
  background: var(--color-primary-hover);
  filter: brightness(0.65);
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(255, 122, 0, 0.26);
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
  border: 2px solid #16a34a;
  color: #16a34a;
  font-weight: 500;
}

.form-feedback.error {
  background: rgba(220, 38, 38, 0.15);
  border: 2px solid #dc2626;
  color: #dc2626;
  font-weight: 500;
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

.places-footer {
  margin-top: 18px;
  padding: 16px 12px;
  border-top: 1px solid var(--line);
  text-align: center;
  background: rgba(255, 122, 24, 0.04);
  border-radius: 10px;
}

.footer-count {
  margin: 0 0 8px;
  font-size: 0.95rem;
  color: var(--text);
}

.footer-count strong {
  color: var(--accent);
  font-weight: 700;
}

.footer-message {
  margin: 8px 0;
  font-size: 0.85rem;
  color: var(--muted);
  letter-spacing: 0.05em;
}

.footer-hint {
  margin: 12px 0 0;
  font-size: 0.9rem;
  color: #ffb25f;
}

.order-tabs {
  display: flex;
  gap: 10px;
  margin: 16px 0 24px;
  border-bottom: 1px solid var(--line);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--muted);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: var(--text);
  background: rgba(255, 122, 24, 0.05);
}

  .tab-btn.disabled,
  .tab-btn:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    color: var(--muted);
    background: transparent;
  }

.tab-hint {
  margin-top: 8px;
  font-size: 0.92rem;
  color: var(--muted);
}

.tab-btn.active-primary,
.tab-btn.active-secondary {
  border-bottom-color: currentColor;
  color: currentColor;
}

.tab-btn.active-primary {
  color: var(--color-primary);
}

.tab-btn.active-secondary {
  color: var(--color-secondary);
}

.tab-btn.active-primary .tab-number,
.tab-btn.active-secondary .tab-number {
  background: currentColor;
  border-color: currentColor;
  color: #0f1218;
}

  /* Hero highlights (desktop defaults) */
  .hero-highlights {
    margin-bottom: 24px;
    width: 100%;
  }

  .hero-highlights-main {
    display: grid;
    gap: 18px;
  }

  .hero-highlights-intro {
    padding: 4px 2px 0;
  }

  .hero-highlights-intro h3 {
    margin: 0 0 8px;
    font-size: 1.15rem;
    color: var(--text);
  }

  .hero-highlights-intro p {
    margin: 0 0 8px;
    color: var(--muted);
    line-height: 1.6;
  }

  .hero-highlights-bottom {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    align-items: start;
  }

  .card-wrapper {
    background: var(--soft-panel);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 16px;
    box-sizing: border-box;
    min-height: 100%;
  }

  .service-highlight-grid {
    display: grid;
    gap: 12px;
    align-items: stretch;
  }

  .service-highlight-grid::-webkit-scrollbar {
    display: none;
  }

  .service-card,
  .trust-card {
    background: var(--soft-panel);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 16px;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: flex-start;
    gap: 12px;
    min-width: 200px;
    flex: 0 0 auto;
    scroll-snap-align: start;
    color: var(--text);
  }

  .service-icon {
    display: inline-flex;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
    background: rgba(255, 138, 44, 0.12);
    border-radius: 14px;
    font-size: 1.2rem;
  }

  .service-card h3,
  .trust-card strong {
    margin: 0 0 6px;
    font-size: 1rem;
    color: var(--text);
  }

  .service-card p,
  .trust-card p {
    color: var(--muted);
    margin: 0;
  }

.tab-number {
  margin-top: 8px;
  font-size: 0.92rem;
  color: var(--muted);
}

.tab-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--soft-panel);
  border: 1px solid var(--line);
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 700;
}

.tab-btn.active-primary .tab-number,
.tab-btn.active-secondary .tab-number {
  background: var(--accent);
  border-color: var(--accent);
  color: #0f1218;
}

.form-section {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.tab-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
}

.form-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-btn.primary {
  background: var(--accent);
  color: #0f1218;
}

.form-btn.primary:hover:not(:disabled) {
  background: #ffb25f;
  box-shadow: 0 4px 12px rgba(255, 122, 24, 0.3);
}

.form-btn.secondary {
  background: var(--soft-panel);
  border: 1px solid var(--line);
  color: var(--text);
}

.form-btn.secondary:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.form-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 980px) {
  .request-layout {
    grid-template-columns: 1fr;
  }

  .driver-request-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .delibois-hero,
  .engagement {
    grid-template-columns: 1fr;
  }

  .coverage {
    grid-template-columns: 1fr;
  }

  .zone-grid,
  .pricing-grid,
  .pictorial-grid {
    grid-template-columns: 1fr 1fr;
  }

  .item-details-grid {
    grid-template-columns: 1fr;
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

  .hero-highlights {
    margin-bottom: 24px;
    width: 100%;
  }

  .hero-highlights-main {
    display: grid;
    gap: 16px;
  }

  .hero-highlights-intro {
    padding: 4px 2px 0;
  }

  .hero-highlights-bottom {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .card-wrapper {
    background: var(--soft-panel);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 16px;
    box-sizing: border-box;
    min-height: 100%;
  }

  .service-highlight-grid {
    display: grid;
    gap: 12px;
    align-items: stretch;
  }

  .service-highlight-grid::-webkit-scrollbar {
    display: none;
  }

  .trust-cards {
    display: grid;
    gap: 10px;
  }

  .service-card,
  .trust-card {
    background: var(--soft-panel);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 16px;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
    color: var(--text);
  }

  .service-icon {
    display: inline-flex;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
    background: rgba(255, 138, 44, 0.12);
    border-radius: 14px;
    font-size: 1.2rem;
  }

  .service-card h3,
  .trust-card strong {
    margin: 0 0 6px;
    font-size: 1rem;
    color: var(--text);
  }

  .service-card p,
  .trust-card p {
    color: var(--muted);
    margin: 0;
  }

  @media (min-width: 980px) {
    .service-highlight-grid {
      flex-wrap: wrap;
      overflow-x: visible;
    }

    .service-card {
      flex: 0 0 calc(50% - 12px);
      min-width: 180px;
    }
  }

  .hero-highlights-pictorials-wrap {
    margin-top: 8px;
    padding-top: 18px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .hero-highlights-pictorials-wrap h3 {
    margin: 0 0 10px;
    font-size: 1.2rem;
    color: var(--text);
  }

  .hero-highlights-pictorials-wrap p {
    margin: 0 0 16px;
    color: var(--muted);
    max-width: 62ch;
  }

  .hero-highlights-pictorials {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 14px;
  }

  .highlight-pictorial {
    display: grid;
    gap: 10px;
    background: var(--soft-panel);
    border: 1px solid var(--line);
    border-radius: 16px;
    overflow: hidden;
  }

  .highlight-pictorial img {
    width: 100%;
    height: auto;
    max-height: 240px;
    object-fit: cover;
    display: block;
  }

  .highlight-pictorial h3 {
    margin: 0;
    font-size: 1rem;
    color: var(--text);
  }

  .highlight-pictorial p {
    margin: 0;
    padding: 0 14px 16px;
    color: var(--muted);
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .trust-highlight-grid {
    display: grid;
    gap: 12px;
  }

  .trust-heading h2 {
    margin: 0 0 8px;
    font-size: 1.18rem;
  }

  .trust-heading p {
    margin: 0;
    color: var(--muted);
  }

  .zone-grid,
  .pricing-grid,
  .pictorial-grid,
  .form-grid.two {
    grid-template-columns: 1fr;
  }

  .places-scroll {
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }

  .form-btn-row {
    flex-direction: column;
    align-items: stretch;
  }

  .form-btn {
    width: 100%;
  }
}

@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
