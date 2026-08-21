"use client"

import { useActionState, useState } from "react"
import { CircleCheckBig, Phone } from "lucide-react"
import { submitLead, type LeadState } from "@/app/actions"
import { site } from "@/lib/data"
import { Turnstile } from "@marsidev/react-turnstile"

const initialState: LeadState = { status: "idle", message: "" }

const fieldClass =
  "h-12 w-full rounded-md border border-input bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"

export function LeadForm({
  trade,
  city,
  projectTypes,
  heading = "Request a Crew",
  subheading = "Response within 1 business hour.",
}: {
  trade?: string
  city?: string
  projectTypes?: string[]
  heading?: string
  subheading?: string
}) {
  const [state, formAction, pending] = useActionState(submitLead, initialState)
  const [renderTime] = useState(() => Date.now())
  const [turnstileToken, setTurnstileToken] = useState("")

  const options = projectTypes ?? [
    "Single-family residential",
    "Multifamily / Apartments",
    "Commercial build-out",
    "Remodel / Addition",
    "Repair / Service",
  ]

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  if (state.status === "success") {
    return (
      <div
        id="request-crew"
        className="rounded-lg border-2 border-accent bg-card p-6 shadow-lg sm:p-8"
        aria-live="polite"
      >
        <CircleCheckBig className="mb-4 h-10 w-10 text-accent" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-foreground">Request received</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">{state.message}</p>
        <a
          href={site.phoneHref}
          className="mt-6 flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 font-bold text-primary-foreground"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          Need it today? Call {site.phoneDisplay}
        </a>
      </div>
    )
  }

  return (
    <div id="request-crew" className="rounded-lg border border-border bg-card p-6 shadow-xl sm:p-8">
      <h2 className="text-2xl font-bold text-card-foreground">{heading}</h2>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{subheading}</p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        {trade ? <input type="hidden" name="trade" value={trade} /> : null}
        {city ? <input type="hidden" name="city" value={city} /> : null}

        {/* Layer 2 — Timestamp hidden field */}
        <input type="hidden" name="formRenderTime" value={renderTime} />

        {/* Layer 1 — Honeypot field (visually hidden, bots fill it) */}
        <input
          type="text"
          name="company_url"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-bold text-foreground">
            Name
          </label>
          <input id="name" name="name" required autoComplete="name" className={fieldClass} placeholder="Full name" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-bold text-foreground">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            className={fieldClass}
            placeholder="(555) 000-0000"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-bold text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
            placeholder="you@company.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="projectType" className="text-sm font-bold text-foreground">
            Project Type
          </label>
          <select id="projectType" name="projectType" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select project type
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-sm font-bold text-foreground">
            Scope / Message <span className="font-medium text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            className="w-full rounded-md border border-input bg-background p-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
            placeholder="Square footage, start date, crew size needed…"
          />
        </div>

        {/* Layer 4 — Cloudflare Turnstile (invisible, only if configured) */}
        {turnstileSiteKey ? (
          <>
            <input type="hidden" name="turnstileToken" value={turnstileToken} />
            <Turnstile
              siteKey={turnstileSiteKey}
              options={{ size: "invisible" }}
              onSuccess={(token) => {
                setTurnstileToken(token)
              }}
              onExpire={() => {
                setTurnstileToken("")
              }}
            />
          </>
        ) : null}

        {state.status === "error" ? (
          <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="h-14 w-full rounded-md bg-accent text-lg font-bold text-accent-foreground transition-colors hover:brightness-95 disabled:opacity-70"
        >
          {pending ? "Sending…" : "Find Available Crews"}
        </button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          No spam. No bidding wars. We connect you directly with vetted crews.
        </p>
      </form>
    </div>
  )
}