import { GoogleSheets, Shoe } from "@climbing-deals/shared";

export async function onRequest(context) {
  const googleSheets = GoogleSheets.createWithEnv("shoes");
  const rows = await googleSheets.getRows<Shoe>();

  const shoes = rows.map((row) => {
    return row.toObject();
  }) as Shoe[];

  return Response.json(shoes);
}
