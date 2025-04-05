import puppeteer, { Page } from "puppeteer";
import { logger, RetailerKey, RETAILERS } from "@climbing-deals/shared";
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

export abstract class Scraper {
  retailer: RetailerKey;

  constructor(retailer: RetailerKey) {
    this.retailer = retailer;
  }

  abstract getUrlWithPage(page: number): string;
  abstract getProductDataForPage(page: Page): Promise<RawProductData[]>;
  abstract hasNextPage(page: Page): Promise<boolean>;

  private async scrapeAllPages(page: Page) {
    const allProductData: RawProductData[] = [];

    let currentPage = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const url = this.getUrlWithPage(currentPage);
      await page.goto(url, { waitUntil: "networkidle2" });
      logger.info(`Scraping page ${currentPage} with url: ${url}`);

      const pageProductData = await this.getProductDataForPage(page);
      allProductData.push(...pageProductData);

      hasNextPage = await this.hasNextPage(page);
      currentPage++;
    }

    return allProductData;
  }

  async scrape() {
    const retailerInfo = RETAILERS[this.retailer];
    logger.info(`Scraping ${retailerInfo.name}...`);

    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1280, height: 800 },
    });

    try {
      const page = await browser.newPage();

      const rawProductData = await this.scrapeAllPages(page);
      const products = rawProductData
        .map((data) => validateAndCreateProduct(data))
        .filter((product) => product !== null);

      return new Retailer(
        retailerInfo.name,
        retailerInfo.currency,
        retailerInfo.url,
        products
      );
    } catch {
      logger.error(`Error scraping ${retailerInfo.name}`);
    } finally {
      await browser.close();
    }
  }
}
