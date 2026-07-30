import type { Metadata } from "next"
import Link from "next/link"
import { BadgeCheck, Building2, ShieldCheck, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "About CrewBridge",
  description:
    "CrewBridge is an independent recruiting business that connects general contractors with pre-vetted, licensed, and insured subcontractor crews. Learn about our origin, mission, and the team behind the network.",
  alternates: { canonical: "/about" },
}

const trustSignals = [
  {
    icon: Building2,
    label: "Independent Recruiting Business",
    desc: "We are a real, independently operated recruiting network — not an anonymous lead broker or algorithm-only marketplace.",
  },
  {
    icon: BadgeCheck,
    label: "Every Crew Is Vetted",
    desc: "Before a subcontractor enters the network we verify their trade license, general liability insurance, and at least two GC references from the last 24 months.",
  },
  {
    icon: ShieldCheck,
    label: "No Pay-Per-Lead Fees",
    desc: "General contractors pay a flat finder's fee only when a crew is successfully placed. No subscription, no per-lead charges, no bidding wars for subs.",
  },
]

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      {/* Hero title */}
      <h1 className="text-4xl font-black tracking-tight text-foreground text-balance sm:text-5xl">
        We built CrewBridge to take the guesswork out of hiring subcontractors.
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        General contractors waste hours cold-calling crews, chasing availability, and hoping the team that shows up is
        actually qualified. CrewBridge replaces that friction with a pre-vetted network and a single point of contact.
      </p>

      {/* Origin Story */}
      <section className="mt-16">
        <h2 className="text-2xl font-black tracking-tight text-foreground">How CrewBridge started</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          After years of watching general contractors struggle through the same problem —{" "}
          <strong className="text-foreground">
            too many unqualified leads, too little reliable capacity
          </strong>{" "}
          — we knew there had to be a better way. CrewBridge began as a simple idea: build a standing network of
          licensed, insured trade crews that GCs could tap on demand, without the noise of a public job board.
        </p>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Today we operate as an independent recruiting business serving general contractors across the Southeast and
          beyond. Every crew in the network has been personally verified by our team. When you submit a request, a real
          person reviews your scope, checks availability against our roster, and connects you with a crew that fits the
          job — not just a random list of names.
        </p>
      </section>

      {/* Trust Signals */}
      <section className="mt-16">
        <h2 className="text-2xl font-black tracking-tight text-foreground">What makes CrewBridge different</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {trustSignals.map((signal) => (
            <li
              key={signal.label}
              className="rounded-lg border border-border bg-background p-6"
            >
              <signal.icon className="h-8 w-8 text-accent" aria-hidden="true" />
              <h3 className="mt-3 text-base font-bold text-foreground">{signal.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{signal.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Team */}
      <section className="mt-16">
        <h2 className="text-2xl font-black tracking-tight text-foreground">The team behind the network</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          CrewBridge is operated by a small team of recruiting professionals who understand construction. We answer the
          phone, review every submission by hand, and stand behind every placement. No chatbots, no outsourced call
          centers — just real people who know the trades.
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div className="flex flex-col items-center rounded-lg border border-border bg-background p-6 text-center">
            <img
              src="/placeholder-user.jpg"
              alt="Team member — replace with actual photo"
              className="h-28 w-28 rounded-full object-cover border-2 border-accent/30"
            />
            <h3 className="mt-4 text-lg font-bold text-foreground">Your Name Here</h3>
            <p className="mt-1 text-sm text-muted-foreground">Founder & Recruiter</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Replace this placeholder with your actual photo and bio. Google evaluates E-E-A-T signals like real team
              photos, names, and credentials — swapping in genuine details here builds trust with both GCs and the
              algorithm.
            </p>
          </div>

          <div className="flex flex-col items-center rounded-lg border border-border bg-background p-6 text-center">
            <img
              src="/placeholder-user.jpg"
              alt="Team member — replace with actual photo"
              className="h-28 w-28 rounded-full object-cover border-2 border-accent/30"
            />
            <h3 className="mt-4 text-lg font-bold text-foreground">Team Member</h3>
            <p className="mt-1 text-sm text-muted-foreground">Operations & Vetting</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Add your team member's name, role, and a short sentence about their construction or recruiting background.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-lg border border-accent/30 bg-accent/5 p-8 text-center">
        <h2 className="text-xl font-black tracking-tight text-foreground">
          Ready to skip the cold calls?
        </h2>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          Submit a crew request and we'll match you with a vetted subcontractor — usually within 24 hours.
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