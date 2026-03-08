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
import { getPrintQueue } from "./services/printQueue.service"
import { supabase } from "./lib/supabase"

const queue = ref([])

onMounted(async () => {
  const user = (await supabase.auth.getUser()).data.user
  const { data } = await getPrintQueue(user.id)
  queue.value = data
})
</script>
