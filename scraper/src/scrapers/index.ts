import puppeteer, { Page } from "puppeteer";
import { logger, RetailerKey, RETAILERS } from "@climb-spotter/shared";
import { Shoe } from "../Shoe.js";
import { type Shoe as ShoeData } from "@climb-spotter/shared";
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

export type ScrapedShoeData = {
  [key in keyof z.infer<typeof productDataSchema>]: string | null | undefined;
};

function safeParseFloat(value: string | null | undefined) {
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

function validateAndCreateProduct(data: ScrapedShoeData): Shoe | null {
  const shoe = {
    ...data,
    originalPrice: safeParseFloat(data.originalPrice),
    discountPrice: safeParseFloat(data.discountPrice),
  };

  const parsedData = productDataSchema.safeParse(shoe);

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
  abstract getProductDataForPage(page: Page): Promise<ScrapedShoeData[]>;
  abstract hasNextPage(page: Page): Promise<boolean>;

  private async scrapeAllPages(page: Page) {
    const allProductData: ScrapedShoeData[] = [];

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

  async getBrowser() {
    return puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1280, height: 800 },
    });
  }

  async scrape() {
    const retailerInfo = RETAILERS[this.retailer];
    logger.info(`Scraping ${retailerInfo.name}...`);

    const browser = await this.getBrowser();

    try {
      const page = await browser.newPage();

      const rawProductData = await this.scrapeAllPages(page as Page);
      const products = rawProductData
        .map((data) => validateAndCreateProduct(data))
        .filter((product) => product !== null);

      return products.map(
        (product): ShoeData => ({
          insertedAt: new Date().toISOString(),
          retailerKey: this.retailer,
          url: product.url,
          imageUrl: product.image,
          scrapedName: product.scrapedName,
          brand: product.brand ?? "",
          name: product.name ?? "",
          audience: product.audience,
          originalPrice: product.originalPrice,
          discountPrice: product.discountPrice,
          discountPercentage: product.discountPercent,
        })
      );
    } catch {
      logger.error(`Error scraping ${retailerInfo.name}`);
    } finally {
      await browser.close();
    }
  }
}
