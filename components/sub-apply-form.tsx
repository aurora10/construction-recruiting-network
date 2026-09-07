"use client"

import { useActionState, useEffect, useState } from "react"
import { ArrowRight, CircleCheckBig, MessageCircle } from "lucide-react"
import { submitSubApplication, type LeadState } from "@/app/actions"
import { servedStateNames, servedStates, site } from "@/lib/data"
import { Turnstile } from "@marsidev/react-turnstile"

const initialState: LeadState = { status: "idle", message: "" }

const fieldClass =
  "h-12 w-full rounded-md border border-input bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"

const tradeOptions = [
  "Framing",
  "Drywall",
  "Electrical",
  "Plumbing",
  "Concrete",
  "Roofing",
  "Painting",
  "HVAC",
]

const crewSizeOptions = ["1-2", "3-5", "6-10", "10+"]
const insuranceOptions = ["Yes", "No"]
const travelRadiusOptions = ["Local Only", "Statewide"]

function matchInitialTrade(tradeProp?: string): string {
  if (!tradeProp) return ""
  const found = tradeOptions.find((t) =>
    tradeProp.toLowerCase().includes(t.toLowerCase()),
  )
  return found ?? ""
}

export function SubApplyForm({
  trade,
  city,
  siteKey,
  heading = "Apply to the Network",
  subheading = "Verification typically takes 2 business days.",
}: {
  trade?: string
  city?: string
  siteKey?: string
  heading?: string
  subheading?: string
}) {
  const [state, formAction, pending] = useActionState(submitSubApplication, initialState)
  const [renderTime, setRenderTime] = useState("")
  const [sourceUrl, setSourceUrl] = useState("")
  const [turnstileToken, setTurnstileToken] = useState("")

  const [step, setStep] = useState<1 | 2>(1)
  const [primaryTrade, setPrimaryTrade] = useState(() => matchInitialTrade(trade))
  const [crewSize, setCrewSize] = useState("")
  const [hasInsurance, setHasInsurance] = useState("")
  const [baseState, setBaseState] = useState("")
  const [baseCity, setBaseCity] = useState("")
  const [travelRadius, setTravelRadius] = useState("")
  const [step1Error, setStep1Error] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    // Stamp client-side only (slightly deferred) so SSR and hydration HTML match
    // — no "Prop `value` did not match" hydration warnings on the hidden input.
    const id = window.setTimeout(() => {
      setRenderTime(String(Date.now()))
      setSourceUrl(window.location.href)
    }, 0)
    return () => window.clearTimeout(id)
  }, [])

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!primaryTrade) {
      setStep1Error("Please select your primary trade.")
      return
    }
    if (!crewSize) {
      setStep1Error("Please select your crew size.")
      return
    }
    if (!hasInsurance) {
      setStep1Error("Please indicate if you have liability insurance.")
      return
    }
    if (!baseState) {
      setStep1Error("Please select the state where your crew is based.")
      return
    }
    if (!travelRadius) {
      setStep1Error("Please select your travel radius.")
      return
    }
    setStep1Error("")
    setStep(2)
  }

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
          href={site.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Have questions? Chat on WhatsApp
        </a>
      </div>
    )
  }

  return (
    <div id="sub-apply" className="rounded-lg border border-border bg-card p-6 shadow-xl sm:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-card-foreground">{heading}</h2>
        <p className="text-sm font-medium text-muted-foreground">{subheading}</p>
      </div>

      {/* 2-Step Progress Indicator */}
      <div className="mt-4 border-t border-border/60 pt-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className={step === 1 ? "font-bold text-accent" : "text-foreground"}>
            Step 1: Crew Details
          </span>
          <span className={step === 2 ? "font-bold text-accent" : "text-muted-foreground"}>
            Step 2: Contact Info
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-accent transition-all duration-300 ease-in-out"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>
      </div>

      <form action={formAction} className="mt-5 flex flex-col gap-4">
        {/* Hidden Fields for Source Tracking */}
        <input type="hidden" name="sourceCity" value={city ?? ""} />
        <input type="hidden" name="sourceTrade" value={trade ?? ""} />
        <input type="hidden" name="sourceUrl" value={sourceUrl} />

        {/* Security Measures: Timestamp & Honeypot */}
        <input type="hidden" name="formRenderTime" value={renderTime} />
        <input
          type="text"
          name="company_url"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {/* Layer 4 — Cloudflare Turnstile (invisible, only if a site key is passed).
            A verified token lets the server treat this submission as human
            and skip the time-to-fill heuristic — no silent drops of real users. */}
        {siteKey ? (
          <>
            <input type="hidden" name="turnstileToken" value={turnstileToken} />
            <Turnstile
              siteKey={siteKey}
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

        {/* STEP 1: Crew Details */}
        <div className={step === 1 ? "flex flex-col gap-4" : "hidden"}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sub-primaryTrade" className="text-sm font-bold text-foreground">
              Primary Trade
            </label>
            <select
              id="sub-primaryTrade"
              name="primaryTrade"
              value={primaryTrade}
              onChange={(e) => {
                setPrimaryTrade(e.target.value)
                setStep1Error("")
              }}
              required={step === 1}
              className={fieldClass}
            >
              <option value="" disabled>
                Select trade
              </option>
              {tradeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sub-crewSize" className="text-sm font-bold text-foreground">
              Crew Size
            </label>
            <select
              id="sub-crewSize"
              name="crewSize"
              value={crewSize}
              onChange={(e) => {
                setCrewSize(e.target.value)
                setStep1Error("")
              }}
              required={step === 1}
              className={fieldClass}
            >
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sub-hasInsurance" className="text-sm font-bold text-foreground">
              General Liability Insurance
            </label>
            <select
              id="sub-hasInsurance"
              name="hasInsurance"
              value={hasInsurance}
              onChange={(e) => {
                setHasInsurance(e.target.value)
                setStep1Error("")
              }}
              required={step === 1}
              className={fieldClass}
            >
              <option value="" disabled>
                Do you carry liability insurance?
              </option>
              {insuranceOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "Yes" ? "Yes — Active Policy" : "No — Not Currently"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sub-baseState" className="text-sm font-bold text-foreground">
              Crew Base State
            </label>
            <select
              id="sub-baseState"
              name="baseState"
              value={baseState}
              onChange={(e) => {
                setBaseState(e.target.value)
                setStep1Error("")
              }}
              required={step === 1}
              className={fieldClass}
            >
              <option value="" disabled>
                Select your crew's home state
              </option>
              {servedStates.map((code) => (
                <option key={code} value={code}>
                  {servedStateNames[code]} ({code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sub-baseCity"
              className="text-sm font-bold text-foreground"
            >
              Base City / Area{" "}
              <span className="font-medium text-muted-foreground">(optional)</span>
            </label>
            <input
              id="sub-baseCity"
              name="baseCity"
              maxLength={80}
              autoComplete="address-level2"
              className={fieldClass}
              placeholder="e.g., Raleigh"
              onChange={(e) => {
                setBaseCity(e.target.value)
                setStep1Error("")
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sub-travelRadius" className="text-sm font-bold text-foreground">
              Travel Radius
            </label>
            <select
              id="sub-travelRadius"
              name="travelRadius"
              value={travelRadius}
              onChange={(e) => {
                setTravelRadius(e.target.value)
                setStep1Error("")
              }}
              required={step === 1}
              className={fieldClass}
            >
              <option value="" disabled>
                Select travel radius
              </option>
              {travelRadiusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {step1Error ? (
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive">
              {step1Error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleNext}
            className="mt-1 flex h-14 w-full items-center justify-center gap-2 rounded-md bg-accent text-lg font-bold text-accent-foreground transition-colors hover:brightness-95"
          >
            Next: Contact Info
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* STEP 2: Contact Info */}
        <div className={step === 2 ? "flex flex-col gap-4" : "hidden"}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sub-name" className="text-sm font-bold text-foreground">
              Full Name <span className="text-xs font-normal text-muted-foreground">(Foreman / Owner)</span>
            </label>
            <input
              id="sub-name"
              name="name"
              required={step === 2}
              autoComplete="name"
              className={fieldClass}
              placeholder="First and last name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sub-businessName" className="text-sm font-bold text-foreground">
              Business Name <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="sub-businessName"
              name="businessName"
              autoComplete="organization"
              className={fieldClass}
              placeholder="Company or LLC name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sub-phone" className="text-sm font-bold text-foreground">
              Mobile Phone
            </label>
            <input
              id="sub-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              required={step === 2}
              autoComplete="tel"
              className={fieldClass}
              placeholder="(555) 000-0000"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sub-email" className="text-sm font-bold text-foreground">
              Email Address <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="sub-email"
              name="email"
              type="email"
              autoComplete="email"
              className={fieldClass}
              placeholder="name@company.com"
            />
          </div>

          {state.status === "error" ? (
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive">
              {state.message}
            </p>
          ) : null}

          <div className="mt-1 flex flex-col gap-3">
            <button
              type="submit"
              disabled={pending}
              className="h-14 w-full rounded-md bg-accent text-lg font-bold text-accent-foreground transition-colors hover:brightness-95 disabled:opacity-70"
            >
              {pending ? "Submitting Application…" : "Submit Application"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1)
                setStep1Error("")
              }}
              className="text-center text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to Crew Details
            </button>
          </div>
        </div>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          No lead fees. No bidding wars. GCs come directly to you with verified scopes.
        </p>
      </form>
    </div>
  )
}