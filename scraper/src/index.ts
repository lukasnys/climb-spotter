import { OliunidScraper } from './scrapers/oliunid.js';
import { BergfreundeScraper } from './scrapers/bergfreunde.js';
import { logger } from '@climb-spotter/shared';
import { NineCClimbingScraper } from './scrapers/9cclimbing.js';

export async function scrapeShoeDeals(env?: Env) {
	logger.info('Starting scraping process...');

	const oliunidScraper = new OliunidScraper(env);
	const bergfreundeScraper = new BergfreundeScraper(env);
	const nineCClimbingScraper = new NineCClimbingScraper(env);

	const scrapePromises = [oliunidScraper.scrape(), bergfreundeScraper.scrape(), nineCClimbingScraper.scrape()];
	const results = await Promise.all(scrapePromises);

	logger.info(`Scraping process completed. ${results.length} retailers scraped.`);

	return results.filter((result) => !!result).flat();
}

export interface Env {
	MYBROWSER: Fetcher;
}

/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"` to see your Worker in action
 * - Run `npm run deploy` to publish your Worker
 *
 * Bind resources to your Worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(req, env) {
		const shoes = await scrapeShoeDeals(env);
		console.log('Scraped shoes:', shoes);
		return Response.json(shoes);
	},

	// The scheduled handler is invoked at the interval set in our wrangler.jsonc's
	// [[triggers]] configuration.
	async scheduled(event, env): Promise<void> {
		const shoes = await scrapeShoeDeals(env);

		console.log('Scraped shoes:', shoes);
	},
} satisfies ExportedHandler<Env>;
