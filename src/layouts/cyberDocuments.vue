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
import { getLocalUserId } from "@/lib/localStore"

const documents = ref([])
const userId = ref(getLocalUserId("cyber_guest_user_id"))

onMounted(async () => {
  const { data } = await getDocuments(userId.value)
  documents.value = data || []
})

const sendToPrint = async (documentId) => {
  await addToPrintQueue({
    document_id: documentId,
    user_id: userId.value,
  })
  alert("Added to print queue")
}

const remove = async (id) => {
  await deleteDocument(id)
  documents.value = documents.value.filter(d => d.id !== id)
}
</script>
