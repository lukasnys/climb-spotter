import puppeteer, { Page } from "puppeteer";
import { logger } from "@climbing-deals/shared";
import { Retailer } from "../Retailer.js";
import { Shoe } from "../Shoe.js";

declare global {
  interface Element {
    innerText?: string;
  }
}

export interface RawProductData {
  url: string | undefined | null;
  image: string | undefined | null;
  scrapedName: string | undefined | null;
  originalPrice: number | undefined;
  discountPrice: number | undefined;
}

function isValid<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) return false;

  if (typeof value === "string") return value.trim() !== "";

  if (typeof value === "number") return !isNaN(value) && value > 0;

  return true;
}

export function safeParseFloat(value: string | null | undefined) {
  if (!value) return undefined;

  const cleanedValue = value.replace(/[^0-9.,]/g, "");
  const parsedValue = parseFloat(cleanedValue);
  return isNaN(parsedValue) ? undefined : parsedValue;
}

export function hasNextPageAvailable(
  page: Page,
  selector: string
): Promise<boolean> {
  return page.evaluate((selector) => {
    const nextPageButton = document.querySelector(selector);
    return !!nextPageButton;
  }, selector);
}

export function convertDataToProducts(productData: RawProductData[]): Shoe[] {
  return productData
    .map((product) => validateAndCreateProduct(product))
    .filter((product) => product !== null) as Shoe[];
}

export function validateAndCreateProduct(data: RawProductData): Shoe | null {
  const { url, image, scrapedName, originalPrice, discountPrice } = data;

  if (
    !isValid(url) ||
    !isValid(image) ||
    !isValid(scrapedName) ||
    !isValid(originalPrice)
  ) {
    return null;
  }

  return new Shoe(url, image, scrapedName, originalPrice, discountPrice);
}

export function createRetailerScraper(
  name: string,
  currency: string,
  url: string
) {
  return {
    scrape: async (
      scrapeAllPagesFn: (page: Page) => Promise<RawProductData[]>
    ) => {
      logger.info(`Scraping ${name}...`);
      const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: { width: 1280, height: 800 },
      });

      try {
        const page = await browser.newPage();

        const allProductData = await scrapeAllPagesFn(page);

        const products = convertDataToProducts(allProductData);

        return new Retailer(name, currency, url, products);
      } finally {
        await browser.close();
      }
    },
  };
}
