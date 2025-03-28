import "dotenv/config";
import puppeteer = require("puppeteer");
import GoogleSheets = require("./google-sheets");
import Store = require("./store");
import Product = require("./product");

const headers = [
  "Inserted At",
  "Store Name",
  "Store Currency",
  "Store URL",
  "Product URL",
  "Product Image",
  "Product Scraped Name",
  "Product Brand",
  "Product Name",
  "Product Gender",
  "Original Price",
  "Discount Price",
  "Discount %",
  "Is Mobile Discount",
];

function writeStoreWithProductsToSheet(store: Store) {
  const googleSheets = new GoogleSheets();
  googleSheets.addHeadersIfNeeded(headers);

  const rows = store.products.map((product) => {
    return [
      new Date().toISOString(),
      store.name,
      store.currency,
      store.url,
      product.url,
      product.image,
      product.scrapedName,
      product.brand,
      product.name,
      product.gender,
      product.originalPrice,
      product.discountPrice,
      product.discountPercent,
      product.isMobileDiscount,
    ];
  });

  googleSheets.appendRows(rows);
}

async function scrapeShoeDeals() {
  console.log("Hello, world!");

  const googleSheets = new GoogleSheets();
  await googleSheets.clearSheet();

  const oliunid = await scrapeOliunid();
  writeStoreWithProductsToSheet(oliunid);
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
