import "dotenv/config";
import GoogleSheets = require("./google-sheets");
import Store = require("./store");
import scrapeOliunid = require("./scrapers/oliunid");
import scrapeBergfreunde = require("./scrapers/bergfreunde");

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

  const bergfreunde = await scrapeBergfreunde();
  await writeStoreWithProductsToSheet(bergfreunde);
}

scrapeShoeDeals();
