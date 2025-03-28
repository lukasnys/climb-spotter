import Product = require("./product");

class Store {
  name: string;
  currency: string;
  url: string;

  products: Product[] = [];

  constructor(name: string, currency: string, url: string) {
    this.name = name;
    this.currency = currency;
    this.url = url;
  }
}

export = Store;
