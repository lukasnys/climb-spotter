import { BRANDS, SHOES } from "@climbing-deals/shared";

export class Shoe {
  url: string;
  image: string;
  scrapedName: string;
  originalPrice: number;
  discountPrice: number | undefined;

  constructor(
    url: string,
    image: string,
    scrapedName: string,
    originalPrice: number,
    discountPrice: number | undefined
  ) {
    this.url = url;
    this.image = image;
    this.scrapedName = scrapedName;
    this.originalPrice = originalPrice;
    this.discountPrice = discountPrice;
  }

  get discountPercent(): number | undefined {
    if (this.discountPrice === undefined) return undefined;
    if (this.originalPrice === 0) return undefined;

    const discount = this.originalPrice - this.discountPrice;
    return (discount / this.originalPrice) * 100;
  }

  get brand() {
    return Object.values(BRANDS).find((brand) =>
      this.scrapedName.toLowerCase().includes(brand.toLowerCase())
    );
  }

  get name() {
    if (this.brand === undefined) return undefined;

    const shoes = SHOES[this.brand];
    return shoes.find((shoe) =>
      this.scrapedName.toLowerCase().includes(shoe.toLowerCase())
    );
  }

  get audience(): "M" | "F" | "U" | "K" {
    const WOMEN_KEYWORDS = ["woman", "women", "wmn"];
    const KIDS_KEYWORDS = ["kids", "kid's"];
    const MEN_KEYWORDS = ["men's"];

    const lowerCasedName = this.scrapedName.toLowerCase();

    if (WOMEN_KEYWORDS.some((keyword) => lowerCasedName.includes(keyword))) {
      return "F";
    }
    if (KIDS_KEYWORDS.some((keyword) => lowerCasedName.includes(keyword))) {
      return "K";
    }
    if (MEN_KEYWORDS.some((keyword) => lowerCasedName.includes(keyword))) {
      return "M";
    }

    return "U";
  }
}
