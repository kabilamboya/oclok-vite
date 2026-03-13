<template>
  <section>
    <h2>Mockups</h2>

    <input type="file" @change="upload" />

    <ul>
      <li v-for="m in mockups" :key="m.id">
        <img :src="m.url" width="120" />
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { createCyberMockup, listCyberMockups } from "@/services/cyber.service"
import { getLocalUserId } from "@/lib/localStore"

const mockups = ref([])
const userId = getLocalUserId("cyber_guest_user_id")

const readFileAsDataUrl = (fileInput) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error("Unable to read selected image file."))
    reader.readAsDataURL(fileInput)
  })

const upload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  const url = await readFileAsDataUrl(file)
  await createCyberMockup({
    userId,
    name: file.name.replace(/\.[^/.]+$/, ""),
    url,
    status: "draft",
  })

  await load()
}

const load = async () => {
  mockups.value = await listCyberMockups({ userId })
}

onMounted(load)
</script>
