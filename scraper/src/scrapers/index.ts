import puppeteer, { Page } from "puppeteer";
import { logger } from "@climbing-deals/shared";
import { Retailer } from "../Retailer.js";
import { Shoe } from "../Shoe.js";
import { z } from "zod";

declare global {
  interface Element {
    innerText?: string;
  }
}

const productDataSchema = z.object({
  url: z.string().url(),
  image: z.string().url(),
  scrapedName: z.string(),
  originalPrice: z.number().positive(),
  discountPrice: z.number().positive().optional(),
});

type ProductData = z.infer<typeof productDataSchema>;
export type RawProductData = {
  [key in keyof ProductData]: ProductData[key] | null | undefined;
};

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

export function validateAndCreateProduct(data: RawProductData): Shoe | null {
  const parsedData = productDataSchema.safeParse(data);

  if (!parsedData.success) {
    logger.warn(
      `Invalid product data for product ${data.scrapedName}: ${parsedData.error.toString()}`
    );
    return null;
  }

  const { url, image, scrapedName, originalPrice, discountPrice } =
    parsedData.data;

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

        const products = allProductData
          .map((data) => validateAndCreateProduct(data))
          .filter((product) => product !== null);

        return new Retailer(name, currency, url, products);
      } finally {
        await browser.close();
      }
    },
  };
}
