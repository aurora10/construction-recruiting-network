import type { Metadata } from "next"
import { CircleCheckBig } from "lucide-react"
import { Hero } from "@/components/hero"
import { LeadForm } from "@/components/lead-form"
import { trades } from "@/lib/data"

export const metadata: Metadata = {
  title: "Join the Subcontractor Network",
  description:
    "Independent trade crews: get sent qualified work from vetted general contractors in your market. No lead fees, no bidding wars.",
  alternates: { canonical: "/join-network" },
}

const benefits = [
  "Qualified GC requests sent straight to your phone",
  "No pay-per-lead fees and no bidding wars",
  "You set your own rates and contract directly",
  "Verified scope and start dates before you drive out",
]

export default function JoinNetworkPage() {
  return (
    <>
      <Hero
        eyebrow="For subcontractors"
        heading={
          <>
            Keep your crew <span className="text-accent">booked solid</span>.
          </>
        }
        subheading="Join the network and we'll send you qualified requests from general contractors in your market. Free to join — we verify your license and insurance once, then start routing work."
        aside={
          <LeadForm
            heading="Apply to the Network"
            subheading="Verification typically takes 2 business days."
            projectTypes={trades.map((trade) => trade.name)}
          />
        }
      />

      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-black tracking-tight text-foreground text-balance">
            What crews in the network get
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-lg leading-relaxed text-foreground">
                <CircleCheckBig className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
          <p className="mt-8 leading-relaxed text-muted-foreground">
            To be listed you must hold an active trade license where required, carry general liability coverage, and
            provide at least two references from general contractors you have worked for in the last 24 months.
          </p>
        </div>
      </section>
    </>
  )
}
