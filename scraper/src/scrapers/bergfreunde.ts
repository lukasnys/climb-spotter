import { Page } from "puppeteer";
import { hasNextPageAvailable, ScrapedShoeData, Scraper } from "./index.js";

const BASE_URL = "https://www.bergfreunde.eu/climbing-shoes";

export class BergfreundeScraper extends Scraper {
  constructor() {
    super("BERGFREUNDE");
  }

  override getUrlWithPage(page: number) {
    return `${BASE_URL}/${page}`;
  }

  override hasNextPage(page: Page): Promise<boolean> {
    return hasNextPageAvailable(page, "a[title='next']");
  }

  override getProductDataForPage(page: Page): Promise<ScrapedShoeData[]> {
    return page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll(".product-item"));

      return Array.from(elements).map((element) => {
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

        let originalPrice: string | undefined = undefined;
        let discountPrice: string | undefined = undefined;

        const strokePriceElement = element.querySelector(ORIGINAL_PRICE);
        const currentPriceElement = element.querySelector(DISCOUNT_PRICE);

        if (strokePriceElement) {
          originalPrice = strokePriceElement.innerText;
          discountPrice = currentPriceElement?.innerText;
        } else {
          originalPrice = currentPriceElement?.innerText;
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
  }
}
