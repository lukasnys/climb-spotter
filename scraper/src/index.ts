import "dotenv/config";
import { OliunidScraper } from "./scrapers/oliunid.js";
import { BergfreundeScraper } from "./scrapers/bergfreunde.js";
import { logger } from "@climbing-deals/shared";
import { NineCClimbingScraper } from "./scrapers/9cclimbing.js";

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
