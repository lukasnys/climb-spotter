import { Product } from "./product.js";

export class Retailer {
  name: string;
  currency: string;
  url: string;
  products: Product[];

  constructor(
    name: string,
    currency: string,
    url: string,
    products: Product[]
  ) {
    this.name = name;
    this.currency = currency;
    this.url = url;
    this.products = products;
  }
}
