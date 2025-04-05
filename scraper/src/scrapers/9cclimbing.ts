import { Page } from "puppeteer";
import {
  hasNextPageAvailable,
  RawProductData,
  safeParseFloat,
  Scraper,
} from "./index.js";

const BASE_URL = "https://9cclimbing.be/en/collections/climbing-shoes";

export class NineCClimbingScraper extends Scraper {
  constructor() {
    super("9C_CLIMBING");
  }

  override getUrlWithPage(page: number) {
    return `${BASE_URL}?page=${page}`;
  }

  override hasNextPage(page: Page): Promise<boolean> {
    return hasNextPageAvailable(
      page,
      ".pagination li:nth-last-child(1):not(:has(button[disabled]))"
    );
  }

  override async getProductDataForPage(page: Page): Promise<RawProductData[]> {
    const data = await page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll("[data-collection-items] .grid__item")
      );

      return elements.map((element) => {
        const LINK = "a.grid-view-item__link";
        const BRAND = ".price__vendor dd";
        const NAME = ".product-card__title";
        const IMAGE = "img";

        const HAS_DISCOUNT_SELECTOR = ".price.price--on-sale";
        const REGULAR_PRICE = ".price__regular .price-item--regular";
        const ORIGINAL_PRICE = ".price__sale .price-item--regular";
        const DISCOUNT_PRICE = ".price__sale .price-item--sale";

        const urlPostfix = element.querySelector(LINK)?.getAttribute("href");
        const url = `https://9cclimbing.be${urlPostfix}`;
        const scrapedBrand = element.querySelector(BRAND)?.innerText;
        const name = element.querySelector(NAME)?.innerText;

        const scrapedName = `${scrapedBrand} ${name}`;

        const imageSrc = element.querySelector(IMAGE)?.getAttribute("src");
        const image = imageSrc?.startsWith("//")
          ? "https:" + imageSrc
          : imageSrc;

        const getPrice = (element: Element | null) => {
          const full = element?.innerText;
          const sup = element?.querySelector("sup")?.innerText;

          if (!full) return undefined;
          if (!sup) return full;
          return full.slice(0, full.lastIndexOf(sup)) + "," + sup;
        };

        let originalPrice: string | undefined = undefined;
        let discountPrice: string | undefined = undefined;

        if (element.querySelector(HAS_DISCOUNT_SELECTOR)) {
          const originalPriceEl = element.querySelector(ORIGINAL_PRICE);
          const discountPriceEl = element.querySelector(DISCOUNT_PRICE);

          originalPrice = getPrice(originalPriceEl);
          discountPrice = getPrice(discountPriceEl);
        } else {
          const regularPriceEl = element.querySelector(REGULAR_PRICE);
          originalPrice = getPrice(regularPriceEl);
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

    return data.map((product) => ({
      ...product,
      originalPrice: safeParseFloat(product.originalPrice),
      discountPrice: safeParseFloat(product.discountPrice),
    }));
  }
}
