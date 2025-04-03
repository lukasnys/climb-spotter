import { BRANDS, SHOES } from "@climbing-deals/shared";

export class Product {
  url: string;
  image: string;
  scrapedName: string;
  originalPrice: number;
  discountPrice: number;

  constructor(
    url: string,
    image: string,
    scrapedName: string,
    originalPrice: number,
    discountPrice: number
  ) {
    this.url = url;
    this.image = image;
    this.scrapedName = scrapedName;
    this.originalPrice = originalPrice;
    this.discountPrice = discountPrice;
  }

  get discountPercent(): number {
    if (this.originalPrice === 0) return 0;

    return (
      ((this.originalPrice - this.discountPrice) / this.originalPrice) * 100
    );
  }

  get brand() {
    const brands = Object.values(BRANDS);

    return (
      brands.find((brand) =>
        this.scrapedName.toLowerCase().includes(brand.toLowerCase())
      ) ?? ""
    );
  }

  get name(): string {
    if (!this.brand) return "";

    const shoes = SHOES[this.brand];

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
