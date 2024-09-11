import puppeteer from "puppeteer";
import { insertJob, jobExists } from "../services/jobService.js";

export default async function scrapeGameJobs() {
  console.log("Starting GameJobs scrape...");
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
      rate: "annual",
      setting: "N/A",
      contract: "N/A",
      level: "entry",
      min_wage: 1,
      max_wage: 1,
      terms: true,
    }));
  });

  await browser.close();

  console.log(`Scraped ${jobs.length} jobs from GameJobs`);

  let insertedCount = 0;
  let duplicateCount = 0;

  for (const job of jobs) {
    if (!(await jobExists(job.link))) {
      if (await insertJob(job)) {
        console.log("Job inserted:", job.title);
        insertedCount++;
      }
    } else {
      console.log("Job already exists, skipping:", job.title);
      duplicateCount++;
    }
  }

  console.log(
    `GameJobs scrape completed. Inserted ${insertedCount} new jobs. Found ${duplicateCount} duplicates.`,
  );
}
