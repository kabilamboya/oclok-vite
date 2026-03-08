import { supabase } from "./lib/supabase"

export const addToPrintQueue = (payload) =>
  supabase.from("print_queue").insert(payload)

export const getPrintQueue = (userId) =>
  supabase
    .from("print_queue")
    .select("*, documents(title)")
    .eq("user_id", userId)
