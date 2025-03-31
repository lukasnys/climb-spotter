import { Page } from "puppeteer";
import { Retailer } from "../retailer.js";
import {
  createRetailerScraper,
  hasNextPageAvailable,
  RawProductData,
  safeParseFloat,
} from "./index.js";
import { logger } from "../utils/logger.js";

const BASE_URL = "https://www.bergfreunde.eu/climbing-shoes";

export async function scrapeBergfreunde(): Promise<Retailer> {
  const scraper = createRetailerScraper(
    "Bergfreunde",
    "EUR",
    "https://www.bergfreunde.eu/"
  );

  return scraper.scrape(scrapeAllPages);
}

async function scrapeAllPages(page: Page) {
  const allProductData: RawProductData[] = [];

  let currentPage = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const url = `${BASE_URL}/${currentPage}`;
    await page.goto(url, { waitUntil: "networkidle2" });
    logger.info(`Scraping page ${currentPage} with url: ${url}`);

    const pageProductData = await scrapeProductsFromPage(page);
    allProductData.push(...pageProductData);

    hasNextPage = await hasNextPageAvailable(page, "a[title='next']");
    currentPage++;
  }

  return allProductData;
}

async function scrapeProductsFromPage(page: Page): Promise<RawProductData[]> {
  const data = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll(".product-item"));

    return Array.from(elements)
      .filter(
        (element) => !!element.querySelector("[data-codecept='strokePrice']")
      )
      .map((element) => {
        const LINK = "a.product-link";
        const BRAND = ".manufacturer-title";
        const PRODUCT = ".product-title";
        const IMAGE = "img.product-image";
        const ORIGINAL_PRICE = "[data-codecept='strokePrice']";
        const DISCOUNT_PRICE = "[data-codecept='currentPrice']";

        const url = element.querySelector(LINK)?.getAttribute("href");

        const brand = element.querySelector(BRAND)?.innerText;
        const product = element
          .querySelector(PRODUCT)
          ?.innerText?.replaceAll("\n", " ");

        const scrapedName = `${brand} ${product}`;

        const image = element.querySelector(IMAGE)?.getAttribute("src");

        const originalPrice = element.querySelector(ORIGINAL_PRICE)?.innerText;
        const discountPrice = element.querySelector(DISCOUNT_PRICE)?.innerText;

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
