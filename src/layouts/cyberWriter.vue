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
import { supabase } from "@/lib/supabase"

const title = ref("")
const content = ref("")

const save = async () => {
  const user = (await supabase.auth.getUser()).data.user

  if (!user) return alert("Login required")

  await createDocument({
    title: title.value,
    content: content.value,
    user_id: user.id,
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
