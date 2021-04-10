import { createClient } from "@supabase/supabase-js";
const SUPABASE_KEY = process.env.VUE_APP_SUPABASE_KEY;
const SUPABASE_URL = process.env.VUE_APP_SUPABASE_URL;
let SUPABASE_CLIENT = null;
try {
  SUPABASE_CLIENT = createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
  alert(e.message + " See config.js");
}
export default SUPABASE_CLIENT;
