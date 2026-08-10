import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"
import { Hero } from "@/components/hero"
import { LeadForm } from "@/components/lead-form"
import { TradeIcon } from "@/components/trade-card"
import { ValueProps } from "@/components/value-props"
import { cities, trades } from "@/lib/data"

const stats = [
  { value: "1,400+", label: "Vetted crews in network" },
  { value: "< 1 hr", label: "Average dispatch callback" },
  { value: "10", label: "Metro markets served" },
]

export const metadata = {
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Subcontractor network for general contractors"
        heading={
          <>
            Reliable trade crews. <span className="text-accent">Ready to bid.</span>
          </>
        }
        subheading="Pre-vetted, insured, and available now. Stop dealing with Craigslist flakes — connect with professional subcontractor crews in your market today."
        aside={<LeadForm heading="Request a Crew" subheading="Response within 1 business hour." />}
      />

      <section className="border-b border-border bg-primary">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-black text-accent">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <ValueProps />

      <section aria-labelledby="trades-heading" className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <h2 id="trades-heading" className="text-3xl font-black tracking-tight text-foreground text-balance">
            Trades we staff
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            Residential, multifamily, and light commercial. Pick a trade, then choose your market.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trades.map((trade) => (
              <li key={trade.slug}>
                <Link
                  href={`/trades/${trade.slug}`}
                  className="group flex items-center gap-3 rounded-md border border-border bg-card px-4 py-4 transition-colors hover:border-accent"
                >
                  <TradeIcon slug={trade.slug} className="h-6 w-6 shrink-0 text-accent" />
                  <span className="font-bold text-card-foreground group-hover:text-accent">{trade.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="markets-heading" className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <h2 id="markets-heading" className="text-3xl font-black tracking-tight text-foreground text-balance">
            Markets we serve
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="group flex items-center justify-between rounded-lg border border-border bg-card px-5 py-5 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
              >
                <span className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
                  <span>
                    <span className="block font-bold text-card-foreground">
                      {city.name}, {city.state}
                    </span>
                    <span className="block text-sm text-muted-foreground">{city.metro}</span>
                  </span>
                </span>
                <ArrowRight
                  className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
