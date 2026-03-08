import { supabase } from "./lib/supabase"

export const createDocument = async (payload) => {
  return supabase.from("documents").insert(payload)
}

export const getDocuments = async (userId) => {
  return supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
}

export const updateDocument = async (id, updates) => {
  return supabase
    .from("documents")
    .update(updates)
    .eq("id", id)
}

export const deleteDocument = async (id) => {
  return supabase
    .from("documents")
    .delete()
    .eq("id", id)
}
