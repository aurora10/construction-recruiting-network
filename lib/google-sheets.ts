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
  baseZip: string
  unionStatus: string
  workersComp: string
  liabilityLimit: string
  equipmentOwned: string
  bilingualForeman: string
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
  jobsiteZip: string
  unionLaborRequired: string
  workersCompRequired: string
  minLiabilityRequired: string
  equipmentProvidedByGc: string
}

const GC_LEADS_TAB = "GC Leads"
// Column order mirrors the live "GC Leads" tab exactly (do not reorder without
// updating the sheet: new matching criteria sit at C–G, source fields at B/H/I).
const GC_LEADS_HEADERS = [
  "Timestamp",
  "Source City",
  "Jobsite Zip Code",
  "Union Labor Required",
  "Workers Comp Required",
  "Min. Liability Required",
  "Equipment Provided by GC",
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
    data.timestamp, // A
    data.sourceCity || "", // B
    data.sourceTrade || "", // C
    data.sourceUrl || "", // D
    data.name, // E
    data.businessName || "", // F
    data.phone, // G
    data.email || "", // H
    data.primaryTrade, // I
    data.crewSize, // J
    data.hasInsurance, // K
    data.travelRadius, // L
    "", // M: Vetting Status (manual)
    "", // N: GC Placement (manual)
    data.baseState || "", // O
    data.baseCity || "", // P
    data.baseZip || "", // Q
    data.unionStatus || "", // R
    data.workersComp || "", // S
    data.liabilityLimit || "", // T
    data.equipmentOwned || "", // U
    data.bilingualForeman || "", // V
  ]

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:V",
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

  // Order must match the live "GC Leads" headers exactly.
  const row = [
    data.timestamp, // A
    data.sourceCity || "", // B
    data.jobsiteZip || "", // C
    data.unionLaborRequired || "", // D
    data.workersCompRequired || "", // E
    data.minLiabilityRequired || "", // F
    data.equipmentProvidedByGc || "", // G
    data.sourceTrade || "", // H
    data.sourceUrl || "", // I
    data.companyName, // J
    data.name, // K
    data.role || "", // L
    data.phone, // M
    data.email || "", // N
    data.trade, // O
    data.projectType, // P
    data.crewSize, // Q
    data.jobsiteCity || "", // R
    data.jobsiteState, // S
    data.projectSize || "", // T
    data.licenseNumber || "", // U
    data.startTiming, // V
    data.message || "", // W
    "", // X: Status (manual)
    "", // Y: Assigned Crew (manual)
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
