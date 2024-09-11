import { createClient } from "@supabase/supabase-js";
import config from "../config.js";

const supabase = createClient(config.supabaseUrl, config.supabaseApiKey);

export default supabase;
