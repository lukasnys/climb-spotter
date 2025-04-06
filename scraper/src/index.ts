import "dotenv/config";
import { OliunidScraper } from "./scrapers/oliunid.js";
import { BergfreundeScraper } from "./scrapers/bergfreunde.js";
import { logger } from "@climbing-deals/shared";
import { NineCClimbingScraper } from "./scrapers/9cclimbing.js";
import { fileURLToPath } from "url";

export async function scrapeShoeDeals() {
  logger.info("Starting scraping process...");

  const oliunidScraper = new OliunidScraper();
  const bergfreundeScraper = new BergfreundeScraper();
  const nineCClimbingScraper = new NineCClimbingScraper();

  const scrapePromises = [
    oliunidScraper.scrape(),
    bergfreundeScraper.scrape(),
    nineCClimbingScraper.scrape(),
  ];
  const results = await Promise.all(scrapePromises);

  logger.info(
    `Scraping process completed. ${results.length} retailers scraped.`
  );

  return results.filter((result) => !!result).flat();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  scrapeShoeDeals().then((results) => {
    console.log(results);
  });
}
