"use server"

import { z } from "zod"

// ---------------------------------------------------------------------------
// Zod Schemas (Layer 3 — strict validation)
// ---------------------------------------------------------------------------

const phoneRegex = /^[0-9\-\+\s\(\)]{10,15}$/
const noLinksRegex = /^[^<>\[\]http]+$/i

const leadSchema = z.object({
  name: z
    .string()
    .min(2, "Name is too short")
    .max(100)
    .regex(noLinksRegex, "No links allowed"),
  phone: z.string().regex(phoneRegex, "Invalid phone format"),
  email: z.string().email("Invalid email"),
  trade: z.string().optional(),
  city: z.string().optional(),
  projectType: z.string().min(1, "Project type is required"),
  message: z
    .string()
    .max(2000)
    .regex(noLinksRegex, "No links allowed")
    .optional()
    .or(z.literal("")),
  company_url: z.string().optional(),
  formRenderTime: z.string(),
  turnstileToken: z.string().optional(),
})

const subSchema = z.object({
  name: z
    .string()
    .min(2, "Name is too short")
    .max(100)
    .regex(noLinksRegex, "No links allowed"),
  crewSize: z.string().min(1, "Crew size is required"),
  insurance: z.string().min(1, "Insurance level is required"),
  trade: z.string().optional(),
  city: z.string().optional(),
  company_url: z.string().optional(),
  formRenderTime: z.string(),
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

async function postToWebhook(payload: Record<string, unknown>): Promise<void> {
  const webhookUrl = process.env.WEBHOOK_URL
  if (!webhookUrl) {
    console.log("[actions] WEBHOOK_URL not set — data:", payload)
    return
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error("[actions] Webhook delivery failed:", err)
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

  // Layer 2 — Time-to-fill check (must be >= 4 seconds)
  const renderTime = parseInt(formRenderTime, 10)
  if (Number.isNaN(renderTime) || Date.now() - renderTime < 4000) {
    return fakeSuccess()
  }

  // Layer 4 — Cloudflare Turnstile verification
  if (turnstileToken) {
    const ok = await verifyTurnstile(turnstileToken)
    if (!ok) {
      return { status: "error", message: "Security verification failed. Please try again." }
    }
  }

  // All checks passed — deliver to webhook
  console.log("[actions] ✅ Real GC lead:", clean)
  await postToWebhook(clean as unknown as Record<string, unknown>)

  return {
    status: "success",
    message:
      "Request received. A dispatcher will call you within one business hour with available crews.",
  }
}

// ---------------------------------------------------------------------------
// Subcontractor Application Form (no Turnstile — subs are lower spam risk)
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

  const { company_url, formRenderTime, ...clean } = parsed.data

  // Layer 1 — Honeypot check
  if (company_url && company_url.length > 0) {
    return {
      status: "success",
      message:
        "Application received. We'll verify your details and contact you within one business day.",
    }
  }

  // Layer 2 — Time-to-fill check
  const renderTime = parseInt(formRenderTime, 10)
  if (Number.isNaN(renderTime) || Date.now() - renderTime < 4000) {
    return {
      status: "success",
      message:
        "Application received. We'll verify your details and contact you within one business day.",
    }
  }

  // All checks passed — deliver to webhook
  console.log("[actions] ✅ Real sub application:", clean)
  await postToWebhook(clean as unknown as Record<string, unknown>)

  return {
    status: "success",
    message:
      "Application received. We'll verify your details and contact you within one business day with available GC opportunities in your area.",
  }
}