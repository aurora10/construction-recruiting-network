import tls from "node:tls"
import { site } from "@/lib/data"

// Minimal, dependency-free SMTP client for Gmail (app password over TLS 465).
// Used to email the site owner when a new Candidate Contractor application
// record is created. No external packages required.

const SMTP_HOST = "smtp.gmail.com"
const SMTP_PORT = 465
const SMTP_TIMEOUT_MS = 15_000

export type EmailSendResult = { ok: boolean; error?: string }

// ---------------------------------------------------------------------------
// Tiny SMTP session
// ---------------------------------------------------------------------------

class SmtpSession {
  private socket: tls.TLSSocket
  private buffer = ""
  private waiting: {
    lines: string[]
    resolve: (lines: string[]) => void
    reject: (err: Error) => void
  } | null = null

  constructor(socket: tls.TLSSocket) {
    this.socket = socket
    socket.setEncoding("utf8")
    socket.setTimeout(SMTP_TIMEOUT_MS, () => {
      this.fail(new Error("SMTP connection timed out"))
      socket.destroy()
    })
    socket.on("data", (chunk: string) => this.onData(chunk))
    socket.on("error", (err) => this.fail(err))
    socket.on("close", () => this.fail(new Error("SMTP connection closed early")))
  }

  private onData(chunk: string) {
    this.buffer += chunk
    // A reply ends at the first line starting with "<code> " (e.g. "250 ").
    while (this.waiting && this.buffer.includes("\n")) {
      const nl = this.buffer.indexOf("\n")
      const line = this.buffer.slice(0, nl).replace(/\r$/, "")
      this.buffer = this.buffer.slice(nl + 1)
      this.waiting.lines.push(line)
      if (/^\d{3} /.test(line)) {
        const done = this.waiting
        this.waiting = null
        done.resolve(done.lines)
        break
      }
    }
  }

  private fail(err: Error) {
    if (this.waiting) {
      const done = this.waiting
      this.waiting = null
      done.reject(err)
    }
  }

  /** Wait for the first server reply (used for the 220 greeting). */
  firstReply(): Promise<string[]> {
    return this.nextReply()
  }

  /** Write a command line and await the (possibly multiline) server reply. */
  async command(line: string): Promise<string[]> {
    if (this.waiting) throw new Error("SMTP: concurrent commands not supported")
    const replyPromise = this.nextReply()
    this.socket.write(line + "\r\n")
    return replyPromise
  }

  /** Write raw data (e.g. the message body) then await the reply. */
  async writeData(data: string): Promise<string[]> {
    if (this.waiting) throw new Error("SMTP: concurrent commands not supported")
    const replyPromise = this.nextReply()
    this.socket.write(data)
    return replyPromise
  }

  private nextReply(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.waiting = { lines: [], resolve, reject }
      // The reply may already be buffered from the connect handshake.
      this.onData("")
    })
  }

  end() {
    try {
      this.socket.end()
    } catch {
      /* ignore */
    }
  }
}

// ---------------------------------------------------------------------------
// Message building
// ---------------------------------------------------------------------------

/** RFC 2047 encoded-word for non-ASCII subjects; ASCII passes through raw. */
function encodeSubject(subject: string): string {
  if (/^[\x20-\x7e]*$/.test(subject)) return subject
  return `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`
}

function dotStuff(body: string): string {
  return body
    .split("\n")
    .map((line) => (line.startsWith(".") ? "." + line : line))
    .join("\n")
}

/** Base64-encodes a MIME part body, wrapped at the 76-char line limit. */
function wrapBase64(input: string): string {
  const encoded = Buffer.from(input, "utf8").toString("base64")
  const lines: string[] = []
  for (let i = 0; i < encoded.length; i += 76) {
    lines.push(encoded.slice(i, i + 76))
  }
  return lines.join("\r\n")
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function sendMail(opts: {
  to: string
  subject: string
  text: string
  html?: string
}): Promise<EmailSendResult> {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_PASS
  if (!user || !pass) {
    console.warn("[email] GMAIL_USER / GMAIL_PASS not set — skipping email.")
    return { ok: false, error: "mailer not configured" }
  }

  const socket = await new Promise<tls.TLSSocket>((resolve, reject) => {
    const sock = tls.connect(
      { host: SMTP_HOST, port: SMTP_PORT, servername: SMTP_HOST },
      () => resolve(sock),
    )
    sock.once("error", reject)
  })

  const session = new SmtpSession(socket)

  try {
    const codeOf = (lines: string[]) => parseInt(lines[lines.length - 1]?.slice(0, 3) ?? "", 10)
    const expect = (lines: string[], want: number, what: string) => {
      const code = codeOf(lines)
      if (code !== want) {
        throw new Error(`SMTP ${what} failed (${code}): ${lines.join(" | ")}`)
      }
    }

    // Greeting
    expect(await session.firstReply(), 220, "connect")
    expect(await session.command(`EHLO crewnetusa.local`), 250, "EHLO")

    // AUTH PLAIN (Google app password — spaces are display-only, strip them)
    const authPlain = Buffer.from(`\u0000${user}\u0000${pass.replace(/\s+/g, "")}`, "utf8").toString("base64")
    expect(await session.command(`AUTH PLAIN ${authPlain}`), 235, "authentication")

    // Envelope
    expect(await session.command(`MAIL FROM:<${user}>`), 250, "MAIL FROM")
    expect(await session.command(`RCPT TO:<${opts.to}>`), 250, "RCPT TO")

    // Data
    expect(await session.command("DATA"), 354, "DATA")

    const boundary = `----=_crewnet_${Date.now().toString(36)}`
    const headers = [
      `From: ${site.name} <${user}>`,
      `To: <${opts.to}>`,
      `Subject: ${encodeSubject(opts.subject)}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
    ].join("\r\n")

    const encodePart = (
      contentType: string,
      body: string,
      last = false,
    ): string =>
      [
        `--${boundary}`,
        contentType,
        "Content-Transfer-Encoding: base64",
        "",
        wrapBase64(body),
        "",
        ...(last ? [`--${boundary}--`, ""] : []),
      ].join("\r\n")

    const textPart = encodePart('Content-Type: text/plain; charset="UTF-8"', opts.text)
    const htmlPart = encodePart(
      'Content-Type: text/html; charset="UTF-8"',
      opts.html ?? "",
      true,
    )

    const message = dotStuff(`${headers}${textPart}${htmlPart}`)
    expect(await session.writeData(message + "\r\n.\r\n"), 250, "message delivery")

    await session.command("QUIT").catch(() => undefined)
    session.end()
    console.log(`[email] Notification sent to ${opts.to} — subject: ${opts.subject}`)
    return { ok: true }
  } catch (err) {
    session.end()
    const error = err instanceof Error ? err.message : String(err)
    console.error("[email] Failed to send notification:", error)
    return { ok: false, error }
  }
}

// ---------------------------------------------------------------------------
// Candidate Contractor notification
// ---------------------------------------------------------------------------

export type SubApplicationNotification = {
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

const rowLabel = (label: string, value: string) => `${label}: ${value}`

export async function sendSubApplicationNotification(
  row: SubApplicationNotification,
): Promise<EmailSendResult> {
  const to = process.env.GMAIL_USER
  if (!to) return { ok: false, error: "mailer not configured" }

  const subject = `[${site.name}] New Candidate Contractor: ${row.name} (${row.primaryTrade}, ${row.baseState || "?"})`

  const lines = [
    rowLabel("Type", "CANDIDATE CONTRACTOR"),
    rowLabel("Name", row.name),
    rowLabel("Business", row.businessName || "(not provided)"),
    rowLabel("Phone", row.phone),
    rowLabel("Email", row.email || "(not provided)"),
    rowLabel("Primary Trade", row.primaryTrade),
    rowLabel("Crew Size", row.crewSize),
    rowLabel("Has Liability Insurance", row.hasInsurance),
    rowLabel("Crew Base State", row.baseState || "(not provided)"),
    rowLabel("Base City / Area", row.baseCity || "(not provided)"),
    rowLabel("Base Zip Code", row.baseZip || "(not provided)"),
    rowLabel("Union Status", row.unionStatus || "(not provided)"),
    rowLabel("Workers Comp", row.workersComp || "(not provided)"),
    rowLabel("Liability Limit", row.liabilityLimit || "(not provided)"),
    rowLabel("Equipment Owned", row.equipmentOwned || "(none listed)"),
    rowLabel("Bilingual Foreman", row.bilingualForeman || "(not provided)"),
    rowLabel("Travel Radius", row.travelRadius),
    rowLabel("Applied Via (Source City)", row.sourceCity || "(direct)"),
    rowLabel("Applied Via (Source Trade)", row.sourceTrade || "(generic)"),
    rowLabel("Source URL", row.sourceUrl || "(not captured)"),
    rowLabel("Submitted (UTC)", row.timestamp),
  ]

  const text = `A new CANDIDATE CONTRACTOR just applied to the network:\n\n${lines.join("\n")}\n`
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  const html = `<!DOCTYPE html><html><body style="font-family:Arial,Helvetica,sans-serif;font-size:14px">
    <h2 style="margin-bottom:4px">New Candidate Contractor</h2>
    <p style="margin-top:0;color:#555">A subcontractor application was just recorded.</p>
    <table cellpadding="4" cellspacing="0" style="border-collapse:collapse">
      ${lines
        .map((l) => {
          const [k, ...rest] = l.split(":")
          const v = rest.join(":").trim()
          return `<tr><td style="font-weight:bold;border-bottom:1px solid #eee;padding-right:12px">${esc(k)}</td><td style="border-bottom:1px solid #eee">${esc(v)}</td></tr>`
        })
        .join("\n      ")}
    </table>
    <p style="color:#888;font-size:12px;margin-top:16px">Sent automatically by CrewNetUSA on record creation.</p>
  </body></html>`

  return sendMail({ to, subject, text, html })
}

// ---------------------------------------------------------------------------
// GC crew request notification
// ---------------------------------------------------------------------------

export type GcLeadNotification = {
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

export async function sendGcLeadNotification(
  row: GcLeadNotification,
): Promise<EmailSendResult> {
  const to = process.env.GMAIL_USER
  if (!to) return { ok: false, error: "mailer not configured" }

  const subject = `[${site.name}] New GC Crew Request: ${row.companyName} (${row.trade}, ${row.jobsiteCity}, ${row.jobsiteState})`

  const lines = [
    rowLabel("Type", "GC CREW REQUEST"),
    rowLabel("Company / GC", row.companyName),
    rowLabel("Contact", `${row.name}${row.role ? ` (${row.role})` : ""}`),
    rowLabel("Phone", row.phone),
    rowLabel("Email", row.email || "(not provided)"),
    rowLabel("Trade Needed", row.trade),
    rowLabel("Project Type", row.projectType),
    rowLabel("Crew Size Needed", row.crewSize),
    rowLabel("Jobsite City", row.jobsiteCity || "(not provided)"),
    rowLabel("Jobsite State", row.jobsiteState),
    rowLabel("Jobsite Zip Code", row.jobsiteZip || "(not provided)"),
    rowLabel("Union Labor Required", row.unionLaborRequired || "(not specified)"),
    rowLabel("Workers Comp Required", row.workersCompRequired || "(not provided)"),
    rowLabel("Min. Liability Required", row.minLiabilityRequired || "(not specified)"),
    rowLabel("Equipment Provided by GC", row.equipmentProvidedByGc || "(not specified)"),
    rowLabel("Project Size", row.projectSize || "(not provided)"),
    rowLabel("License #", row.licenseNumber || "(not provided)"),
    rowLabel("Start Timing", row.startTiming),
    rowLabel("Scope / Message", row.message || "(none)"),
    rowLabel("Submitted Via (Source City)", row.sourceCity || "(direct)"),
    rowLabel("Submitted Via (Source Trade)", row.sourceTrade || "(generic)"),
    rowLabel("Source URL", row.sourceUrl || "(not captured)"),
    rowLabel("Submitted (UTC)", row.timestamp),
  ]

  const text = `A general contractor just requested a crew:\n\n${lines.join("\n")}\n`
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  const html = `<!DOCTYPE html><html><body style="font-family:Arial,Helvetica,sans-serif;font-size:14px">
    <h2 style="margin-bottom:4px">New GC Crew Request</h2>
    <p style="margin-top:0;color:#555">A general contractor just requested a subcontractor crew.</p>
    <table cellpadding="4" cellspacing="0" style="border-collapse:collapse">
      ${lines
        .map((l) => {
          const [k, ...rest] = l.split(":")
          const v = rest.join(":").trim()
          return `<tr><td style="font-weight:bold;border-bottom:1px solid #eee;padding-right:12px">${esc(k)}</td><td style="border-bottom:1px solid #eee">${esc(v)}</td></tr>`
        })
        .join("\n      ")}
    </table>
    <p style="color:#888;font-size:12px;margin-top:16px">Sent automatically by CrewNetUSA on record creation.</p>
  </body></html>`

  return sendMail({ to, subject, text, html })
}

// ---------------------------------------------------------------------------
// Candidate Contractor confirmation (auto-reply to the applicant)
// ---------------------------------------------------------------------------

export type SubApplicationConfirmation = {
  name: string
  email: string
}

/** "DAVID" -> "David", "carlos" -> "Carlos", "McDonald" -> "McDonald", "AJ" -> "AJ". */
function smartCase(value: string): string {
  const isAllCaps = value === value.toUpperCase() && /[A-Z]/.test(value)
  if (!isAllCaps) return value.charAt(0).toUpperCase() + value.slice(1)
  return value
    .split(" ")
    .map((word) => {
      if (word.length === 0) return word
      // Keep short initials/acronyms as typed ("AJ", "JJ", "J.")
      if (word.replace(/[^A-Za-z]/g, "").length <= 2) return word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(" ")
}

/**
 * First name for greetings ("Carlos Mendez" -> "Carlos"). Skips a leading
 * initial when a spelled-out given name follows ("J. Carlos Mendez" ->
 * "Carlos") and falls back to the full name when only an initial exists
 * ("J. Smith" -> "J. Smith" rather than "Hey J.").
 */
function greetingNameFrom(fullNameRaw: string): string {
  const fullName = fullNameRaw.trim().replace(/\s+/g, " ")
  const tokens = fullName.split(" ").filter(Boolean)
  const strip = (t: string) => t.replace(/[.,;:]+$/, "")
  let firstToken = strip(tokens[0] ?? "")
  if (firstToken.length === 1 && tokens.length > 2) {
    firstToken = strip(tokens[1] ?? "") || firstToken
  }
  const raw = firstToken.length > 1 ? firstToken : fullName
  return smartCase(raw)
}

/** Greeting name without trailing punctuation, for use inside a sentence. */
function subjectNameFrom(fullNameRaw: string): string {
  return greetingNameFrom(fullNameRaw).replace(/[.,;:]+$/, "")
}

export async function sendSubApplicationConfirmation(
  row: SubApplicationConfirmation,
): Promise<EmailSendResult> {
  const to = row.email.trim()
  if (!to) {
    console.warn(
      "[email] Applicant did not provide an email — skipping confirmation.",
    )
    return { ok: false, error: "applicant email missing" }
  }

  const greetingName = greetingNameFrom(row.name)
  const subjectName = subjectNameFrom(row.name)

  const subject = `We got your info, ${subjectName}. You're in the grid.`

  const text = `Hey ${greetingName},

Confirming we received your application. Your crew is now active in the ${site.name} database.

We only deal with real GCs who have real budgets. The minute a contractor in your market needs your trade, we’ll reach out directly with the job scope and timeline.

Talk soon,

${site.name} Dispatch
${site.url}
`

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

  const html = `<!DOCTYPE html><html><body style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1e1e1e">
    <p>Hey ${esc(greetingName)},</p>
    <p>Confirming we received your application. Your crew is now active in the ${esc(site.name)} database.</p>
    <p>We only deal with real GCs who have real budgets. The minute a contractor in your market needs your trade, we’ll reach out directly with the job scope and timeline.</p>
    <p>Talk soon,</p>
    <p style="margin-bottom:6px"><strong>${esc(site.name)} Dispatch</strong></p>
    <p style="margin-top:0">
      <a href="${site.url}" style="display:inline-block;background:#111827;color:#ffffff;font-weight:bold;padding:12px 20px;border-radius:6px;text-decoration:none">Visit our website</a>
    </p>
    <p style="color:#888;font-size:12px;margin-top:16px">${site.url}</p>
  </body></html>`

  return sendMail({ to, subject, text, html })
}

// ---------------------------------------------------------------------------
// GC crew request confirmation (auto-reply to the general contractor)
// ---------------------------------------------------------------------------

export type GcLeadConfirmation = {
  name: string
  email: string
  trade: string
  jobsiteCity: string
}

export async function sendGcLeadConfirmation(
  row: GcLeadConfirmation,
): Promise<EmailSendResult> {
  const to = row.email.trim()
  if (!to) {
    console.warn(
      "[email] GC did not provide an email — skipping confirmation.",
    )
    return { ok: false, error: "GC email missing" }
  }

  const greetingName = greetingNameFrom(row.name)
  const city = row.jobsiteCity.trim() || "your area"
  const subject = `Crew Request Logged: ${row.trade} in ${city}`

  const signOff = `${site.name}`

  const text = `Hey ${greetingName},

Got your request. My team is currently reviewing our ${city} roster to check availability for your ${row.trade} scope.

The best crews stay busy, so I am running down the schedules of our vetted guys right now to see who has the bandwidth for your start date.

We will follow up with you as soon as we have a qualified crew confirmed and available for your project. If you have any blueprints or specific insurance requirements in the meantime, feel free to reply directly to this email.

Thanks,

Dispatch Team
${signOff}
${site.url}
`

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

  const html = `<!DOCTYPE html><html><body style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1e1e1e">
    <p>Hey ${esc(greetingName)},</p>
    <p>Got your request. My team is currently reviewing our ${esc(city)} roster to check availability for your ${esc(row.trade)} scope.</p>
    <p>The best crews stay busy, so I am running down the schedules of our vetted guys right now to see who has the bandwidth for your start date.</p>
    <p>We will follow up with you as soon as we have a qualified crew confirmed and available for your project. If you have any blueprints or specific insurance requirements in the meantime, feel free to reply directly to this email.</p>
    <p>Thanks,</p>
    <p style="margin-bottom:6px"><strong>Dispatch Team</strong><br />${esc(signOff)}</p>
    <p style="margin-top:0">
      <a href="${site.url}" style="display:inline-block;background:#111827;color:#ffffff;font-weight:bold;padding:12px 20px;border-radius:6px;text-decoration:none">Visit our website</a>
    </p>
    <p style="color:#888;font-size:12px;margin-top:16px">${site.url}</p>
  </body></html>`

  return sendMail({ to, subject, text, html })
}
