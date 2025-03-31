import { JWT } from "google-auth-library";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

export class GoogleSheets {
  private sheetPromise: Promise<GoogleSpreadsheetWorksheet>;

  constructor(spreadsheetName: string) {
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

    this.sheetPromise = doc.loadInfo().then(() => {
      const sheet = doc.sheetsByTitle[spreadsheetName];
      if (!sheet) {
        throw new Error(`Sheet with title ${spreadsheetName} not found`);
      }
      return sheet;
    });
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

  async getRows() {
    const sheet = await this.sheetPromise;
    const rows = await sheet.getRows();
    console.log(rows);
    return rows;
  }

  async appendRows(
    rows: Record<string, string | boolean | number>[]
  ): Promise<void> {
    const sheet = await this.sheetPromise;
    await sheet.addRows(rows);
  }
}
