import { GoogleSheets, Shoe } from "@climbing-deals/shared";

export async function onRequest(context) {
  const GOOGLE_SPREADSHEET_ID = context.env.GOOGLE_SPREADSHEET_ID;
  const GOOGLE_PRIVATE_KEY = context.env.GOOGLE_PRIVATE_KEY;
  const GOOGLE_CLIENT_EMAIL = context.env.GOOGLE_CLIENT_EMAIL;

  const googleSheets = new GoogleSheets(
    "shoes",
    GOOGLE_SPREADSHEET_ID,
    GOOGLE_PRIVATE_KEY,
    GOOGLE_CLIENT_EMAIL
  );
  const rows = await googleSheets.getRows<Shoe>();

  const shoes = rows.map((row) => {
    return row.toObject();
  }) as Shoe[];

  return Response.json(shoes);
}
