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
      `From: CrewNetUSA <${user}>`,
      `To: <${opts.to}>`,
      `Subject: ${encodeSubject(opts.subject)}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
    ].join("\r\n")

    const textPart = [
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: 7bit",
      "",
      opts.text,
      "",
    ].join("\r\n")

    const htmlPart = [
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      "Content-Transfer-Encoding: 7bit",
      "",
      opts.html ?? "",
      "",
      `--${boundary}--`,
      "",
    ].join("\r\n")

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
