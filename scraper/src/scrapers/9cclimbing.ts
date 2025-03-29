import puppeteer, { Page } from "puppeteer";
import { Retailer } from "../retailer.js";
import {
  convertDataToProducts,
  hasNextPageAvailable,
  RawProductData,
} from "./index.js";
import { logger } from "../utils/logger.js";

const BASE_URL = "https://9cclimbing.be/en/collections/climbing-shoes";

export async function scrape9cClimbing() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
  });

  try {
    const page = await browser.newPage();
    const allProductData = await scrapeAllPages(page);
    const products = convertDataToProducts(allProductData);

    return new Retailer(
      "9c Climbing",
      "EUR",
      "https://9cclimbing.be/",
      products
    );
  } finally {
    await browser.close();
  }
}

async function scrapeAllPages(page: Page) {
  const allProductData: RawProductData[] = [];

  let currentPage = 1;
  let hasNextPage = true;
  while (hasNextPage) {
    const url = `${BASE_URL}?page=${currentPage}`;
    await page.goto(url, { waitUntil: "networkidle2" });
    logger.info(`Scraping page ${currentPage} with url: ${url}`);

    const pageProductData = await scrapeProductsFromPage(page);
    allProductData.push(...pageProductData);

    hasNextPage = await hasNextPageAvailable(
      page,
      ".pagination li:nth-last-child(1):not(:has(button[disabled]))"
    );
    currentPage++;
  }

  return allProductData;
}

async function scrapeProductsFromPage(page: Page): Promise<RawProductData[]> {
  return await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll(".grid__item"));

    return elements
      .filter((element) => !!element.querySelector(".price--on-sale"))
      .map((element) => {
        const urlPostfix = element.querySelector("a")?.getAttribute("href");
        const url = `https://9cclimbing.be${urlPostfix}`;
        const scrapedBrand =
          element.querySelector(".price__vendor dd")?.innerText;
        const name = element.querySelector(".product-card__title")?.innerText;

        const scrapedName = `${scrapedBrand} ${name}`;

        const image = element.querySelector("img")?.getAttribute("src");

        const getPrice = (element: Element | null) => {
          const full = element?.innerText?.replace(/[^0-9,]/g, "");
          const sup = element?.querySelector("sup")?.innerText;

          if (full && sup) {
            return full.slice(0, full.lastIndexOf(sup)) + "," + sup;
          } else if (full) {
            return full;
          } else {
            return undefined;
          }
        };

        const originalPriceEl = element.querySelector(
          ".price__sale .price-item--regular"
        );
        const discountPriceEl = element.querySelector(
          ".price__sale .price-item--sale"
        );

        const originalPriceString = getPrice(originalPriceEl);
        const discountPriceString = getPrice(discountPriceEl);

        const originalPrice = originalPriceString
          ? parseFloat(originalPriceString.replace(",", "."))
          : undefined;
        const discountPrice = discountPriceString
          ? parseFloat(discountPriceString.replace(",", "."))
          : undefined;

        return {
          url,
          scrapedName,
          image,
          originalPrice,
          discountPrice,
        };
      });
  });
}
