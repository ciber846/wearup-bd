// Supabase public browser configuration.
// IMPORTANT: use the project's ANON/PUBLISHABLE key only.
// NEVER put the Supabase service_role/secret key in this file.

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
