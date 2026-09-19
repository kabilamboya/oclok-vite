<template>
  <section class="order-card">
    <div class="order-card__header">
      <p class="eyebrow">Quick request</p>
      <h3>{{ title }}</h3>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <div class="request-list" aria-label="Available delivery and discovery items">
      <button
        v-for="item in requestOptions"
        :key="item.title"
        type="button"
        class="request-option"
        @click="goToDiscover(item)"
      >
        <span class="request-icon">{{ item.icon }}</span>
        <span class="request-copy">
          <strong>{{ item.title }}</strong>
          <small>{{ item.caption }}</small>
        </span>
      </button>
    </div>

    <div class="card-actions">
      <router-link class="primary-action" to="/discover">Explore delivery & discovery</router-link>
      <button class="secondary-action" type="button" @click="showCustomRequest = !showCustomRequest">
        {{ showCustomRequest ? "Hide custom request" : "Custom request" }}
      </button>
    </div>

    <form v-if="showCustomRequest" class="order-form" @submit.prevent="handleSubmit">
      <div class="form-grid">
        <label>
          <span>Name</span>
          <input v-model="form.customerName" type="text" required placeholder="Your name" />
        </label>
        <label>
          <span>Phone</span>
          <input v-model="form.phone" type="tel" required placeholder="+254..." />
        </label>
      </div>

      <div class="form-grid">
        <label>
          <span>Email</span>
          <input v-model="form.email" type="email" placeholder="name@email.com" />
        </label>
        <label>
          <span>Request type</span>
          <select v-model="form.requestType">
            <option value="Product inquiry">Product inquiry</option>
            <option value="Service request">Service request</option>
            <option value="Delivery request">Delivery request</option>
            <option value="Media support">Media support</option>
            <option value="Cyber support">Cyber support</option>
          </select>
        </label>
      </div>

      <label>
        <span>Details</span>
        <textarea v-model="form.notes" rows="4" placeholder="Tell us what you need and we will follow up."></textarea>
      </label>

      <button class="submit-btn" type="submit" :disabled="submitting">
        {{ submitting ? "Submitting..." : "Send request" }}
      </button>
      <p v-if="feedback" class="feedback" :class="feedbackType">{{ feedback }}</p>
    </form>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createDeliboisOrder } from '../services/delibois.service';

const props = defineProps({
  title: { type: String, default: 'Request support' },
  subtitle: { type: String, default: 'We will follow up with you shortly.' },
  page: { type: String, default: 'website' },
});

const router = useRouter();
const showCustomRequest = ref(false);

const requestOptions = computed(() => {
  const defaults = [
    { icon: '🚚', title: 'Same-day delivery', caption: 'Parcel pickup, returns and doorstep delivery.' },
    { icon: '🛍️', title: 'Shopping assistance', caption: 'Grocery and household help for convenient orders.' },
    { icon: '📦', title: 'Item support', caption: 'Delivery coordination for products and errands.' },
  ];

  if (props.page === 'media') {
    return [
      { icon: '🎬', title: 'Media delivery', caption: 'Downloads, creative files and support for content.' },
      { icon: '📹', title: 'Studio help', caption: 'Video and design requests with guided support.' },
      { icon: '🧩', title: 'Content setup', caption: 'Smooth file preparation and technical setup.' },
    ];
  }

  if (props.page === 'cyber') {
    return [
      { icon: '⚙️', title: 'Cyber support', caption: 'Pickup, device support and technical troubleshooting.' },
      { icon: '📦', title: 'Delivery handoff', caption: 'Local delivery coordination and order tracking.' },
      { icon: '🧪', title: 'Task follow-up', caption: 'Support for technical or operational requests.' },
    ];
  }

  return defaults;
});

const form = reactive({
  customerName: '',
  phone: '',
  email: '',
  requestType: 'Service request',
  notes: '',
});
const submitting = ref(false);
const feedback = ref('');
const feedbackType = ref('');

const goToDiscover = (item) => {
  const target = item?.title?.toLowerCase().includes('delivery') ? '/discover' : '/discover';
  router.push(target);
};

const handleSubmit = async () => {
  if (!form.customerName || !form.phone) {
    feedback.value = 'Please add your name and phone number.';
    feedbackType.value = 'error';
    return;
  }

  submitting.value = true;
  feedback.value = '';

  try {
    await createDeliboisOrder({
      customerName: form.customerName,
      phone: form.phone,
      email: form.email,
      orderType: form.requestType,
      notes: form.notes,
      sourcePage: props.page,
      accountType: 'novice customer',
      estate: 'CBD',
      pickup: 'Requested from website',
      dropoff: 'Requested from website',
      preferredTime: '',
      recipientName: form.customerName,
      recipientPhone: form.phone,
    });

    feedback.value = 'Request received. We will follow up with you soon.';
    feedbackType.value = 'success';
    form.customerName = '';
    form.phone = '';
    form.email = '';
    form.requestType = 'Service request';
    form.notes = '';
  } catch (error) {
    feedback.value = error?.message || 'The request could not be sent right now.';
    feedbackType.value = 'error';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.order-card {
  background: linear-gradient(180deg, rgba(17, 24, 39, 0.9), rgba(15, 23, 42, 0.75));
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 22px;
  padding: 1.4rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
  margin-top: 20px;
}

.eyebrow {
  margin: 0 0 0.35rem;
  color: #ffb36b;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.order-card h3 {
  margin: 0 0 0.35rem;
  color: #fff;
  font-size: 1.25rem;
}

.order-card p {
  margin: 0;
  color: #dbeafe;
  line-height: 1.5;
}

.request-list {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
}

.request-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.8rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.request-option:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 179, 107, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.request-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255, 179, 107, 0.12);
  font-size: 1.4rem;
}

.request-copy {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.request-copy strong {
  font-size: 0.98rem;
}

.request-copy small {
  color: #d1d9f0;
  font-size: 0.76rem;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.1rem;
}

.primary-action,
.secondary-action,
.submit-btn {
  border: none;
  border-radius: 999px;
  padding: 0.8rem 1rem;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition: filter 0.18s ease;
}

.primary-action {
  background: linear-gradient(135deg, #ffb36b 0%, #ff8a3d 100%);
  color: #111827;
}

.secondary-action {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.primary-action:hover,
.secondary-action:hover,
.submit-btn:hover {
  filter: brightness(1.05);
}

.order-form {
  margin-top: 1rem;
  display: grid;
  gap: 0.85rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

label {
  display: grid;
  gap: 0.35rem;
  color: #f8fafc;
  font-size: 0.92rem;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 12px;
  padding: 0.7rem 0.8rem;
  background: rgba(15,23,42,0.45);
  color: #fff;
}

textarea {
  resize: vertical;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #ffb36b 0%, #ff8a3d 100%);
  color: #111827;
}

.feedback {
  margin-top: 0.25rem;
  font-weight: 700;
}

.feedback.success {
  color: #bbf7d0;
}

.feedback.error {
  color: #fecaca;
}

@media (max-width: 700px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
