import { Page } from "puppeteer";
import { Retailer } from "../Retailer.js";
import {
  createRetailerScraper,
  hasNextPageAvailable,
  RawProductData,
  safeParseFloat,
} from "./index.js";
import { logger } from "@climbing-deals/shared";

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
  await page.waitForSelector(".product-item");
  const data = await page.evaluate(() => {
    const elements = document.querySelectorAll(".product-item");
    return Array.from(elements).map((element) => {
      const LINK = ".product-item-link";
      const IMAGE = "img";

      const OLD_PRICE = ".old-price [data-price-amount]";
      const SPECIAL_PRICE = ".special-price [data-price-amount]";
      const NORMAL_PRICE = ".normal-price [data-price-amount]";

      const url = element.querySelector(LINK)?.getAttribute("href");
      const scrapedName = element.querySelector(LINK)?.innerText?.trim();
      const image = element.querySelector(IMAGE)?.getAttribute("data-src");

      let originalPrice: string | undefined = undefined;
      let discountPrice: string | undefined = undefined;

      const oldPriceElement = element.querySelector(OLD_PRICE);
      const specialPriceElement = element.querySelector(SPECIAL_PRICE);
      const normalPriceElement = element.querySelector(NORMAL_PRICE);

      // If there is an old price element it means there is a discount
      // discounted price will either be a special price or the new normal price
      if (oldPriceElement) {
        originalPrice =
          oldPriceElement.getAttribute("data-price-amount") ?? undefined;

        if (specialPriceElement) {
          discountPrice =
            specialPriceElement.getAttribute("data-price-amount") ?? undefined;
        } else if (normalPriceElement) {
          discountPrice =
            normalPriceElement.getAttribute("data-price-amount") ?? undefined;
        }
      } else {
        originalPrice =
          element
            .querySelector("[data-price-amount]")
            ?.getAttribute("data-price-amount") ?? undefined;
      }

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
