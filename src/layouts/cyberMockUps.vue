<template>
  <section>
    <h2>Mockups</h2>

    <input type="file" @change="upload" />

    <ul>
      <li v-for="m in mockups" :key="m.id">
        <img :src="m.file_url" width="120" />
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { supabase } from "@/lib/supabase"

const mockups = ref([])

const upload = async (e) => {
  const file = e.target.files[0]
  const user = (await supabase.auth.getUser()).data.user

  const path = `${user.id}/${Date.now()}-${file.name}`

  await supabase.storage.from("mockups").upload(path, file)

  const url = supabase.storage.from("mockups").getPublicUrl(path).data.publicUrl

  await supabase.from("mockups").insert({
    file_url: url,
    user_id: user.id,
  })

  load()
}

const load = async () => {
  const user = (await supabase.auth.getUser()).data.user
  const { data } = await supabase
    .from("mockups")
    .select("*")
    .eq("user_id", user.id)

  mockups.value = data
}

onMounted(load)
</script>
