import supabase from "../db/supabase.js";
import config from "../config.js";

export async function signInAsScraper() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: config.scraperEmail,
    password: config.scraperPassword,
  });

  if (error) {
    console.error("Error signing in as scraper:", error);
    return null;
  }

  console.log("Successfully signed in as scraper");
  return data.user.id; // Return the user ID
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;

  console.log("Successfully signed in as scraper");
  return true;
}
