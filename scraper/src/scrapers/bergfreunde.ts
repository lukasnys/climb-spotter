import puppeteer, { Page } from "puppeteer";
import { Retailer } from "../retailer.js";
import {
  convertDataToProducts,
  hasNextPageAvailable,
  RawProductData,
} from "./index.js";

const BASE_URL = "https://www.bergfreunde.eu/climbing-shoes/";

export async function scrapeBergfreunde(): Promise<Retailer> {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
  });

  try {
    const page = await browser.newPage();
    const allProductData = await scrapeAllPages(page);
    const products = convertDataToProducts(allProductData);

    return new Retailer(
      "Bergfreunde",
      "EUR",
      "https://www.bergfreunde.eu/",
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
    const url = `${BASE_URL}/${currentPage}`;
    await page.goto(url, { waitUntil: "networkidle2" });
    console.log(`Scraping page ${currentPage}...`);

    const pageProductData = await scrapeProductsFromPage(page);
    allProductData.push(...pageProductData);

    hasNextPage = await hasNextPageAvailable(page, "a[title='next']");
    currentPage++;
  }

  return allProductData;
}

async function scrapeProductsFromPage(page: Page): Promise<RawProductData[]> {
  return await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll(".product-item"));

    return Array.from(elements)
      .filter(
        (element) => !!element.querySelector("[data-codecept='strokePrice']")
      )
      .map((element) => {
        const url = element
          .querySelector("a.product-link")
          ?.getAttribute("href");

        const brand = element
          .querySelector(".manufacturer-title")
          ?.textContent?.trim();
        const product = element
          .querySelector(".product-title")
          ?.textContent?.replaceAll("\n", "")
          ?.replace(/\s+/g, " ")
          ?.trim();

        const scrapedName = `${brand} ${product}`;

        const image = element
          .querySelector("img.product-image")
          ?.getAttribute("src");

        const originalPriceString = element
          .querySelector("[data-codecept='strokePrice']")
          ?.textContent?.trim();
        const discountPriceString = element
          .querySelector("[data-codecept='currentPrice']")
          ?.textContent?.trim();

        const safeParseFloat = (value: string | undefined) => {
          if (!value) return undefined;

          const cleanedValue = value.replace(/[^0-9.,]/g, "");
          const parsedValue = parseFloat(cleanedValue);
          return isNaN(parsedValue) ? undefined : parsedValue;
        };

        const originalPrice = safeParseFloat(originalPriceString);
        const discountPrice = safeParseFloat(discountPriceString);

        const discountString = element
          .querySelector('[data-codecept="discountBadge"]')
          ?.textContent?.trim();
        const discountPercent = discountString
          ? parseFloat(discountString)
          : undefined;

        return {
          url,
          scrapedName,
          image,
          originalPrice,
          discountPrice,
          discountPercent,
        };
      });
  });
}
