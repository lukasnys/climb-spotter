import "dotenv/config";
import { Retailer } from "./retailer.js";
import { scrapeOliunid } from "./scrapers/oliunid.js";
import { scrapeBergfreunde } from "./scrapers/bergfreunde.js";
import { GoogleSheets } from "./google-sheets.js";

const headers = [
  "insertedAt",
  "retailerName",
  "retailerCurrency",
  "retailerUrl",
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

async function writeRetailerWithProductsToSheet(retailer: Retailer) {
  const googleSheets = new GoogleSheets();
  await googleSheets.addHeadersIfNeeded([...headers]);

  const rows = retailer.products.map(
    (product): Record<Headers, string | number | boolean> => {
      return {
        insertedAt: new Date().toISOString(),
        retailerName: retailer.name,
        retailerCurrency: retailer.currency,
        retailerUrl: retailer.url,
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
  await writeRetailerWithProductsToSheet(oliunid);

  const bergfreunde = await scrapeBergfreunde();
  await writeRetailerWithProductsToSheet(bergfreunde);
}

scrapeShoeDeals();
