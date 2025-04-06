import { RetailerKey } from "./constants/retailers.js";

export interface Shoe {
  insertedAt: string;
  retailerKey: RetailerKey;
  url: string;
  imageUrl: string;
  scrapedName: string;
  brand: string;
  name: string;
  audience: "M" | "F" | "K" | "U";
  originalPrice: number;
  discountPrice: number | undefined;
  discountPercentage: number | undefined;
}
