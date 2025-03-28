import googleauthlibrary = require("google-auth-library");
import googleapis = require("googleapis");

const SPREADSHEET_SHEET_NAME = "data";

class GoogleSheets {
  private sheets: googleapis.sheets_v4.Sheets;
  private spreadsheetId: string;

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || "";
    if (!this.spreadsheetId) {
      throw new Error("GOOGLE_SPREADSHEET_ID environment variable is not set");
    }

    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "";
    if (!credentialsPath) {
      throw new Error(
        "GOOGLE_APPLICATION_CREDENTIALS environment variable is not set"
      );
    }

    const auth = new googleauthlibrary.JWT({
      keyFile: credentialsPath,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = googleapis.google.sheets({ version: "v4", auth });
  }

  async clearSheet(): Promise<void> {
    await this.sheets.spreadsheets.values.clear({
      spreadsheetId: this.spreadsheetId,
      range: SPREADSHEET_SHEET_NAME,
    });

    console.log("Sheet cleared successfully.");
  }

  async addHeadersIfNeeded(headers: string[]): Promise<void> {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: SPREADSHEET_SHEET_NAME,
    });
    const rows = response.data.values || [];

    if (rows.length !== 0) return;

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: SPREADSHEET_SHEET_NAME,
      valueInputOption: "RAW",
      requestBody: {
        values: [headers],
      },
    });
  }

  async appendRows(rows: unknown[][]): Promise<void> {
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: SPREADSHEET_SHEET_NAME,
      valueInputOption: "RAW",
      requestBody: {
        values: rows,
      },
    });

    console.log("Data written successfully.");
  }
}

export = GoogleSheets;
