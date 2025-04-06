import type { VercelRequest, VercelResponse } from "@vercel/node";

import { scrapeShoeDeals } from "@climbing-deals/scraper";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const shoes = await scrapeShoeDeals();
  response.status(200).json(shoes);
}
