export interface Shoe {
  insertedAt: string;
  retailer: string;
  retailerCurrency: string;
  retailerUrl: string;
  productUrl: string;
  productImage: string;
  productScrapedName: string;
  productBrand: string;
  productName: string;
  productGender: string;
  originalPrice: string;
  discountPrice: string | undefined;
  discountPercentage: string | undefined;
}
