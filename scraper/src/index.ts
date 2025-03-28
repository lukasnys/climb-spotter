import "dotenv/config";
import puppeteer = require("puppeteer");
import GoogleSheets = require("./google-sheets");
import Store = require("./store");
import Product = require("./product");

const headers = [
  "insertedAt",
  "storeName",
  "storeCurrency",
  "storeUrl",
  "productUrl",
  "productImage",
  "productScrapedName",
  "productBrand",
  "productName",
  "productGender",
  "originalPrice",
  "discountPrice",
  "discountPercent",
  "isMobileDiscount",
] as const;
type Headers = (typeof headers)[number];

async function writeStoreWithProductsToSheet(store: Store) {
  const googleSheets = new GoogleSheets();
  await googleSheets.addHeadersIfNeeded([...headers]);

  const rows = store.products.map(
    (product): Record<Headers, string | number | boolean> => {
      return {
        insertedAt: new Date().toISOString(),
        storeName: store.name,
        storeCurrency: store.currency,
        storeUrl: store.url,
        productUrl: product.url,
        productImage: product.image,
        productScrapedName: product.scrapedName,
        productBrand: product.brand,
        productName: product.name,
        productGender: product.gender,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        discountPercent: product.discountPercent,
        isMobileDiscount: product.isMobileDiscount,
      };
    }
  );

  await googleSheets.appendRows(rows);
}

async function scrapeShoeDeals() {
  console.log("Hello, world!");

  const googleSheets = new GoogleSheets();
  await googleSheets.clearSheet();

  const oliunid = await scrapeOliunid();
  await writeStoreWithProductsToSheet(oliunid);
}

// https://www.oliunid.com/eu/footwear/climbing-shoes
async function scrapeOliunid() {
  console.log("Scraping Oliunid...");

  const BASE_URL = "https://www.oliunid.com/eu/footwear/climbing-shoes";

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
  });

  const shoes: Product[] = [];

  const page = await browser.newPage();
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });

  let currentPage = 1;
  let hasNextPage = true;
  while (hasNextPage) {
    const url = `${BASE_URL}?p=${currentPage}`;
    console.log("Scraping page:", url);
    await page.goto(url, { waitUntil: "networkidle2" });

    const pageShoes = await page.evaluate(() => {
      const shoeElements = document.querySelectorAll(".product-item");

      return Array.from(shoeElements)
        .filter((shoeElement) => {
          const originalPriceWrapper = shoeElement.querySelector(
            ".original-price-wrapper"
          );
          return !!originalPriceWrapper;
        })
        .map((shoeElement) => {
          const link = shoeElement
            .querySelector(".product-item-link")
            ?.getAttribute("href");
          const name = shoeElement
            .querySelector(".product-item-link")
            ?.textContent?.trim();
          const image = shoeElement
            .querySelector("img")
            ?.getAttribute("data-src");

          const originalPrice = shoeElement
            .querySelector(".original-price-wrapper [data-price-amount]")
            ?.getAttribute("data-price-amount");
          const discountPrice = shoeElement
            .querySelector(".normal-price [data-price-amount]")
            ?.getAttribute("data-price-amount");

          const desktopDiscount = parseFloat(
            shoeElement.querySelector(".discount-percentage.desktop-only")
              ?.textContent || "0"
          );
          const mobileDiscount = parseFloat(
            shoeElement.querySelector(".discount-percentage.mobile-only")
              ?.textContent || "0"
          );

          const discount = Math.min(desktopDiscount, mobileDiscount);
          const isMobileDiscount = mobileDiscount < desktopDiscount;

          return {
            link,
            name,
            image,
            originalPrice,
            discountPrice,
            discount,
            isMobileDiscount,
          };
        });
    });

    const products = pageShoes
      .map((shoe) => {
        if (
          !shoe.link ||
          !shoe.image ||
          !shoe.name ||
          !shoe.originalPrice ||
          !shoe.discountPrice ||
          !shoe.discount
        ) {
          return null;
        }

        return new Product(
          shoe.link,
          shoe.image,
          shoe.name,
          shoe.originalPrice,
          shoe.discountPrice,
          shoe.discount,
          shoe.isMobileDiscount
        );
      })
      .filter((shoe) => shoe !== null);

    shoes.push(...products);

    hasNextPage = await page.evaluate(() => {
      const nextButton = document.querySelector(".action.next");
      return !!nextButton;
    });

    if (hasNextPage) {
      currentPage++;
    }
  }

  await browser.close();

  const store = new Store("Oliunid", "EUR", "https://www.oliunid.com/eu");
  store.products = shoes;

  return store;
}

scrapeShoeDeals();
