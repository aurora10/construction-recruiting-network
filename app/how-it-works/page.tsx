import type { Metadata } from "next"
import Link from "next/link"
import { ClipboardList, Search, PenTool, HardHat, DollarSign } from "lucide-react"

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Submit a crew request, get matched with a vetted subcontractor, sign a direct subcontract, and work begins. Learn how CrewBridge's flat finder's fee works — no subscription, no per-lead charges.",
  alternates: { canonical: "/how-it-works" },
}

const steps = [
  {
    step: 1,
    icon: ClipboardList,
    title: "Request a Crew",
    body: "Tell us the trade, crew size, project type, and target start date. One form, 60 seconds — no account required.",
  },
  {
    step: 2,
    icon: Search,
    title: "We Match You",
    body: "Our team reviews your scope and checks availability against our pre-vetted roster. We only send you crews that are licensed, insured, and have capacity for your timeline.",
  },
  {
    step: 3,
    icon: PenTool,
    title: "You Sign the Sub",
    body: "If you approve the match, you contract directly with the subcontractor on your own terms. CrewBridge is not a party to your subcontract — we simply make the introduction.",
  },
  {
    step: 4,
    icon: HardHat,
    title: "Work Begins",
    body: "The crew arrives on site and starts production. We follow up after placement to confirm everything went smoothly. If it didn't, we make it right.",
  },
]

export default function HowItWorksPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <h1 className="text-4xl font-black tracking-tight text-foreground text-balance sm:text-5xl">
        Four steps from request to boots on the ground.
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        CrewBridge is not a job board and not a staffing agency. It's a pre-vetted network. You submit what you need, we
        match you with a qualified crew, and you contract directly with them. Here's exactly how it works.
      </p>

      {/* Timeline */}
      <div className="mt-14 relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-accent/30 hidden sm:block" aria-hidden="true" />

        <ol className="flex flex-col gap-10">
          {steps.map(({ step, icon: Icon, title, body }) => (
            <li key={step} className="relative flex gap-6">
              {/* Step number circle */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-base font-black text-accent-foreground shadow-sm">
                {step}
              </div>
              <div className="min-w-0 pt-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h2 className="text-xl font-bold text-foreground">{title}</h2>
                </div>
                <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Finder's Fee Explanation */}
      <section className="mt-16 rounded-lg border border-border bg-background p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
            <DollarSign className="h-5 w-5 text-accent" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">How the finder's fee works</h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-bold text-foreground">You pay only on placement</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              There is no subscription, no monthly retainer, and no charge to submit a request. CrewBridge earns a flat
              finder's fee only when a crew is successfully placed on your project and work begins.
            </p>
          </div>

          <div className="rounded-md border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-bold text-foreground">Flat fee, no surprises</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The finder's fee is a one-time, flat amount agreed upon before the match is finalized. You know the cost
              upfront. There are no percentage-based markups, no hidden add-ons, and no recurring charges.
            </p>
          </div>

          <div className="rounded-md border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-bold text-foreground">You contract directly with the crew</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              CrewBridge is not a middleman in your subcontract. You set your own rates, terms, and scope with the crew.
              We simply make the connection and confirm that both parties are satisfied after placement.
            </p>
          </div>

          <div className="rounded-md border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-bold text-foreground">Free for subcontractors</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Subcontractors pay nothing to join or stay in the network. There are no per-lead fees for crews, no bidding
              wars, and no commission taken from their contract. The GC covers the finder's fee.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 rounded-lg border border-accent/30 bg-accent/5 p-8 text-center">
        <h2 className="text-xl font-black tracking-tight text-foreground">
          Ready to try it?
        </h2>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          Submit a request now — it takes 60 seconds and costs nothing to get matched.
        </p>
        <Link
          href="/#request-crew"
          className="mt-5 inline-flex h-12 items-center rounded-md bg-accent px-6 font-bold text-accent-foreground transition-colors hover:brightness-95"
        >
          Request a Crew
        </Link>
      </section>
    </article>
  )
}