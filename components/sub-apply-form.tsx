"use client"

import { useActionState, useState } from "react"
import { CircleCheckBig, Phone } from "lucide-react"
import { submitSubApplication, type LeadState } from "@/app/actions"
import { site } from "@/lib/data"

const initialState: LeadState = { status: "idle", message: "" }

const fieldClass =
  "h-12 w-full rounded-md border border-input bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"

const crewSizeOptions = ["1-2", "3-5", "6-10", "10+"]
const insuranceOptions = ["$500K", "$1M", "$2M", "$5M+", "Working on it"]

export function SubApplyForm({
  trade,
  city,
  heading = "Apply for Opportunities",
  subheading = "Join our free network and let GCs find you.",
}: {
  trade?: string
  city?: string
  heading?: string
  subheading?: string
}) {
  const [state, formAction, pending] = useActionState(submitSubApplication, initialState)
  const [renderTime] = useState(() => Date.now())

  if (state.status === "success") {
    return (
      <div
        id="sub-apply"
        className="rounded-lg border-2 border-accent bg-card p-6 shadow-lg sm:p-8"
        aria-live="polite"
      >
        <CircleCheckBig className="mb-4 h-10 w-10 text-accent" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-foreground">Application Received</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">{state.message}</p>
        <a
          href={site.phoneHref}
          className="mt-6 flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 font-bold text-primary-foreground"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          Have questions? Call {site.phoneDisplay}
        </a>
      </div>
    )
  }

  return (
    <div id="sub-apply" className="rounded-lg border border-border bg-card p-6 shadow-xl sm:p-8">
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
          <label htmlFor="apply-name" className="text-sm font-bold text-foreground">
            Full Name
          </label>
          <input
            id="apply-name"
            name="name"
            required
            autoComplete="name"
            className={fieldClass}
            placeholder="Your full name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="apply-crewSize" className="text-sm font-bold text-foreground">
            Crew Size
          </label>
          <select id="apply-crewSize" name="crewSize" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select crew size
            </option>
            {crewSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="apply-insurance" className="text-sm font-bold text-foreground">
            General Liability Insurance
          </label>
          <select id="apply-insurance" name="insurance" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select coverage level
            </option>
            {insuranceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

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
          {pending ? "Submitting…" : "Join the Network — Free"}
        </button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          No lead fees. No bidding wars. GCs come directly to you with verified scopes.
        </p>
      </form>
    </div>
  )
}