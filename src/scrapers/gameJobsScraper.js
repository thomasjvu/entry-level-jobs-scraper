import puppeteer from "puppeteer"; // Change this to 'puppeteer' instead of 'puppeteer-core'
import { insertJob, jobExists } from "../services/jobService.js";

export default async function scrapeGameJobs() {
  console.log("Starting GameJobs scrape...");

  let browser;
  try {
    const options = process.env.RENDER
      ? {
          executablePath: "/usr/bin/chromium-browser",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        }
      : {}; // Empty object for local environment

    browser = await puppeteer.launch(options);
    console.log("Browser launched successfully");

    const page = await browser.newPage();
    console.log("New page created");

    await page.goto("https://gamejobs.co/search?e=Entry");
    console.log("Navigated to GameJobs");

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

    console.log(`Scraped ${jobs.length} jobs`);

    for (const job of jobs) {
      if (!(await jobExists(job.link))) {
        if (await insertJob(job)) {
          console.log("Job inserted:", job.title);
        }
      } else {
        console.log("Job already exists, skipping:", job.title);
      }
    }
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  }
}
