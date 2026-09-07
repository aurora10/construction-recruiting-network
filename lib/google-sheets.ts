import { google } from "googleapis"

export type SubApplicationRow = {
  timestamp: string
  sourceCity: string
  sourceTrade: string
  sourceUrl: string
  name: string
  businessName: string
  phone: string
  email: string
  primaryTrade: string
  crewSize: string
  hasInsurance: string
  travelRadius: string
  baseState: string
  baseCity: string
}

export async function appendSubApplicationToSheet(data: SubApplicationRow): Promise<void> {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
  const rawPrivateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

  if (!clientEmail || !rawPrivateKey || !spreadsheetId) {
    console.warn(
      "[google-sheets] Missing Google Sheets credentials in environment variables. Skipping append.",
    )
    return
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: rawPrivateKey
      .trim()
      .replace(/^"+/, "") // drop a stray leading quote (e.g. key pasted with quotes)
      .replace(/",?\s*$/, "") // drop a stray closing quote and/or trailing comma
      .replace(/\\n/g, "\n"), // expand literal \n escapes into real newlines
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const sheets = google.sheets({ version: "v4", auth })

  const row = [
    data.timestamp,
    data.sourceCity || "",
    data.sourceTrade || "",
    data.sourceUrl || "",
    data.name,
    data.businessName || "",
    data.phone,
    data.email || "",
    data.primaryTrade,
    data.crewSize,
    data.hasInsurance,
    data.travelRadius,
    "", // Column M: Vetting Status (Leave blank/null)
    "", // Column N: GC Placement (Leave blank/null)
    data.baseState || "", // Column O: Base State (crew's home state)
    data.baseCity || "", // Column P: Base City (crew's home city, optional)
  ]

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:P",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  })
}
