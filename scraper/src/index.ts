import { OliunidScraper } from "./scrapers/oliunid.js";
import { BergfreundeScraper } from "./scrapers/bergfreunde.js";
import { logger } from "@climb-spotter/shared";
import { NineCClimbingScraper } from "./scrapers/9cclimbing.js";
import { BrowserWorker } from "@cloudflare/puppeteer";

export { BergfreundeScraper } from "./scrapers/bergfreunde.js";
export { NineCClimbingScraper } from "./scrapers/9cclimbing.js";
export { OliunidScraper } from "./scrapers/oliunid.js";

export interface Env {
	MYBROWSER: BrowserWorker;
}

export async function scrapeShoeDeals(env?: Env) {
	logger.info("Starting scraping process...");

	const oliunidScraper = new OliunidScraper(env);
	const bergfreundeScraper = new BergfreundeScraper(env);
	const nineCClimbingScraper = new NineCClimbingScraper(env);

	const scrapePromises = [
		oliunidScraper.scrape(),
		bergfreundeScraper.scrape(),
		nineCClimbingScraper.scrape(),
	];
	const results = await Promise.all(scrapePromises);

	logger.info(
		`Scraping process completed. ${results.length} retailers scraped.`,
	);

	return results.filter((result) => !!result).flat();
}
