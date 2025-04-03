import { Shoe } from "./Shoe.js";

export class Retailer {
  name: string;
  currency: string;
  url: string;
  shoes: Shoe[];

  constructor(name: string, currency: string, url: string, shoes: Shoe[]) {
    this.name = name;
    this.currency = currency;
    this.url = url;
    this.shoes = shoes;
  }
}
