"use server"

import { z } from "zod"
import { appendGcLeadToSheet, appendSubApplicationToSheet } from "@/lib/google-sheets"
import { sendGcLeadNotification, sendSubApplicationNotification } from "@/lib/email"
import { crewTypes, servedStates, site } from "@/lib/data"

// ---------------------------------------------------------------------------
// Zod Schemas (Layer 3 — strict validation)
// ---------------------------------------------------------------------------

const phoneRegex = /^\+?[\d\s().-]{10,16}$/
// Blocks URLs and HTML markup but allows ordinary text (e.g. "John Smith").
const noLinksRegex = /^(?!.*(?:https?:\/\/|www\.|<|>|\[|\]))[\s\S]+$/i

const crewSizeValues = ["1-2", "3-5", "6-10", "10+"] as const
const startTimingValues = [
  "ASAP",
  "Within 2 weeks",
  "This month",
  "Date flexible",
] as const

const leadSchema = z.object({
  // Project (Step 1)
  trade: z.enum(crewTypes, { message: "Please select the trade you need." }),
  projectType: z.string().min(1, "Project type is required"),
  jobsiteCity: z
    .string()
    .min(1, "Jobsite city is required")
    .max(80)
    .regex(noLinksRegex, "No links allowed"),
  jobsiteState: z.enum(servedStates, {
    message: "Please select the state where the job is located.",
  }),
  crewSize: z.enum(crewSizeValues, {
    message: "Please select the crew size you need.",
  }),
  startTiming: z.enum(startTimingValues, {
    message: "Please tell us when the work needs to start.",
  }),
  projectSize: z
    .string()
    .max(60)
    .optional()
    .or(z.literal("")),
  // Contact (Step 2)
  companyName: z
    .string()
    .min(2, "Company name is too short")
    .max(150)
    .regex(noLinksRegex, "No links allowed"),
  name: z
    .string()
    .min(2, "Name is too short")
    .max(100)
    .regex(noLinksRegex, "No links allowed"),
  role: z.string().max(40).optional().or(z.literal("")),
  phone: z.string().regex(phoneRegex, "Invalid phone format"),
  email: z.string().email("Invalid email"),
  licenseNumber: z
    .string()
    .max(40)
    .regex(noLinksRegex, "No links allowed")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .max(2000)
    .regex(noLinksRegex, "No links allowed")
    .optional()
    .or(z.literal("")),
  // Hidden source tracking
  sourceCity: z.string().optional().or(z.literal("")),
  sourceTrade: z.string().optional().or(z.literal("")),
  sourceUrl: z.string().optional().or(z.literal("")),
  // Security
  company_url: z.string().optional(),
  formRenderTime: z.string(),
  turnstileToken: z.string().optional(),
})

const subSchema = z.object({
  primaryTrade: z.string().min(1, "Primary trade is required"),
  crewSize: z.string().min(1, "Crew size is required"),
  hasInsurance: z.string().min(1, "Insurance status is required"),
  travelRadius: z.string().min(1, "Travel radius is required"),
  baseState: z.enum(servedStates, {
    message: "Please select the state where your crew is based.",
  }),
  baseCity: z
    .string()
    .max(80)
    .regex(noLinksRegex, "No links allowed")
    .optional()
    .or(z.literal("")),
  name: z
    .string()
    .min(2, "Name is too short")
    .max(100)
    .regex(noLinksRegex, "No links allowed"),
  businessName: z
    .string()
    .max(150)
    .regex(noLinksRegex, "No links allowed")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(phoneRegex, "Invalid phone format")
    .refine((val) => {
      const digits = val.replace(/\D/g, "")
      return digits.length >= 10 && digits.length <= 15
    }, "Please enter a valid 10-digit phone number"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  sourceCity: z.string().optional().or(z.literal("")),
  sourceTrade: z.string().optional().or(z.literal("")),
  sourceUrl: z.string().optional().or(z.literal("")),
  company_url: z.string().optional(),
  formRenderTime: z.string(),
  turnstileToken: z.string().optional(),
})

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------

export type LeadState = {
  status: "idle" | "success" | "error"
  message: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fakeSuccess(): LeadState {
  // Return a success message so bots think they won and move on.
  return {
    status: "success",
    message:
      "Request received. A dispatcher will call you within one business hour with available crews.",
  }
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) {
    // Turnstile not configured — skip verification (dev mode)
    return true
  }

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: secretKey, response: token }),
      },
    )
    const data = await res.json()
    return !!data.success
  } catch {
    // If Cloudflare is unreachable, allow through to avoid blocking real users.
    return true
  }
}

async function postToWebhook(payload: Record<string, unknown>): Promise<boolean> {
  const webhookUrl = process.env.WEBHOOK_URL
  if (!webhookUrl) {
    console.log("[actions] WEBHOOK_URL not set — data:", payload)
    return false
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error(`[actions] Webhook responded with status ${res.status}`)
      return false
    }
    return true
  } catch (err) {
    console.error("[actions] Webhook delivery failed:", err)
    return false
  }
}

// ---------------------------------------------------------------------------
// GC Lead Form (with Turnstile)
// ---------------------------------------------------------------------------

export async function submitLead(
  _prevState: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = leadSchema.safeParse(raw)

  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { status: "error", message: first?.message ?? "Invalid submission data." }
  }

  const { company_url, formRenderTime, turnstileToken, ...clean } =
    parsed.data

  // Layer 1 — Honeypot check
  if (company_url && company_url.length > 0) {
    return fakeSuccess()
  }

  // Layer 4 — Cloudflare Turnstile verification: a verified token is positive
  // proof of a human, so the time-to-fill check must never silently drop them.
  let humanVerified = false
  if (turnstileToken) {
    humanVerified = await verifyTurnstile(turnstileToken)
    if (!humanVerified) {
      return { status: "error", message: "Security verification failed. Please try again." }
    }
  }

  // Layer 2 — Time-to-fill check (only filters unverified, sub-4s submissions)
  const renderTime = parseInt(formRenderTime, 10)
  if (
    !humanVerified &&
    (Number.isNaN(renderTime) || Date.now() - renderTime < 4000)
  ) {
    return fakeSuccess()
  }

  // All checks passed — record the GC lead
  console.log("[actions] ✅ Real GC lead:", clean)
  const row = {
    timestamp: new Date().toISOString(),
    sourceCity: clean.sourceCity ?? "",
    sourceTrade: clean.sourceTrade ?? "",
    sourceUrl: clean.sourceUrl ?? "",
    companyName: clean.companyName,
    name: clean.name,
    role: clean.role ?? "",
    phone: clean.phone,
    email: clean.email ?? "",
    trade: clean.trade,
    projectType: clean.projectType,
    crewSize: clean.crewSize,
    jobsiteCity: clean.jobsiteCity ?? "",
    jobsiteState: clean.jobsiteState,
    projectSize: clean.projectSize ?? "",
    licenseNumber: clean.licenseNumber ?? "",
    startTiming: clean.startTiming,
    message: clean.message ?? "",
  }

  let savedToSheets = false
  try {
    await appendGcLeadToSheet(row)
    savedToSheets = true
  } catch (err) {
    console.error("[actions] Failed to append GC lead to Google Sheets:", err)
  }

  // Backup webhook if configured (returns true only when it actually delivered)
  const deliveredToWebhook = await postToWebhook(
    clean as unknown as Record<string, unknown>,
  )

  // Email notification on record creation (never fails the submission)
  if (savedToSheets) {
    await sendGcLeadNotification(row)
  }

  // Never show a success screen for a lead that was stored nowhere.
  if (!savedToSheets && !deliveredToWebhook) {
    return {
      status: "error",
      message: `We couldn't save your request right now. Please try again in a minute or call ${site.phoneDisplay}.`,
    }
  }

  return {
    status: "success",
    message:
      "Request received. A dispatcher will call you within one business hour with available crews.",
  }
}

// ---------------------------------------------------------------------------
// Subcontractor Application Form (Turnstile when configured — a verified token
// proves a human is present, so the time-to-fill heuristic never drops them)
// ---------------------------------------------------------------------------

export async function submitSubApplication(
  _prevState: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = subSchema.safeParse(raw)

  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { status: "error", message: first?.message ?? "Invalid submission data." }
  }

  const { company_url, formRenderTime, turnstileToken, ...clean } = parsed.data

  // Layer 1 — Honeypot check
  if (company_url && company_url.length > 0) {
    return {
      status: "success",
      message:
        "Application received. We'll verify your details and contact you within one business day.",
    }
  }

  const renderTime = parseInt(formRenderTime, 10)

  // Layer 4 — Cloudflare Turnstile: a verified token is positive proof of a
  // human, so the time-to-fill check below must never silently drop them.
  let humanVerified = false
  if (turnstileToken) {
    humanVerified = await verifyTurnstile(turnstileToken)
    if (!humanVerified) {
      return {
        status: "error",
        message: "Security verification failed. Please try again.",
      }
    }
  }

  // Layer 2 — Time-to-fill check (only filters unverified, sub-4s submissions)
  if (
    !humanVerified &&
    (Number.isNaN(renderTime) || Date.now() - renderTime < 4000)
  ) {
    return {
      status: "success",
      message:
        "Application received. We'll verify your details and contact you within one business day.",
    }
  }

  // All checks passed — deliver to Google Sheets directly
  console.log("[actions] ✅ Real sub application:", clean)
  const row = {
    timestamp: new Date().toISOString(),
    sourceCity: clean.sourceCity ?? "",
    sourceTrade: clean.sourceTrade ?? "",
    sourceUrl: clean.sourceUrl ?? "",
    name: clean.name,
    businessName: clean.businessName ?? "",
    phone: clean.phone,
    email: clean.email ?? "",
    primaryTrade: clean.primaryTrade,
    crewSize: clean.crewSize,
    hasInsurance: clean.hasInsurance,
    travelRadius: clean.travelRadius,
    baseState: clean.baseState,
    baseCity: clean.baseCity ?? "",
  }
  let savedToSheets = false
  try {
    await appendSubApplicationToSheet(row)
    savedToSheets = true
  } catch (err) {
    console.error("[actions] Failed to append sub application to Google Sheets:", err)
  }

  // Email notification on record creation (never fails the submission)
  if (savedToSheets) {
    await sendSubApplicationNotification(row)
  }

  // Backup webhook if configured (returns true only when it actually delivered)
  const deliveredToWebhook = await postToWebhook(
    clean as unknown as Record<string, unknown>,
  )

  // Never show a success screen for a row that was stored nowhere.
  if (!savedToSheets && !deliveredToWebhook) {
    return {
      status: "error",
      message: `We couldn't save your application right now. Please try again in a minute or call ${site.phoneDisplay}.`,
    }
  }

  return {
    status: "success",
    message:
      "Application received. We'll verify your details and contact you within one business day with available GC opportunities in your area.",
  }
}