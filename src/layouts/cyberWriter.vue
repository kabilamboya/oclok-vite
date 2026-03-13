<template>
  <section>
    <h2>Document Writer</h2>

    <input
      v-model="title"
      placeholder="Document title"
      class="input"
    />

    <textarea
      v-model="content"
      placeholder="Start writing..."
      class="editor"
    ></textarea>

    <button class="btn primary" @click="save">
      Save Document
    </button>
  </section>
</template>

<script setup>
import { ref } from "vue"
import { createDocument } from "@/services/documents.service"
import { getLocalUserId } from "@/lib/localStore"

const title = ref("")
const content = ref("")
const userId = ref(getLocalUserId("cyber_guest_user_id"))

const save = async () => {
  await createDocument({
    title: title.value,
    content: content.value,
    user_id: userId.value,
  })

  title.value = ""
  content.value = ""
  alert("Saved")
}
</script>

<style scoped>
.editor {
  min-height: 300px;
  width: 100%;
}
.input {
  width: 100%;
  margin-bottom: 1rem;
}
</style>
