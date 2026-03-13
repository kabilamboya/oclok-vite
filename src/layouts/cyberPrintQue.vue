<template>
  <section>
    <h2>Print Queue</h2>

    <ul>
      <li v-for="item in queue" :key="item.id">
        {{ item.documents.title }} — {{ item.status }}
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { getPrintQueue } from "@/services/printQueue.service"
import { getLocalUserId } from "@/lib/localStore"

const queue = ref([])
const userId = getLocalUserId("cyber_guest_user_id")

onMounted(async () => {
  const { data } = await getPrintQueue(userId)
  queue.value = data || []
})
</script>
