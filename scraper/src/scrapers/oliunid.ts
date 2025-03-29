import puppeteer, { Page } from "puppeteer";
import { Retailer } from "../retailer.js";
import { Product } from "../product.js";

const BASE_URL = "https://www.oliunid.com/eu/footwear/climbing-shoes";

interface ScrapedProductData {
  url: string | undefined | null;
  name: string | undefined | null;
  image: string | undefined | null;
  originalPrice: number | undefined | null;
  discountPrice: number | undefined | null;
  discount: number | undefined | null;
}

export async function scrapeOliunid(): Promise<Retailer> {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
  });

  try {
    const page = await browser.newPage();
    const allProductData = await scrapeAllPages(page);
    const products = convertToProducts(allProductData);

    return new Retailer("Oliunid", "EUR", "https://www.oliunid.com/", products);
  } finally {
    await browser.close();
  }
}

async function scrapeAllPages(page: Page) {
  const allProductData: ScrapedProductData[] = [];

  let currentPage = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const url = `${BASE_URL}?p=${currentPage}`;
    await page.goto(url, { waitUntil: "networkidle2" });
    console.log(`Scraping page ${currentPage}...`);

    const pageProductData = await scrapeProductsFromPage(page);
    allProductData.push(...pageProductData);

    hasNextPage = await hasNextPageAvailable(page);
    currentPage++;
  }

  return allProductData;
}

async function hasNextPageAvailable(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    const nextPageButton = document.querySelector(".action.next");
    return !!nextPageButton;
  });
}

async function scrapeProductsFromPage(
  page: Page
): Promise<ScrapedProductData[]> {
  return page.evaluate(() => {
    const elements = document.querySelectorAll(".product-item");
    return Array.from(elements)
      .filter((element) => !!element.querySelector(".original-price-wrapper"))
      .map((element) => {
        const url = element
          .querySelector(".product-item-link")
          ?.getAttribute("href");
        const name = element
          .querySelector(".product-item-link")
          ?.textContent?.trim();
        const image = element.querySelector("img")?.getAttribute("data-src");

        const originalPriceString = element
          .querySelector(".original-price-wrapper [data-price-amount]")
          ?.getAttribute("data-price-amount");
        const discountPriceString = element
          .querySelector(".normal-price [data-price-amount]")
          ?.getAttribute("data-price-amount");

        const originalPrice = originalPriceString
          ? parseFloat(originalPriceString)
          : undefined;
        const discountPrice = discountPriceString
          ? parseFloat(discountPriceString)
          : undefined;

        const discountString = element.querySelector(
          ".discount-percentage.desktop-only"
        )?.textContent;
        const discount = discountString
          ? parseFloat(discountString)
          : undefined;

        return { url, name, image, originalPrice, discountPrice, discount };
      });
  });
}

function convertToProducts(productData: ScrapedProductData[]): Product[] {
  return productData
    .map((product) =>
      Product.create(
        product.url,
        product.image,
        product.name,
        product.originalPrice,
        product.discountPrice,
        product.discount
      )
    )
    .filter((product) => product !== null);
}
