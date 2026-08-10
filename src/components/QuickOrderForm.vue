<template>
  <section class="order-card">
    <div class="order-card__header">
      <p class="eyebrow">Quick request</p>
      <h3>{{ title }}</h3>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <form class="order-form" @submit.prevent="handleSubmit">
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
import { reactive, ref } from 'vue';
import { createDeliboisOrder } from '../services/delibois.service';

const props = defineProps({
  title: { type: String, default: 'Request support' },
  subtitle: { type: String, default: 'We will follow up with you shortly.' },
  page: { type: String, default: 'website' },
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
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 18px;
  padding: 1.25rem;
  box-shadow: 0 12px 30px rgba(0,0,0,0.16);
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
  font-size: 1.1rem;
}

.order-card p {
  margin: 0;
  color: #dbeafe;
  line-height: 1.5;
}

.order-form {
  margin-top: 1rem;
  display: grid;
  gap: 0.85rem;
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
  border: none;
  border-radius: 999px;
  padding: 0.8rem 1rem;
  background: linear-gradient(135deg, #ffb36b 0%, #ff8a3d 100%);
  color: #111827;
  font-weight: 800;
  cursor: pointer;
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
