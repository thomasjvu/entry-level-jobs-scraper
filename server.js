require("dotenv").config();
const express = require("express");
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = 3000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY,
);

async function scrapeJobs() {
  console.log("Starting job scrape...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://gamejobs.co/search?e=Entry");

  const jobs = await page.evaluate(() => {
    const jobElements = document.querySelectorAll(".job");
    return Array.from(jobElements).map((job) => ({
      title: job.querySelector(".title")?.textContent.trim(),
      company: job.querySelector(".c")?.textContent.trim(),
      location: job.querySelector(".w")?.textContent.trim(),
      link: job.querySelector("a")?.href,
      terms: true,
    }));
  });

  await browser.close();

  console.log(`Scraped ${jobs.length} jobs`);
  console.log("First job:", JSON.stringify(jobs[0], null, 2));

  let insertedCount = 0;
  let duplicateCount = 0;

  for (const job of jobs) {
    // Check if job already exists
    const { data: existingJob, error: checkError } = await supabase
      .from("listings")
      .select()
      .eq("title", job.title)
      .eq("company", job.company)
      .eq("location", job.location)
      .eq("link", job.link)
      .single();

    if (checkError) {
      console.error("Error checking for existing job:", checkError);
    }

    if (!existingJob) {
      const { data, error } = await supabase.from("listings").insert([job]);

      if (error) {
        console.error("Error inserting job:", error);
        console.log("Failed job data:", JSON.stringify(job, null, 2));
      } else {
        console.log("Job inserted:", job.title);
        insertedCount++;
      }
    } else {
      console.log("Job already exists, skipping:", job.title);
      duplicateCount++;
    }
  }

  console.log(
    `Scrape completed. Inserted ${insertedCount} new jobs. Found ${duplicateCount} duplicates.`,
  );
}

// Schedule the scraping task to run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running daily job scrape");
  scrapeJobs();
});

// Immediately run the first scrape when the server starts
scrapeJobs();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
