<script setup>
import { computed, ref, watch } from "vue";
import places from "../data/places.json";
import PlaceCard from "../components/PlaceCard.vue";
import {
  createDeliboisOrder,
} from "../services/delibois.service";

const search = ref("");
const activeCategory = ref("All");

const kisumu_estates = [
  "Arina",
  "Airport",
  "Dunga",
  "Kaloleni",
  "Kanyamedha",
  "Kibuye",
  "Kisian",
  "Kondele",
  "Lolwe",
  "Makasembo",
  "Mamboleo",
  "Manyatta",
  "Milimani",
  "Mowlem",
  "Nyalenda",
  "Nyamasaria",
  "Obunga",
  "Pipeline",
  "RIAT",
  "Stage",
  "Tom Mboya",
];

const estatesExcludingCBD = computed(() => kisumu_estates.filter(e => e !== "CBD"));

const estatePhases = [
  {
    phase: "CBD Zone",
    title: "CBD & Hub",
    description: "Central service hub and main transit points",
    price: "KES 250",
    color: "#3b82f6",
    estates: ["CBD", "Stage", "Milimani"],
  },
  {
    phase: "West Zone",
    title: "West Zone 1",
    description: "Western zone coverage",
    price: "KES 300",
    color: "#f59e0b",
    estates: ["Obunga", "Pipeline", "Kisian", "Airport"],
  },
  {
    phase: "North Zone",
    title: "North Zone",
    description: "Northern estates expansion",
    price: "KES 300",
    color: "#10b981",
    estates: ["Mowlem", "Nyamasaria", "Nyalenda"],
  },
  {
    phase: "East Zone",
    title: "East Zone",
    description: "Eastern estates coverage",
    price: "KES 350",
    color: "#8b5cf6",
    estates: ["Dunga", "Manyatta", "Tom Mboya"],
  },
  {
    phase: "West Zone 2",
    title: "West Zone 2",
    description: "Western estates service area",
    price: "KES 350",
    color: "#06b6d4",
    estates: ["Kibuye", "Arina", "Kondele", "Kaloleni"],
  },
  {
    phase: "South Zone",
    title: "South Zone",
    description: "Southern estates network",
    price: "KES 400",
    color: "#ef4444",
    estates: ["Mamboleo", "Lolwe", "RIAT", "Kanyamedha"],
  },
];

const estateLocations = {
  "CBD": ["City Center", "CTC", "Main Street", "River Road", "Kenyatta Avenue"],
  "Stage": ["Stage", "Market", "Town Centre", "Old Town", "Stage Road"],
  "Milimani": ["Milimani", "Milimani Shopping", "Milimani Crest", "Club Milimani"],
  "Obunga": ["Obunga Market", "Obunga Beach", "Obunga Road", "Makao"],
  "Pipeline": ["Pipeline", "Pipeline Road", "Chevron", "Oil Depot"],
  "Kisian": ["Kisian", "Kisian Market", "New Kisian", "Kisian Cross"],
  "Airport": ["Airport", "Airport Road", "Airport Inn", "Kisumu Airport"],
  "Mowlem": ["Mowlem", "Mowlem Market", "Mowlem Shopping", "Mowlem Road"],
  "Nyamasaria": ["Nyamasaria", "Nyamasaria Market", "Nyamasaria Road", "Karachuonyo"],
  "Nyalenda": ["Nyalenda", "Nyalenda Market", "Nyalenda Estate", "Nyalenda Cross"],
  "Dunga": ["Dunga", "Dunga Beach", "Dunga Market", "Fish Landing"],
  "Manyatta": ["Manyatta", "Manyatta Market", "Manyatta Shopping", "Manyatta Road"],
  "Tom Mboya": ["Tom Mboya", "Tom Mboya Market", "Tom Mboya Estate", "Tom Mboya Road"],
  "Kibuye": ["Kibuye", "Kibuye Market", "Kibuye Road", "Kibuye Estate"],
  "Arina": ["Arina", "Arina Market", "Arina Shopping", "Arina Road"],
  "Kondele": ["Kondele", "Kondele Market", "Kondele Road", "Kondele Shopping"],
  "Kaloleni": ["Kaloleni", "Kaloleni Market", "Kaloleni Road", "Kaloleni Estate"],
  "Mamboleo": ["Mamboleo", "Mamboleo Market", "Mamboleo Estate", "Mamboleo Road"],
  "Lolwe": ["Lolwe", "Lolwe Beach", "Lolwe Market", "Lolwe Road"],
  "RIAT": ["RIAT", "RIAT Road", "Research Institute", "RIAT Area"],
  "Kanyamedha": ["Kanyamedha", "Kanyamedha Market", "Kanyamedha Road", "Kanyamedha Estate"],
};

const whatsappNumber = "254732379292"; // WhatsApp international format
const phoneDisplay = "+254 0732379292"; // Display format for call/booking
const orderTypes = [
  "Parcel pick-up",
  "Grocery shopping",
  "Supermarket shopping",
  "Household shopping",
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
});

const orderForm = ref(createDefaultOrderForm());
const orderErrors = ref({});
const orderFeedback = ref({ type: "", message: "" });
const orderSubmitting = ref(false);
const latestOrder = ref(null);
const orderTab = ref("personal"); // "personal" or "items"

const orderItemDetails = ref({
  show: false,
  title: "",
  image: "",
  imageFile: null,
  videoFile: null,
  mediaType: null,
  description: "",
  instructions: "",
});

// Watch for sameAsCustomer toggle to update recipient fields
watch(() => orderForm.value.sameAsCustomer, (newVal) => {
  if (newVal) {
    // When checked, copy customer details to recipient
    orderForm.value.recipientName = orderForm.value.customerName;
    orderForm.value.recipientPhone = orderForm.value.phone;
  } else {
    // When unchecked, clear recipient fields
    orderForm.value.recipientName = "";
    orderForm.value.recipientPhone = "";
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
  const recipientName = payload.sameAsCustomer ? payload.customerName : payload.recipientName;
  const recipientPhone = payload.sameAsCustomer ? payload.phone : payload.recipientPhone;
  return [
    "Delibois Order Request",
    `Name: ${payload.customerName || "-"}`,
    `Phone: ${payload.phone || "-"}`,
    `Email: ${payload.email || "-"}`,
    `Estate: ${payload.estate || "-"}`,
    `Order Type: ${payload.orderType || "-"}`,
    `Recipient Name: ${recipientName || "-"}`,
    `Recipient Phone: ${recipientPhone || "-"}`,
    `Pickup: ${payload.pickup || "-"}`,
    `Drop-off: ${payload.dropoff || "-"}`,
    `Preferred Time: ${payload.preferredTime || "-"}`,
    `Urgent: ${payload.urgent ? "Yes" : "No"}`,
    `Notes: ${payload.notes || "-"}`,
  ].join("\n");
}

function validateOrderForm() {
  const errors = {};
  if (!sanitize(orderForm.value.customerName)) errors.customerName = "Full name is required.";
  if (!validatePhone(orderForm.value.phone)) errors.phone = "Use a valid phone number.";
  if (!sanitize(orderForm.value.estate)) errors.estate = "Select an estate.";
  if (!sanitize(orderForm.value.orderType)) errors.orderType = "Select an order type.";
  if (!orderForm.value.sameAsCustomer) {
    if (!sanitize(orderForm.value.recipientName)) errors.recipientName = "Recipient name is required.";
    if (!validatePhone(orderForm.value.recipientPhone)) errors.recipientPhone = "Use a valid recipient phone number.";
  }
  if (!sanitize(orderForm.value.pickup)) errors.pickup = "Pickup location is required.";
  if (!sanitize(orderForm.value.dropoff)) errors.dropoff = "Drop-off location is required.";
  if (!sanitize(orderForm.value.preferredTime)) errors.preferredTime = "Choose preferred time.";
  orderErrors.value = errors;
  return Object.keys(errors).length === 0;
}

function validatePersonalDetails() {
  const errors = {};
  if (!sanitize(orderForm.value.customerName)) errors.customerName = "Full name is required.";
  if (!validatePhone(orderForm.value.phone)) errors.phone = "Use a valid phone number.";
  if (!sanitize(orderForm.value.estate)) errors.estate = "Select an estate.";
  orderErrors.value = errors;
  return Object.keys(errors).length === 0;
}

function proceedToItemsTab() {
  if (validatePersonalDetails()) {
    orderTab.value = "items";
  }
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
  const snapshot = { ...orderForm.value }; // Capture form data before clearing

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
    
    // Open WhatsApp with order details
    setTimeout(() => {
      openWhatsAppMessage(buildOrderWhatsAppMessage(snapshot));
    }, 500);
    
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
  if (file) {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (isImage) {
      orderItemDetails.value.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        orderItemDetails.value.image = e.target?.result || "";
        orderItemDetails.value.mediaType = 'image';
      };
      reader.readAsDataURL(file);
    } else if (isVideo) {
      orderItemDetails.value.videoFile = file;
      orderItemDetails.value.mediaType = 'video';
      // Create video preview URL
      const videoUrl = URL.createObjectURL(file);
      orderItemDetails.value.image = videoUrl;
    }
  }
}
</script>

<template>

  <section class="hero" aria-hidden="false">
      <div class="hero-text">
        <h1>Fast Errand Bois Across Kisumu City</h1>
        <p>Delibois handles your tasks while you focus on what matters.</p>
      </div>
  </section>

  <main class="discover-page">

    <section class="operations">
      <article class="coverage card">
        <div>
          <h2>Service areas in Kisumu</h2>
          <p>We deliver across all these estates from CBD as our central hub:</p>
        <div class="map-container">
          <svg viewBox="0 0 800 600" class="estates-map" xmlns="http://www.w3.org/2000/svg">
            <!-- Color definitions for each zone -->
            <defs>
              <!-- CBD Zone - Blue -->
              <linearGradient id="cbdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.1" />
              </linearGradient>
              <!-- West Zone 1 - Orange -->
              <linearGradient id="west1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0.1" />
              </linearGradient>
              <!-- North Zone - Green -->
              <linearGradient id="northGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.1" />
              </linearGradient>
              <!-- East Zone - Purple -->
              <linearGradient id="eastGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.1" />
              </linearGradient>
              <!-- South Zone - Red -->
              <linearGradient id="southGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ef4444;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#ef4444;stop-opacity:0.1" />
              </linearGradient>
              <!-- West Zone 2 - Cyan -->
              <linearGradient id="west2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.1" />
              </linearGradient>
            </defs>
            
            <!-- CBD Center Hub -->
            <circle cx="400" cy="300" r="32" fill="#3b82f6" filter="drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))" />
            <text x="400" y="308" text-anchor="middle" fill="#fff" font-weight="bold" font-size="16">CBD</text>
            
            <!-- Estate nodes and connections by zone -->
            <g id="estates">
              <!-- CBD Zone (Blue) -->
              <line x1="400" y1="300" x2="480" y2="100" stroke="url(#cbdGradient)" stroke-width="2.5" />
              <circle cx="480" cy="100" r="18" fill="#3b82f6" stroke="#1e3a8a" stroke-width="2" />
              <text x="480" y="105" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Stage</text>
              
              <line x1="400" y1="300" x2="480" y2="130" stroke="url(#cbdGradient)" stroke-width="2.5" />
              <circle cx="480" cy="130" r="18" fill="#3b82f6" stroke="#1e3a8a" stroke-width="2" />
              <text x="480" y="135" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Milimani</text>
              
              <!-- West Zone 1 (Orange) -->
              <line x1="400" y1="300" x2="100" y2="200" stroke="url(#west1Gradient)" stroke-width="2.5" />
              <circle cx="100" cy="200" r="18" fill="#f59e0b" stroke="#92400e" stroke-width="2" />
              <text x="100" y="205" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Obunga</text>
              
              <line x1="400" y1="300" x2="550" y2="120" stroke="url(#west1Gradient)" stroke-width="2.5" />
              <circle cx="550" cy="120" r="18" fill="#f59e0b" stroke="#92400e" stroke-width="2" />
              <text x="550" y="125" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Pipeline</text>
              
              <line x1="400" y1="300" x2="150" y2="380" stroke="url(#west1Gradient)" stroke-width="2.5" />
              <circle cx="150" cy="380" r="18" fill="#f59e0b" stroke="#92400e" stroke-width="2" />
              <text x="150" y="385" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Kisian</text>
              
              <!-- North Zone (Green) -->
              <line x1="400" y1="300" x2="750" y2="350" stroke="url(#northGradient)" stroke-width="2.5" />
              <circle cx="750" cy="350" r="18" fill="#10b981" stroke="#065f46" stroke-width="2" />
              <text x="750" y="355" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Mowlem</text>
              
              <line x1="400" y1="300" x2="200" y2="100" stroke="url(#northGradient)" stroke-width="2.5" />
              <circle cx="200" cy="100" r="18" fill="#10b981" stroke="#065f46" stroke-width="2" />
              <text x="200" y="105" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Nyamasaria</text>
              
              <line x1="400" y1="300" x2="300" y2="480" stroke="url(#northGradient)" stroke-width="2.5" />
              <circle cx="300" cy="480" r="18" fill="#10b981" stroke="#065f46" stroke-width="2" />
              <text x="300" y="485" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Nyalenda</text>
              
              <!-- East Zone (Purple) -->
              <line x1="400" y1="300" x2="650" y2="320" stroke="url(#eastGradient)" stroke-width="2.5" />
              <circle cx="650" cy="320" r="18" fill="#8b5cf6" stroke="#4c1d95" stroke-width="2" />
              <text x="650" y="325" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Dunga</text>
              
              <line x1="400" y1="300" x2="700" y2="200" stroke="url(#eastGradient)" stroke-width="2.5" />
              <circle cx="700" cy="200" r="18" fill="#8b5cf6" stroke="#4c1d95" stroke-width="2" />
              <text x="700" y="205" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Manyatta</text>
              
              <line x1="400" y1="300" x2="450" y2="500" stroke="url(#eastGradient)" stroke-width="2.5" />
              <circle cx="450" cy="500" r="18" fill="#8b5cf6" stroke="#4c1d95" stroke-width="2" />
              <text x="450" y="505" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Tom Mboya</text>
              
              <!-- West Zone 2 (Cyan) -->
              <line x1="400" y1="300" x2="200" y2="250" stroke="url(#west2Gradient)" stroke-width="2.5" />
              <circle cx="200" cy="250" r="18" fill="#06b6d4" stroke="#164e63" stroke-width="2" />
              <text x="200" y="255" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Kibuye</text>
              
              <line x1="400" y1="300" x2="580" y2="150" stroke="url(#west2Gradient)" stroke-width="2.5" />
              <circle cx="580" cy="150" r="18" fill="#06b6d4" stroke="#164e63" stroke-width="2" />
              <text x="580" y="155" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Arina</text>
              
              <line x1="400" y1="300" x2="250" y2="500" stroke="url(#west2Gradient)" stroke-width="2.5" />
              <circle cx="250" cy="500" r="18" fill="#06b6d4" stroke="#164e63" stroke-width="2" />
              <text x="250" y="505" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Kondele</text>
              
              <line x1="400" y1="300" x2="600" y2="480" stroke="url(#west2Gradient)" stroke-width="2.5" />
              <circle cx="600" cy="480" r="18" fill="#06b6d4" stroke="#164e63" stroke-width="2" />
              <text x="600" y="485" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Kaloleni</text>
              
              <!-- South Zone (Red) -->
              <line x1="400" y1="300" x2="650" y2="480" stroke="url(#southGradient)" stroke-width="2.5" />
              <circle cx="650" cy="480" r="18" fill="#ef4444" stroke="#7f1d1d" stroke-width="2" />
              <text x="650" y="485" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Mamboleo</text>
              
              <line x1="400" y1="300" x2="100" y2="480" stroke="url(#southGradient)" stroke-width="2.5" />
              <circle cx="100" cy="480" r="18" fill="#ef4444" stroke="#7f1d1d" stroke-width="2" />
              <text x="100" y="485" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Lolwe</text>
              
              <line x1="400" y1="300" x2="520" y2="480" stroke="url(#southGradient)" stroke-width="2.5" />
              <circle cx="520" cy="480" r="18" fill="#ef4444" stroke="#7f1d1d" stroke-width="2" />
              <text x="520" y="485" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Kanyamedha</text>
              
              <line x1="400" y1="300" x2="280" y2="180" stroke="url(#southGradient)" stroke-width="2.5" />
              <circle cx="280" cy="180" r="18" fill="#ef4444" stroke="#7f1d1d" stroke-width="2" />
              <text x="280" y="185" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">RIAT</text>
            </g>
          </svg>

          <!-- Zone Legend -->
          <div class="map-legend">
            <div class="legend-title">Service Zones by Phase</div>
            <div class="legend-items">
              <div class="legend-item">
                <span class="legend-color" style="background: #3b82f6;"></span>
                <span class="legend-label">CBD Zone</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #f59e0b;"></span>
                <span class="legend-label">West Zone 1</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #10b981;"></span>
                <span class="legend-label">North Zone</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #8b5cf6;"></span>
                <span class="legend-label">East Zone</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #06b6d4;"></span>
                <span class="legend-label">West Zone 2</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #ef4444;"></span>
                <span class="legend-label">South Zone</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="estates-phases">
        <div v-for="phaseGroup in estatePhases" :key="phaseGroup.phase" class="phase-group">
          <div class="phase-header">
            <span class="phase-badge" :style="{ backgroundColor: phaseGroup.color }">{{ phaseGroup.phase }}</span>
            <h3>{{ phaseGroup.title }}</h3>
            <span class="phase-price" :style="{ backgroundColor: phaseGroup.color, borderColor: phaseGroup.color }">{{ phaseGroup.price }}</span>
          </div>
          <p class="phase-description">{{ phaseGroup.description }}</p>
          <div class="phase-estates">
            <div v-for="estate in phaseGroup.estates" :key="estate" class="estate-badge" :style="{ borderColor: phaseGroup.color, color: phaseGroup.color }">{{ estate }}</div>
          </div>
        </div>
      </div>
      </article>
    </section>

    <section class="pictorials">
      <div class="section-head">
        <h2>Digital Delibois</h2>
        <p>Future delibois tehnology used to execute errands and delivery flow.</p>
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
          <h2>Order your errand boi</h2>
          <p>Step-by-step process to submit your order details.</p>
        </div>

        <div class="order-tabs">
          <button
            :class="['tab-btn', { active: orderTab === 'personal' }]"
            @click="orderTab = 'personal'"
          >
            <span class="tab-number">1</span>
            Personal Details
          </button>
          <button
            :class="['tab-btn', { active: orderTab === 'items' }]"
            @click="orderTab = 'items'"
          >
            <span class="tab-number">2</span>
            Item & Delivery Details
          </button>
        </div>

        <!-- Step 1: Personal Details Tab -->
        <form v-if="orderTab === 'personal'" class="smart-form" @submit.prevent="proceedToItemsTab">
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
              <span>Estate / Area *</span>
              <select v-model="orderForm.estate">
                <option v-for="estate in kisumu_estates" :key="estate" :value="estate">{{ estate }}</option>
              </select>
              <small v-if="orderErrors.estate" class="field-error">{{ orderErrors.estate }}</small>
              <small class="cost-display">Delivery cost: {{ currentDeliveryCost }}</small>
            </label>
          </div>

          <div class="tab-actions">
            <button class="form-btn primary" type="submit">Next: Item Details →</button>
          </div>
        </form>

        <!-- Step 2: Item & Delivery Details Tab -->
        <form v-if="orderTab === 'items'" class="smart-form" @submit.prevent="submitOrder">
          <div class="form-section">
            <h3 class="section-title">Item Information</h3>
            
            <label class="field">
              <span>Item title *</span>
              <input v-model="orderItemDetails.title" type="text" placeholder="e.g., Electronics package" />
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
            
            <label class="field">
              <span>Pickup location / Area *</span>
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
                <span>Service type *</span>
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

            <div class="form-section">
              <h3 class="section-title">Recipient Details</h3>
              
              <label class="checkbox-line">
                <input v-model="orderForm.sameAsCustomer" type="checkbox" />
                <span>Recipient is the same person (use my details above)</span>
              </label>

              <div v-if="!orderForm.sameAsCustomer" class="form-grid two">
                <label class="field">
                  <span>Recipient name *</span>
                  <input v-model="orderForm.recipientName" type="text" placeholder="Full name" />
                  <small v-if="orderErrors.recipientName" class="field-error">{{ orderErrors.recipientName }}</small>
                </label>
                <label class="field">
                  <span>Recipient phone *</span>
                  <input v-model="orderForm.recipientPhone" type="tel" placeholder="+254..." />
                  <small v-if="orderErrors.recipientPhone" class="field-error">{{ orderErrors.recipientPhone }}</small>
                </label>
              </div>
            </div>

            <label class="field">
              <span>Drop-off location / Area *</span>
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

            <label class="field">
              <span>Delivery instructions</span>
              <textarea
                v-model="orderItemDetails.instructions"
                rows="3"
                placeholder="e.g., Place on porch, fragile, requires signature"
              ></textarea>
            </label>

            <label class="checkbox-line">
              <input v-model="orderForm.urgent" type="checkbox" />
              <span>Mark as urgent priority request</span>
            </label>
          </div>

          <div class="tab-actions">
            <button class="form-btn secondary" type="button" @click="orderTab = 'personal'">← Back</button>
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
  margin-bottom: 32px;
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
  margin-top: 28px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.card {
  background: var(--panel);
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

.map-container > div:first-child {
  width: 100%;
  height: 500px;
}

.estates-map {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
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
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
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
  font-weight: 500;
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
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
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
  background: currentColor;
  opacity: 0.15;
  border: 1px solid currentColor;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 8px;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.estate-badge:hover {
  opacity: 0.25;
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

.engagement {
  margin-top: 28px;
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

.tab-btn.active {
  border-bottom-color: var(--accent);
  color: var(--accent);
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

.tab-btn.active .tab-number {
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
