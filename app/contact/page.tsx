import type { Metadata } from "next"
import Link from "next/link"
import { Clock, Mail, Phone, MessageCircle } from "lucide-react"
import { site } from "@/lib/data"

export const metadata: Metadata = {
  title: "Contact CrewNetUSA",
  description:
    "Get in touch with the CrewNetUSA team. Reach us by phone or email for crew requests, network inquiries, or general questions. We are an online recruiting service — no walk-in office.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <h1 className="text-4xl font-black tracking-tight text-foreground text-balance sm:text-5xl">
        Talk to a real person — not a bot.
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        CrewNetUSA is an online recruiting service. We don't have a walk-in office, but we answer every call and email
        directly. Whether you need a crew tomorrow or just want to understand how the network works, reach out.
      </p>

      {/* Contact Cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {/* Phone */}
        <div className="rounded-lg border border-border bg-background p-6">
          <Phone className="h-8 w-8 text-accent" aria-hidden="true" />
          <h2 className="mt-4 text-base font-bold text-foreground">Phone</h2>
          <a
            href={site.phoneHref}
            className="mt-2 block text-lg font-bold text-accent hover:underline"
          >
            {site.phoneDisplay}
          </a>
          <p className="mt-2 text-sm text-muted-foreground">
            Call us during business hours. We pick up — no phone tree, no voicemail maze.
          </p>
        </div>

        {/* Email */}
        <div className="rounded-lg border border-border bg-background p-6">
          <Mail className="h-8 w-8 text-accent" aria-hidden="true" />
          <h2 className="mt-4 text-base font-bold text-foreground">Email</h2>
          <a
            href={`mailto:${site.email}`}
            className="mt-2 block text-lg font-bold text-accent hover:underline break-all"
          >
            {site.email}
          </a>
          <p className="mt-2 text-sm text-muted-foreground">
            Crew requests, network inquiries, or general questions — we reply same business day.
          </p>
        </div>

        {/* Hours */}
        <div className="rounded-lg border border-border bg-background p-6">
          <Clock className="h-8 w-8 text-accent" aria-hidden="true" />
          <h2 className="mt-4 text-base font-bold text-foreground">Business Hours</h2>
          <p className="mt-2 text-lg font-bold text-foreground">{site.hours}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We operate East Coast hours but serve contractors nationwide. If you call after hours we'll get back to you
            first thing the next business day.
          </p>
        </div>
      </div>

      {/* Online Service Notice */}
      <div className="mt-10 rounded-lg border border-border bg-muted/30 p-6">
        <div className="flex items-start gap-3">
          <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <h2 className="text-base font-bold text-foreground">We're an online service</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              CrewNetUSA operates entirely online — we don't maintain a public office or walk-in location. This keeps our
              overhead low and our finder's fee affordable. All communication happens by phone and email, and every crew
              placement is confirmed in writing.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="mt-12 rounded-lg border border-accent/30 bg-accent/5 p-8 text-center">
        <h2 className="text-xl font-black tracking-tight text-foreground">Need a crew right now?</h2>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          Skip the email and submit a request directly. We'll start matching you within hours.
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