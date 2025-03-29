import { Page } from "puppeteer";
import { Product } from "../product.js";

export interface RawProductData {
  url: string | undefined | null;
  image: string | undefined | null;
  scrapedName: string | undefined | null;
  originalPrice: number | undefined | null;
  discountPrice: number | undefined | null;
  discountPercent: number | undefined | null;
}

function isValid<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) return false;

  if (typeof value === "string") return value.trim() !== "";

  if (typeof value === "number") return !isNaN(value) && value > 0;

  return true;
}

export function hasNextPageAvailable(
  page: Page,
  selector: string
): Promise<boolean> {
  return page.evaluate((selector) => {
    const nextPageButton = document.querySelector(selector);
    return !!nextPageButton;
  }, selector);
}

export function validateAndCreateProduct(data: RawProductData): Product | null {
  const {
    url,
    image,
    scrapedName,
    originalPrice,
    discountPrice,
    discountPercent,
  } = data;

  if (
    !isValid(url) ||
    !isValid(image) ||
    !isValid(scrapedName) ||
    !isValid(originalPrice) ||
    !isValid(discountPrice) ||
    !isValid(discountPercent)
  ) {
    return null;
  }

  return new Product(
    url,
    image,
    scrapedName,
    originalPrice,
    discountPrice,
    discountPercent
  );
}
