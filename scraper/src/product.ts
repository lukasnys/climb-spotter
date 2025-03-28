import CLIMBING_SHOES = require("./constants/climbing-shoes");

class Product {
  url: string;
  image: string;
  scrapedName: string;
  originalPrice: string;
  discountPrice: string;
  discountPercent: number;

  constructor(
    url: string,
    image: string,
    scrapedName: string,
    originalPrice: string,
    discountPrice: string,
    discountPercent: number
  ) {
    this.url = url;
    this.image = image;
    this.scrapedName = scrapedName;
    this.originalPrice = originalPrice;
    this.discountPrice = discountPrice;
    this.discountPercent = discountPercent;
  }

  static create(
    url: string | undefined | null,
    image: string | undefined | null,
    scrapedName: string | undefined | null,
    originalPrice: string | undefined | null,
    discountPrice: string | undefined | null,
    discountPercent: number | undefined | null
  ): Product | null {
    if (
      !url ||
      !image ||
      !scrapedName ||
      !originalPrice ||
      !discountPrice ||
      !discountPercent
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

  get brand() {
    const brands = Object.values(CLIMBING_SHOES.BRANDS);

    return (
      brands.find((brand) =>
        this.scrapedName.toLowerCase().includes(brand.toLowerCase())
      ) ?? ""
    );
  }

  get name(): string {
    const brand = this.brand;
    if (!brand) return "";

    const shoes =
      CLIMBING_SHOES.SHOES[brand as keyof typeof CLIMBING_SHOES.SHOES];

    // Try to find an exact match first
    return (
      shoes.find((shoe) =>
        this.scrapedName.toLocaleLowerCase().includes(shoe.toLowerCase())
      ) ?? ""
    );
  }

  get gender(): "M" | "F" | "U" {
    const WOMEN_KEYWORDS = [
      "women",
      "womens",
      "women's",
      "female",
      "wmn",
      "w's",
    ];
    const MEN_KEYWORDS = ["men", "mens", "men's", "male", "m's"];

    if (
      WOMEN_KEYWORDS.some((keyword) =>
        this.scrapedName.toLowerCase().includes(keyword)
      )
    ) {
      return "F";
    } else if (
      MEN_KEYWORDS.some((keyword) =>
        this.scrapedName.toLowerCase().includes(keyword)
      )
    ) {
      return "M";
    }
    return "U";
  }
}

export = Product;
