import { Page } from "puppeteer";
import { Retailer } from "../Retailer.js";
import {
  createRetailerScraper,
  hasNextPageAvailable,
  RawProductData,
  safeParseFloat,
} from "./index.js";
import { logger } from "../utils/logger.js";

const BASE_URL = "https://www.oliunid.com/eu/footwear/climbing-shoes";

export async function scrapeOliunid(): Promise<Retailer> {
  const scraper = createRetailerScraper(
    "Oliunid",
    "EUR",
    "https://www.oliunid.com/"
  );

  return scraper.scrape(scrapeAllPages);
}

async function scrapeAllPages(page: Page) {
  const allProductData: RawProductData[] = [];

  let currentPage = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const url = `${BASE_URL}?p=${currentPage}`;
    await page.goto(url, { waitUntil: "networkidle2" });
    logger.info(`Scraping page ${currentPage} with url: ${url}`);

    const pageProductData = await scrapeProductsFromPage(page);
    allProductData.push(...pageProductData);

    hasNextPage = await hasNextPageAvailable(page, ".action.next");
    currentPage++;
  }

  return allProductData;
}

async function scrapeProductsFromPage(page: Page): Promise<RawProductData[]> {
  const data = await page.evaluate(() => {
    const elements = document.querySelectorAll(".product-item");
    return Array.from(elements)
      .filter((element) => !!element.querySelector(".original-price-wrapper"))
      .map((element) => {
        const LINK = ".product-item-link";
        const IMAGE = "img";
        const ORIGINAL_PRICE = ".original-price-wrapper [data-price-amount]";
        const DISCOUNT_PRICE = ".normal-price [data-price-amount]";

        const url = element.querySelector(LINK)?.getAttribute("href");
        const scrapedName = element.querySelector(LINK)?.innerText?.trim();
        const image = element.querySelector(IMAGE)?.getAttribute("data-src");

        const originalPrice = element
          .querySelector(ORIGINAL_PRICE)
          ?.getAttribute("data-price-amount");
        const discountPrice = element
          .querySelector(DISCOUNT_PRICE)
          ?.getAttribute("data-price-amount");

        return {
          url,
          scrapedName,
          image,
          originalPrice,
          discountPrice,
        };
      });
  });

  return data.map((item) => ({
    ...item,
    originalPrice: safeParseFloat(item.originalPrice),
    discountPrice: safeParseFloat(item.discountPrice),
  }));
}
