class Product {
  url: string;
  image: string;
  scrapedName: string;
  originalPrice: string;
  discountPrice: string;
  discountPercent: number;
  isMobileDiscount: boolean;

  constructor(
    url: string,
    image: string,
    scrapedName: string,
    originalPrice: string,
    discountPrice: string,
    discountPercent: number,
    isMobileDiscount: boolean
  ) {
    this.url = url;
    this.image = image;
    this.scrapedName = scrapedName;
    this.originalPrice = originalPrice;
    this.discountPrice = discountPrice;
    this.discountPercent = discountPercent;
    this.isMobileDiscount = isMobileDiscount;
  }

  get brand(): string {
    return "";
  }

  get name(): string {
    return "";
  }

  get gender(): "M" | "F" | "" {
    return "";
  }
}

export = Product;
