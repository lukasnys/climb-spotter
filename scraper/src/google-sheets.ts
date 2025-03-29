import { JWT } from "google-auth-library";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

const SPREADSHEET_SHEET_NAME = "data";

export class GoogleSheets {
  private sheetPromise: Promise<GoogleSpreadsheetWorksheet>;

  constructor() {
    if (!process.env.GOOGLE_SPREADSHEET_ID) {
      throw new Error("GOOGLE_SPREADSHEET_ID environment variable is not set");
    }

    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error("GOOGLE_PRIVATE_KEY environment variable is not set");
    }

    if (!process.env.GOOGLE_CLIENT_EMAIL) {
      throw new Error("GOOGLE_CLIENT_EMAIL environment variable is not set");
    }

    const jwt = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, jwt);

    this.sheetPromise = doc
      .loadInfo()
      .then(() => doc.sheetsByTitle[SPREADSHEET_SHEET_NAME]!);
  }

  async clearSheet(): Promise<void> {
    const sheet = await this.sheetPromise;
    await sheet.clear();
  }

  async addHeadersIfNeeded(headers: string[]): Promise<void> {
    const sheet = await this.sheetPromise;
    await sheet.setHeaderRow(headers);
  }

  async addRow(row: Record<string, string | boolean | number>): Promise<void> {
    const sheet = await this.sheetPromise;
    await sheet.addRow(row);
  }

  async appendRows(
    rows: Record<string, string | boolean | number>[]
  ): Promise<void> {
    const sheet = await this.sheetPromise;
    await sheet.addRows(rows);
  }
}
