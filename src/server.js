import express from "express";
import cron from "node-cron";
import config from "./config.js";
import { signInAsScraper } from "./utils/auth.js";
import scrapeGameJobs from "./scrapers/gameJobsScraper.js";

const app = express();

async function runAllScrapers() {
  const scraperId = await signInAsScraper();
  if (scraperId) {
    await scrapeGameJobs();
    // Add other scrapers here
  } else {
    console.error("Failed to sign in as scraper. Aborting job scrape.");
  }
}

// Schedule the scraping task to run every day at midnight
cron.schedule("0 0 * * *", runAllScrapers);

// Immediately run the first scrape when the server starts
runAllScrapers();

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});
