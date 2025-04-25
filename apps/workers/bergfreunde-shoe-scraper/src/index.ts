import { BergfreundeScraper } from '@climb-spotter/scraper';
import { createD1Client } from '@climb-spotter/d1';
import { shoes as shoeSchema } from '@climb-spotter/d1';

export interface Env {
	MYBROWSER: Fetcher;
	DB: D1Database;
}

export default {
	async scheduled(event, env, ctx): Promise<void> {
		const shoes = await new BergfreundeScraper(env).scrape();

		if (!shoes) {
			console.log('No shoes found');
			return;
		}
		const db = await createD1Client(env.DB);
		const promises = shoes.map((shoe) => {
			return db.insert(shoeSchema).values({
				scrapedName: shoe.scrapedName,
			});
		});
		await Promise.all(promises);

		console.log('Scraped shoes:', shoes);
	},
} satisfies ExportedHandler<Env>;
