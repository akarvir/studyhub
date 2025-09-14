import { createClient } from '@supabase/supabase-js'


const SUPABASE_URL = "https://jnkqrosvfjsrvtkumazf.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impua3Fyb3N2ZmpzcnZ0a3VtYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NTAzNjMsImV4cCI6MjA3MzEyNjM2M30.613B5-FlYGl0lUCj_eHNyix9U13Jx9AkWSfkaW_UPds"
console.log("Supabase URL:", SUPABASE_URL)
console.log("Supabase Key defined:", !!SUPABASE_ANON_KEY)

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)