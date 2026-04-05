<template>
  <div class="pagination-controls" aria-label="Pagination">
    <button 
      @click="goToFirst" 
      :disabled="currentPage === 1"
      class="page-nav-btn"
      title="First page"
    >
      <i class="fas fa-step-backward"></i>
    </button>

    <button 
      @click="previousPage" 
      :disabled="currentPage === 1"
      class="page-nav-btn"
      title="Previous page"
    >
      <i class="fas fa-chevron-left"></i>
    </button>

    <div class="page-indicators">
      <button
        v-for="page in visiblePages"
        :key="page"
        :class="['page-btn', { active: page === currentPage }]"
        @click="goToPage(page)"
        :title="`Go to page ${page}`"
      >
        {{ page }}
      </button>
    </div>

    <button 
      @click="nextPage" 
      :disabled="currentPage === totalPages"
      class="page-nav-btn"
      title="Next page"
    >
      <i class="fas fa-chevron-right"></i>
    </button>

    <button 
      @click="goToLast" 
      :disabled="currentPage === totalPages"
      class="page-nav-btn"
      title="Last page"
    >
      <i class="fas fa-step-forward"></i>
    </button>

    <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1
  },
  delta: {
    type: Number,
    default: 2
  }
});

const emit = defineEmits(['update:currentPage']);

const visiblePages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  const start = Math.max(1, current - props.delta);
  const end = Math.min(total, current + props.delta);
  const pages = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
});

const goToPage = (page) => {
  if (page !== props.currentPage) {
    emit('update:currentPage', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const previousPage = () => {
  if (props.currentPage > 1) {
    goToPage(props.currentPage - 1);
  }
};

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    goToPage(props.currentPage + 1);
  }
};

const goToFirst = () => {
  if (props.currentPage !== 1) {
    goToPage(1);
  }
};

const goToLast = () => {
  if (props.currentPage !== props.totalPages) {
    goToPage(props.totalPages);
  }
};
</script>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  padding: 1rem;
}

.page-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #7c3aed;
  color: #7c3aed;
  background: transparent;
  border-radius: 8px;
  padding: 0.55rem 0.9rem;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s ease;
  white-space: nowrap;
  height: 2.5rem;
}

.page-nav-btn:hover:not(:disabled) {
  background: #7c3aed;
  color: #ffffff;
  transform: translateY(-2px);
}

.page-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-nav-btn i {
  font-size: 0.95rem;
}

.page-indicators {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}

.page-btn {
  min-width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  background: transparent;
  border-radius: 8px;
  padding: 0;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(.active) {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}

.page-btn.active {
  background: #7c3aed;
  color: #ffffff;
  border-color: #7c3aed;
}

.page-info {
  color: #9ca3af;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  margin-left: 0.5rem;
}

@media (max-width: 768px) {
  .pagination-controls {
    gap: 0.3rem;
    padding: 0.8rem;
  }

  .page-info {
    display: none;
  }

  .page-btn {
    min-width: 2rem;
    height: 2rem;
    font-size: 0.85rem;
  }
}
</style>
