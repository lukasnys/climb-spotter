import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "redis";

import { scrapeShoeDeals } from "@climbing-deals/scraper";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const redis = await createClient({ url: process.env.REDIS_URL }).connect();
  const shoes = await scrapeShoeDeals();

  await redis.set("shoes", JSON.stringify(shoes), {
    EX: 60 * 60 * 24, // 1 day
  });

  response.status(200).json(shoes);
}
