import puppeteer = require("puppeteer");
import Store = require("../store");
import Product = require("../product");

async function scrapeOliunid(): Promise<Store> {
  const BASE_URL = "https://www.oliunid.com/eu/footwear/climbing-shoes";

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();
  await page.goto(BASE_URL, { waitUntil: "networkidle2" });

  const productData = [];

  let currentPage = 1;
  let hasNextPage = true;
  while (hasNextPage) {
    const url = `${BASE_URL}?p=${currentPage}`;
    await page.goto(url, { waitUntil: "networkidle2" });
    console.log("Scraping page:", url);

    const pageProductData = await page.evaluate(() => {
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

          const originalPrice = element
            .querySelector(".original-price-wrapper [data-price-amount]")
            ?.getAttribute("data-price-amount");
          const discountPrice = element
            .querySelector(".normal-price [data-price-amount]")
            ?.getAttribute("data-price-amount");

          const discountString = element.querySelector(
            ".discount-percentage.desktop-only"
          )?.textContent;
          const discount = discountString
            ? parseFloat(discountString)
            : undefined;

          return { url, name, image, originalPrice, discountPrice, discount };
        });
    });

    productData.push(...pageProductData);

    const hasNextPage = await page.evaluate(() => {
      const nextPageButton = document.querySelector(".action.next");
      return !!nextPageButton;
    });

    if (hasNextPage) {
      currentPage++;
    }
  }

  await browser.close();

  const products = productData
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

  const store = new Store(
    "Oliunid",
    "EUR",
    "https://www.oliunid.com/",
    products
  );

  return store;
}

export = scrapeOliunid;
