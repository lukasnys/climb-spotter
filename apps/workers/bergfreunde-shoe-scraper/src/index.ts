import { BergfreundeScraper } from '@climb-spotter/scraper';

export interface Env {
	MYBROWSER: Fetcher;
}

export default {
	async fetch(req, env) {
		const shoes = await new BergfreundeScraper(env).scrape();
		return Response.json(shoes);
	},

	async scheduled(event, env, ctx): Promise<void> {
		const shoes = await new BergfreundeScraper(env).scrape();
		console.log('Scraped shoes:', shoes);
	},
} satisfies ExportedHandler<Env>;
