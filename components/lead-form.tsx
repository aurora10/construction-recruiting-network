"use client"

import { useActionState, useEffect, useState } from "react"
import { ArrowRight, CircleCheckBig, Phone } from "lucide-react"
import { submitLead, type LeadState } from "@/app/actions"
import {
  crewTypes,
  servedStateNames,
  servedStates,
  site,
} from "@/lib/data"
import { Turnstile } from "@marsidev/react-turnstile"

const initialState: LeadState = { status: "idle", message: "" }

const fieldClass =
  "h-12 w-full rounded-md border border-input bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"

const crewSizeOptions = ["1-2", "3-5", "6-10", "10+"]
const startTimingOptions = ["ASAP", "Within 2 weeks", "This month", "Date flexible"]
const projectSizeOptions = ["Under $5K", "$5K – $25K", "$25K – $100K", "$100K+", "Not sure yet"]
const roleOptions = ["Owner", "Project Manager", "Superintendent", "Estimator", "Other"]

const defaultProjectTypes = [
  "Single-family residential",
  "Multifamily / Apartments",
  "Commercial build-out",
  "Remodel / Addition",
  "Repair / Service",
]

/** "Framing Subcontractors" -> "Framing"; matches the crew types select. */
function matchCrewType(tradeProp?: string): string {
  if (!tradeProp) return ""
  return (
    crewTypes.find((t) => tradeProp.toLowerCase().includes(t.toLowerCase())) ?? ""
  )
}

/** "Raleigh, NC" -> { city: "Raleigh", state: "NC" } */
function jobsiteFromCityProp(cityProp?: string): {
  city: string
  state: string
} {
  if (!cityProp) return { city: "", state: "" }
  const parts = cityProp.split(",").map((p) => p.trim())
  const city = parts[0] ?? ""
  const state = parts[1] ?? ""
  return {
    city,
    state: (servedStates as readonly string[]).includes(state) ? state : "",
  }
}

export function LeadForm({
  trade,
  city,
  projectTypes,
  siteKey,
  heading = "Request a Crew",
  subheading = "Response within 1 business hour.",
}: {
  trade?: string
  city?: string
  projectTypes?: string[]
  siteKey?: string
  heading?: string
  subheading?: string
}) {
  const [state, formAction, pending] = useActionState(submitLead, initialState)
  const [renderTime, setRenderTime] = useState("")
  const [sourceUrl, setSourceUrl] = useState("")
  const [turnstileToken, setTurnstileToken] = useState("")

  const initialJobsite = jobsiteFromCityProp(city)
  const [step, setStep] = useState<1 | 2>(1)
  const [step1Error, setStep1Error] = useState("")

  // Step 1 — Project
  const [tradeValue, setTradeValue] = useState(() => matchCrewType(trade))
  const [projectType, setProjectType] = useState("")
  const [jobsiteCity, setJobsiteCity] = useState(() => initialJobsite.city)
  const [jobsiteState, setJobsiteState] = useState(() => initialJobsite.state)
  const [crewSize, setCrewSize] = useState("")
  const [startTiming, setStartTiming] = useState("")
  const [projectSize, setProjectSize] = useState("")

  // Step 2 — Contact
  const [companyName, setCompanyName] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")

  const options = projectTypes ?? defaultProjectTypes

  useEffect(() => {
    if (typeof window === "undefined") return
    // Stamp client-side only (deferred) so SSR/hydration HTML match.
    const id = window.setTimeout(() => {
      setRenderTime(String(Date.now()))
      setSourceUrl(window.location.href)
    }, 0)
    return () => window.clearTimeout(id)
  }, [])

  const clearError = () => setStep1Error("")

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!tradeValue) {
      setStep1Error("Please select the trade you need.")
      return
    }
    if (!projectType) {
      setStep1Error("Please select the project type.")
      return
    }
    if (!jobsiteCity.trim()) {
      setStep1Error("Please enter the city where the job is located.")
      return
    }
    if (!jobsiteState) {
      setStep1Error("Please select the state where the job is located.")
      return
    }
    if (!crewSize) {
      setStep1Error("Please select the crew size you need.")
      return
    }
    if (!startTiming) {
      setStep1Error("Please tell us when the work needs to start.")
      return
    }
    setStep1Error("")
    setStep(2)
  }

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
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-card-foreground">{heading}</h2>
        <p className="text-sm font-medium text-muted-foreground">{subheading}</p>
      </div>

      {/* 2-Step Progress Indicator */}
      <div className="mt-4 border-t border-border/60 pt-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className={step === 1 ? "font-bold text-accent" : "text-foreground"}>
            Step 1: Project
          </span>
          <span className={step === 2 ? "font-bold text-accent" : "text-muted-foreground"}>
            Step 2: Your Contact Info
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
        {/* Hidden source-tracking fields */}
        <input type="hidden" name="sourceCity" value={city ?? ""} />
        <input type="hidden" name="sourceTrade" value={trade ?? ""} />
        <input type="hidden" name="sourceUrl" value={sourceUrl} />

        {/* Security measures: timestamp + honeypot */}
        <input type="hidden" name="formRenderTime" value={renderTime} />
        <input
          type="text"
          name="company_url"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {/* Cloudflare Turnstile (invisible, only if a site key is passed) */}
        {siteKey ? (
          <>
            <input type="hidden" name="turnstileToken" value={turnstileToken} />
            <Turnstile
              siteKey={siteKey}
              options={{ size: "invisible" }}
              onSuccess={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken("")}
            />
          </>
        ) : null}

        {/* STEP 1: Project */}
        <div className={step === 1 ? "flex flex-col gap-4" : "hidden"}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="gc-trade" className="text-sm font-bold text-foreground">
              Trade Needed
            </label>
            <select
              id="gc-trade"
              name="trade"
              value={tradeValue}
              onChange={(e) => {
                setTradeValue(e.target.value)
                clearError()
              }}
              required={step === 1}
              className={fieldClass}
            >
              <option value="" disabled>
                Select the crew type you need
              </option>
              {crewTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="gc-projectType" className="text-sm font-bold text-foreground">
              Project Type
            </label>
            <select
              id="gc-projectType"
              name="projectType"
              value={projectType}
              onChange={(e) => {
                setProjectType(e.target.value)
                clearError()
              }}
              required={step === 1}
              className={fieldClass}
            >
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="gc-jobsiteCity" className="text-sm font-bold text-foreground">
              Jobsite City
            </label>
            <input
              id="gc-jobsiteCity"
              name="jobsiteCity"
              maxLength={80}
              autoComplete="address-level2"
              className={fieldClass}
              placeholder="Where is the job?"
              value={jobsiteCity}
              onChange={(e) => {
                setJobsiteCity(e.target.value)
                clearError()
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="gc-jobsiteState" className="text-sm font-bold text-foreground">
              Jobsite State
            </label>
            <select
              id="gc-jobsiteState"
              name="jobsiteState"
              value={jobsiteState}
              onChange={(e) => {
                setJobsiteState(e.target.value)
                clearError()
              }}
              required={step === 1}
              className={fieldClass}
            >
              <option value="" disabled>
                Select state
              </option>
              {servedStates.map((code) => (
                <option key={code} value={code}>
                  {servedStateNames[code]} ({code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="gc-crewSize" className="text-sm font-bold text-foreground">
              Crew Size Needed
            </label>
            <select
              id="gc-crewSize"
              name="crewSize"
              value={crewSize}
              onChange={(e) => {
                setCrewSize(e.target.value)
                clearError()
              }}
              required={step === 1}
              className={fieldClass}
            >
              <option value="" disabled>
                How many crew members?
              </option>
              {crewSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="gc-startTiming" className="text-sm font-bold text-foreground">
              When Does the Work Start?
            </label>
            <select
              id="gc-startTiming"
              name="startTiming"
              value={startTiming}
              onChange={(e) => {
                setStartTiming(e.target.value)
                clearError()
              }}
              required={step === 1}
              className={fieldClass}
            >
              <option value="" disabled>
                Select timing
              </option>
              {startTimingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="gc-projectSize"
              className="text-sm font-bold text-foreground"
            >
              Rough Project Size{" "}
              <span className="font-medium text-muted-foreground">(optional)</span>
            </label>
            <select
              id="gc-projectSize"
              name="projectSize"
              value={projectSize}
              onChange={(e) => {
                setProjectSize(e.target.value)
                clearError()
              }}
              className={fieldClass}
            >
              <option value="">Optional — skip</option>
              {projectSizeOptions.map((option) => (
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
            Next: Your Contact Info
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* STEP 2: Contact */}
        <div className={step === 2 ? "flex flex-col gap-4" : "hidden"}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="gc-companyName" className="text-sm font-bold text-foreground">
              Company / GC Name
            </label>
            <input
              id="gc-companyName"
              name="companyName"
              required={step === 2}
              autoComplete="organization"
              className={fieldClass}
              placeholder="Your company or LLC name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="gc-name" className="text-sm font-bold text-foreground">
              Your Name
            </label>
            <input
              id="gc-name"
              name="name"
              required={step === 2}
              autoComplete="name"
              className={fieldClass}
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="gc-role"
              className="text-sm font-bold text-foreground"
            >
              Your Role{" "}
              <span className="font-medium text-muted-foreground">(optional)</span>
            </label>
            <select
              id="gc-role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={fieldClass}
            >
              <option value="">Select role (optional)</option>
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="gc-phone" className="text-sm font-bold text-foreground">
              Phone
            </label>
            <input
              id="gc-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              required={step === 2}
              autoComplete="tel"
              className={fieldClass}
              placeholder="(555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="gc-email" className="text-sm font-bold text-foreground">
              Email
            </label>
            <input
              id="gc-email"
              name="email"
              type="email"
              required={step === 2}
              autoComplete="email"
              className={fieldClass}
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="gc-licenseNumber"
              className="text-sm font-bold text-foreground"
            >
              License #{" "}
              <span className="font-medium text-muted-foreground">(optional)</span>
            </label>
            <input
              id="gc-licenseNumber"
              name="licenseNumber"
              maxLength={40}
              className={fieldClass}
              placeholder="e.g., NC-GL-12345"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="gc-message"
              className="text-sm font-bold text-foreground"
            >
              Scope / Details{" "}
              <span className="font-medium text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="gc-message"
              name="message"
              rows={3}
              className="w-full rounded-md border border-input bg-background p-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="Square footage, materials provided, access notes, multiple trades…"
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
              {pending ? "Sending…" : "Find Available Crews"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1)
                setStep1Error("")
              }}
              className="text-center text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to Project Details
            </button>
          </div>
        </div>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          No spam. No bidding wars. We connect you directly with vetted crews.
        </p>
      </form>
    </div>
  )
}
