import "dotenv/config";
import { Retailer } from "./Retailer.js";
import { scrapeOliunid } from "./scrapers/oliunid.js";
import { scrapeBergfreunde } from "./scrapers/bergfreunde.js";
import { GoogleSheets } from "@climbing-deals/shared";
import { logger } from "@climbing-deals/shared";
import { scrape9cClimbing } from "./scrapers/9cclimbing.js";

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
  const googleSheets = new GoogleSheets("shoes");
  await googleSheets.addHeadersIfNeeded([...headers]);

  const rows = retailer.shoes.map(
    (product): Record<Headers, string | number | boolean> => {
      return {
        insertedAt: new Date().toISOString(),
        retailerName: retailer.name,
        retailerCurrency: retailer.currency,
        retailerUrl: retailer.url,
        productUrl: product.url,
        productImage: product.image,
        productScrapedName: product.scrapedName,
        productBrand: product.brand ?? "",
        productName: product.name ?? "",
        productGender: product.audience,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice ?? "",
        discountPercent: product.discountPercent ?? "",
      };
    }
  );

  await googleSheets.appendRows(rows);
}

async function scrapeShoeDeals() {
  logger.info("Starting scraping process...");

  const googleSheets = new GoogleSheets("shoes");
  await googleSheets.clearSheet();

  const scrapers = [scrapeOliunid, scrapeBergfreunde, scrape9cClimbing];

  const scrapePromises = scrapers.map(async (scraper) => {
    const data = await scraper();
    return writeRetailerWithProductsToSheet(data);
  });

  await Promise.all(scrapePromises);
}

scrapeShoeDeals();
