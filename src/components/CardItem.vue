<template>
  <div
    class="card"
    :class="[{ clickable }, `card-${type}`]"
    :style="accentStyle"
    @click="handleSelect"
  >
    <img
      v-if="image"
      :src="image"
      :alt="title"
      :class="['card-img', { 'card-img--round': isTechnician }]"
    />

    <div class="card-body">
      <h3 class="card-title">{{ title }}</h3>
      <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      <p v-if="priceLabel" class="card-price">{{ priceLabel }}</p>
      <p v-if="meta" class="card-meta">📍 {{ meta }}</p>

      <div v-if="showRating && rating > 0" class="card-rating" :aria-label="`Rating ${ratingLabel}`">
        <span
          v-for="(fill, index) in ratingStars"
          :key="index"
          class="star"
          :style="{ '--fill': `${fill}%` }"
        >
          ★
        </span>
      </div>

      <p v-if="description" class="card-description">
        {{ description.length > 120 ? description.slice(0, 120) + '...' : description }}
      </p>

      <div v-if="showExperience && experience" class="card-experience">
        <strong>{{ experience }}</strong> years experience
      </div>

      <div v-if="showProjects && hasProjects" class="card-projects">
        <details>
          <summary>Projects</summary>
          <ul>
            <li v-for="(list, key) in item.projects" :key="key">
              <strong>{{ key }}:</strong>
              <ul>
                <li v-for="p in list" :key="p">{{ p }}</li>
              </ul>
            </li>
          </ul>
        </details>
      </div>
    </div>

    <div v-if="showActions" class="card-footer">
      <button v-if="primaryText" class="primary-btn" @click.stop="emitPrimary">{{ primaryText }}</button>
      <a
        v-if="resolvedSecondaryHref && secondaryText"
        :href="resolvedSecondaryHref"
        class="secondary-btn"
        @click.stop
      >
        {{ secondaryText }}
      </a>
      <button
        v-else-if="secondaryText"
        class="secondary-btn"
        @click.stop="emitSecondary"
      >
        {{ secondaryText }}
      </button>
    </div>
  </div>
</template>

<script>
const defaultRatings = {
  app: 0,
  skills: 0,
  customer: 0,
};

export default {
  name: "CardItem",
  emits: ["primary", "secondary", "select"],
  props: {
    item: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      default: "generic",
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    showProjects: {
      type: Boolean,
      default: false,
    },
    showExperience: {
      type: Boolean,
      default: true,
    },
    showRating: {
      type: Boolean,
      default: true,
    },
    primaryLabel: {
      type: String,
      default: "",
    },
    secondaryLabel: {
      type: String,
      default: "",
    },
    secondaryHref: {
      type: String,
      default: "",
    },
  },
  computed: {
    title() {
      return this.item.title || this.item.name || "Untitled";
    },
    subtitle() {
      return (
        this.item.specialty ||
        this.item.category ||
        this.item.role ||
        this.item.type ||
        ""
      );
    },
    isProduct() {
      return this.type === "product";
    },
    isTechnician() {
      return this.type === "technician";
    },
    priceLabel() {
      if (!this.isProduct) return "";
      const price = Number(this.item.price);
      return Number.isFinite(price) ? `Ksh ${price.toLocaleString()}` : "";
    },
    meta() {
      if (this.isProduct) return "";
      return this.item.location || "";
    },
    description() {
      return this.item.bio || this.item.description || this.item.summary || "";
    },
    experience() {
      return this.item.experience || null;
    },
    image() {
      return this.item.image || this.item.thumbnail || this.item.photo || "";
    },
    rating() {
      if (this.type !== "technician") return 0;
      const directRating = Number(this.item?.rating);
      if (Number.isFinite(directRating)) {
        return this.normalizeRating(directRating);
      }
      const ratings = this.item?.ratings || defaultRatings;
      const values = Object.values(ratings)
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));
      if (!values.length) return 0;
      return this.normalizeRating(values.reduce((sum, value) => sum + value, 0) / values.length);
    },
    ratingLabel() {
      if (!Number.isFinite(this.rating) || this.rating <= 0) return "";
      return Number.isInteger(this.rating) ? this.rating.toString() : this.rating.toFixed(1);
    },
    ratingStars() {
      const value = Number(this.rating) || 0;
      return Array.from({ length: 5 }, (_, index) => {
        const diff = value - index;
        if (diff >= 1) return 100;
        if (diff <= 0) return 0;
        return Math.round(diff * 100);
      });
    },
    hasProjects() {
      return this.item.projects && Object.keys(this.item.projects).length > 0;
    },
    primaryText() {
      if (this.primaryLabel) return this.primaryLabel;
      if (this.type === "technician") return "Book";
      return "";
    },
    secondaryText() {
      if (this.secondaryLabel) return this.secondaryLabel;
      if (this.type === "technician" && this.item.contact?.email) return "Email";
      return "";
    },
    resolvedSecondaryHref() {
      if (this.secondaryHref) return this.secondaryHref;
      if (this.type === "technician" && this.item.contact?.email) {
        return `mailto:${this.item.contact.email}`;
      }
      return "";
    },
    showActions() {
      return Boolean(this.primaryText || this.secondaryText);
    },
    accentStyle() {
      return this.item.color
        ? { borderTop: `5px solid ${this.item.color}` }
        : undefined;
    },
  },
  methods: {
    normalizeRating(value) {
      if (!Number.isFinite(value)) return 0;
      const bounded = Math.min(5, Math.max(3, value));
      const rounded = Math.round(bounded * 2) / 2;
      return rounded <= 0 ? 0 : rounded;
    },
    emitPrimary() {
      this.$emit("primary", this.item);
    },
    emitSecondary() {
      this.$emit("secondary", this.item);
    },
    handleSelect() {
      if (!this.clickable) return;
      this.$emit("select", this.item);
    },
  },
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #111827 !important;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
.card.clickable {
  cursor: pointer;
}

.card-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}
.card-img--round {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin: 16px auto 0;
  border: 3px solid #f3f4f6;
}

.card-body {
  padding: 1rem;
  flex-grow: 1;
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
  color: #111827 !important;
}

.card-subtitle {
  color: #4b5563 !important;
  font-weight: bold;
}

.card-meta {
  font-size: 0.9rem;
  color: #6b7280 !important;
  margin-bottom: 0.5rem;
}

.card-price {
  font-size: 1rem;
  font-weight: 700;
  color: #111827 !important;
  margin: 0.2rem 0 0.5rem;
}

.card-rating {
  margin: 0.4rem 0 0.5rem;
}
.star {
  position: relative;
  display: inline-block;
  color: #cbd5e1;
  font-size: 3.6rem;
  line-height: 1;
}
.card-technician .star {
  font-size: 2.2rem;
}
.star::after {
  content: "★";
  position: absolute;
  left: 0;
  top: 0;
  width: var(--fill, 0%);
  overflow: hidden;
  color: #ffb400;
}
  .card-rating small {
    color: #6b7280 !important;
  }

.card-description {
  font-size: 0.9rem;
  color: #4b5563 !important;
  margin-bottom: 0.5rem;
}

.card-experience {
  font-size: 0.9rem;
  color: #1f2937 !important;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-projects details {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 0.85rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem;
  border-top: 1px solid #eee;
  background: #fafafa;
}

.primary-btn,
.secondary-btn {
  flex: 1;
  text-align: center;
  margin: 0 0.25rem;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.primary-btn {
  background: #007bff;
  color: #fff;
}
.primary-btn:hover {
  background: #0056b3;
}

.secondary-btn {
  background: #28a745;
  color: #fff;
  text-decoration: none;
}
.secondary-btn:hover {
  background: #1e7e34;
}

@media (max-width: 600px) {
  .card-footer {
    flex-direction: column;
    gap: 0.5rem;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
    margin: 0;
  }

  .star {
    font-size: 2.4rem;
  }

  .card-technician .star {
    font-size: 1.8rem;
  }
}
</style>
