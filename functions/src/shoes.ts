import "dotenv/config";
import { GoogleSheets } from "@climbing-deals/shared";
import { HttpFunction } from "@google-cloud/functions-framework";

export const getShoes: HttpFunction = async (req, res) => {
  const googleSheets = new GoogleSheets("shoes");

  const rows = await googleSheets.getRows();

  res.status(200).json({
    shoes: rows.map((row) => row.toObject()),
  });
};
