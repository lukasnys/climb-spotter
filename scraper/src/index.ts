import "dotenv/config";
import { OliunidScraper } from "./scrapers/oliunid.js";
import { scrapeBergfreunde } from "./scrapers/bergfreunde.js";
import { GoogleSheets, logger } from "@climbing-deals/shared";
import { scrape9cClimbing } from "./scrapers/9cclimbing.js";
import { Retailer } from "Retailer.js";

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
  const googleSheets = GoogleSheets.createWithEnv("shoes");
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
  const googleSheets = GoogleSheets.createWithEnv("shoes");
  await googleSheets.clearSheet();

  logger.info("Starting scraping process...");

  const oliunidScraper = new OliunidScraper();

  const scrapePromises = [
    oliunidScraper.scrape(),
    scrapeBergfreunde(),
    scrape9cClimbing(),
  ];
  const results = await Promise.all(scrapePromises);
  const promises = results
    .filter((result) => !!result)
    .map((result) => writeRetailerWithProductsToSheet(result));

  await Promise.all(promises);

  logger.info(
    `Scraping process completed. ${results.length} retailers scraped.`
  );
}

scrapeShoeDeals();
