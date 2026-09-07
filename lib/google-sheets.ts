import { google, sheets_v4 } from "googleapis"

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

export type GcLeadRow = {
  timestamp: string
  sourceCity: string
  sourceTrade: string
  sourceUrl: string
  companyName: string
  name: string
  role: string
  phone: string
  email: string
  trade: string
  projectType: string
  crewSize: string
  jobsiteCity: string
  jobsiteState: string
  projectSize: string
  licenseNumber: string
  startTiming: string
  message: string
}

const GC_LEADS_TAB = "GC Leads"
const GC_LEADS_HEADERS = [
  "Timestamp",
  "Source City",
  "Source Trade",
  "Source URL",
  "Company / GC Name",
  "Contact Name",
  "Role",
  "Phone",
  "Email",
  "Trade Needed",
  "Project Type",
  "Crew Size Needed",
  "Jobsite City",
  "Jobsite State",
  "Project Size",
  "License #",
  "Start Timing",
  "Scope / Message",
  "Status", // manual
  "Assigned Crew", // manual
]

function normalizePrivateKey(raw: string): string {
  return raw
    .trim()
    .replace(/^"+/, "") // drop a stray leading quote (e.g. key pasted with quotes)
    .replace(/",?\s*$/, "") // drop a stray closing quote and/or trailing comma
    .replace(/\\n/g, "\n") // expand literal \n escapes into real newlines
}

/** Throws if Google Sheets credentials are missing; otherwise returns a client. */
function getSheetsClient(): { sheets: sheets_v4.Sheets; spreadsheetId: string } {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
  const rawPrivateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

  if (!clientEmail || !rawPrivateKey || !spreadsheetId) {
    throw new Error("Missing Google Sheets credentials in environment variables")
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: normalizePrivateKey(rawPrivateKey),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  return { sheets: google.sheets({ version: "v4", auth }), spreadsheetId }
}

function columnLetter(index: number): string {
  let n = index
  let out = ""
  while (n >= 0) {
    out = String.fromCharCode(65 + (n % 26)) + out
    n = Math.floor(n / 26) - 1
  }
  return out
}

/** Creates the tab (if missing) and writes the header row (if empty). */
async function ensureTabWithHeaders(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  tabName: string,
  headers: string[],
): Promise<void> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId })
  const found = meta.data.sheets?.find(
    (s) => s.properties?.title === tabName,
  )

  if (!found) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: { title: tabName },
            },
          },
        ],
      },
    })
  }

  const headerRange = `${tabName}!A1:${columnLetter(headers.length - 1)}1`
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: headerRange,
  })

  const firstRow = existing.data.values?.[0] ?? []
  const empty = firstRow.every((cell) => cell === "" || cell === undefined)
  if (empty) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: headerRange,
      valueInputOption: "RAW",
      requestBody: { values: [headers] },
    })
  }
}

export async function appendSubApplicationToSheet(data: SubApplicationRow): Promise<void> {
  const { sheets, spreadsheetId } = getSheetsClient()

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

export async function appendGcLeadToSheet(data: GcLeadRow): Promise<void> {
  const { sheets, spreadsheetId } = getSheetsClient()
  await ensureTabWithHeaders(sheets, spreadsheetId, GC_LEADS_TAB, GC_LEADS_HEADERS)

  const row = [
    data.timestamp,
    data.sourceCity || "",
    data.sourceTrade || "",
    data.sourceUrl || "",
    data.companyName,
    data.name,
    data.role || "",
    data.phone,
    data.email || "",
    data.trade,
    data.projectType,
    data.crewSize,
    data.jobsiteCity || "",
    data.jobsiteState,
    data.projectSize || "",
    data.licenseNumber || "",
    data.startTiming,
    data.message || "",
    "", // Status (manual)
    "", // Assigned Crew (manual)
  ]

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${GC_LEADS_TAB}!A:${columnLetter(GC_LEADS_HEADERS.length - 1)}`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  })
}
