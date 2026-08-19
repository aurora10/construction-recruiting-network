import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CircleCheckBig } from "lucide-react"
import { Hero } from "@/components/hero"
import { LeadForm } from "@/components/lead-form"
import { cities, cityLabel, getCity, getLicenseReq, getTrade, trades } from "@/lib/data"

type Params = { city: string; trade: string }

export function generateStaticParams() {
  return cities.flatMap((city) => trades.map((trade) => ({ city: city.slug, trade: trade.slug })))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { city: citySlug, trade: tradeSlug } = await params
  const city = getCity(citySlug)
  const trade = getTrade(tradeSlug)
  if (!city || !trade) return {}

  return {
    title: `${trade.name} Jobs in ${city.name}, ${city.state} — Join the Subcontractor Network`,
    description: `Independent ${trade.name.toLowerCase()} wanted in ${cityLabel(city)}. Get matched with vetted general contractors — no lead fees, no bidding wars. Join the network free.`,
    alternates: { canonical: `/join/${city.slug}/${trade.slug}` },
  }
}

const genericBenefits = [
  "Qualified GC requests sent straight to your phone",
  "No pay-per-lead fees and no bidding wars",
  "You set your own rates and contract directly",
  "Verified scope and start dates before you drive out",
]

export default async function JoinTradePage({ params }: { params: Promise<Params> }) {
  const { city: citySlug, trade: tradeSlug } = await params
  const city = getCity(citySlug)
  const trade = getTrade(tradeSlug)

  if (!city || !trade) notFound()

  return (
    <>
      <Hero
        eyebrow={`For ${cityLabel(city)} subcontractors`}
        heading={
          <>
            Keep your commercial {trade.singular.toLowerCase()} booked solid in{" "}
            <span className="text-accent">{city.name}</span>.
          </>
        }
        subheading={`Join the ${city.name} network and we'll send your ${trade.singular.toLowerCase()} qualified requests from general contractors in ${city.metro}. Free to join — we verify your license and insurance once, then start routing work.`}
        aside={
          <LeadForm
            trade={trade.name}
            city={cityLabel(city)}
            projectTypes={trade.projectTypes}
            heading={`Apply as a ${trade.singular}`}
            subheading={`Serving ${city.name} and the greater ${city.metro}.`}
          />
        }
      />

      {/* Trade-specific benefits */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-black tracking-tight text-foreground text-balance">
            What {trade.singular.toLowerCase()}s get in {city.name}
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Here's what joining the {city.name} subcontractor network means for your {trade.singular.toLowerCase()}
            specifically:
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {trade.subBenefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-lg leading-relaxed text-foreground">
                <CircleCheckBig className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Local market info */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-black tracking-tight text-foreground text-balance">
            The {city.name} market for {trade.singular.toLowerCase()}s
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{city.localMarketStat}</p>
          <ul className="mt-8 flex flex-col gap-4">
            <li className="flex items-start gap-3 text-lg leading-relaxed text-foreground">
              <CircleCheckBig className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              {getLicenseReq(trade, city.state)}
            </li>
            <li className="flex items-start gap-3 text-lg leading-relaxed text-foreground">
              <CircleCheckBig className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              Typical crew size: {trade.averageCrewSize} — we match GC requests to your exact capacity.
            </li>
            <li className="flex items-start gap-3 text-lg leading-relaxed text-foreground">
              <CircleCheckBig className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              {city.majorCounties}
            </li>
          </ul>
        </div>
      </section>

      {/* Generic network benefits */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-black tracking-tight text-foreground text-balance">
            What every crew in the network gets
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {genericBenefits.map((benefit) => (
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