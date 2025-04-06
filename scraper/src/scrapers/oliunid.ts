import { Page } from "puppeteer";
import { hasNextPageAvailable, ScrapedShoeData, Scraper } from "./index.js";

const BASE_URL = "https://www.oliunid.com/eu/footwear/climbing-shoes";

export class OliunidScraper extends Scraper {
  constructor() {
    super("OLIUNID");
  }

  override getUrlWithPage(page: number) {
    return `${BASE_URL}?p=${page}`;
  }

  override hasNextPage(page: Page): Promise<boolean> {
    return hasNextPageAvailable(page, ".action.next");
  }

  override getProductDataForPage(page: Page): Promise<ScrapedShoeData[]> {
    return page.evaluate(() => {
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
              specialPriceElement.getAttribute("data-price-amount") ??
              undefined;
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
  }
}
