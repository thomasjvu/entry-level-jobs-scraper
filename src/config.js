import dotenv from "dotenv";
dotenv.config();

export default {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseApiKey: process.env.SUPABASE_API_KEY,
  scraperEmail: process.env.SCRAPER_EMAIL,
  scraperPassword: process.env.SCRAPER_PASSWORD,
  port: process.env.PORT || 3000,
};
