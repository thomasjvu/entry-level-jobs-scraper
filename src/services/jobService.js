import supabase from "../db/supabase.js";
import { getCurrentUser } from "../utils/auth.js";

export async function insertJob(job) {
  const user = await getCurrentUser();
  if (!user) {
    console.error("No authenticated user found");
    return false;
  }

  const jobWithCompanyId = {
    ...job,
    company_id: user.id, // Set the company_id to the user's ID
  };

  const { data, error } = await supabase
    .from("listings")
    .insert([jobWithCompanyId]);
  if (error) {
    console.error("Error inserting job:", error);
    return false;
  }
  return true;
}

export async function jobExists(link) {
  const { data, error } = await supabase
    .from("listings")
    .select()
    .eq("link", link)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error checking for existing job:", error);
  }

  return !!data;
}
