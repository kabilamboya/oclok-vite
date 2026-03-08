<template>
  <section>
    <h2>My Documents</h2>

    <ul>
      <li v-for="doc in documents" :key="doc.id">
        <strong>{{ doc.title }}</strong>

        <button @click="sendToPrint(doc.id)">
          🖨 Print
        </button>

        <button @click="remove(doc.id)">
          ❌ Delete
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue"
import {
  getDocuments,
  deleteDocument,
} from "@/services/documents.service"
import { addToPrintQueue } from "@/services/printQueue.service"
import { supabase } from "@/lib/supabase"

const documents = ref([])

onMounted(async () => {
  const user = (await supabase.auth.getUser()).data.user
  const { data } = await getDocuments(user.id)
  documents.value = data
})

const sendToPrint = async (documentId) => {
  const user = (await supabase.auth.getUser()).data.user
  await addToPrintQueue({
    document_id: documentId,
    user_id: user.id,
  })
  alert("Added to print queue")
}

const remove = async (id) => {
  await deleteDocument(id)
  documents.value = documents.value.filter(d => d.id !== id)
}
</script>
