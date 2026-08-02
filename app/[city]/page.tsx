import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, MapPin } from "lucide-react"
import { Hero } from "@/components/hero"
import { LeadForm } from "@/components/lead-form"
import { TradeCard } from "@/components/trade-card"
import { ValueProps } from "@/components/value-props"
import { cities, cityLabel, getCity, trades } from "@/lib/data"
import type { ContentOverride } from "@/lib/data"
import contentOverrides from "@/lib/generated-content.json"

type Params = { city: string }

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCity(citySlug)
  if (!city) return {}

  return {
    title: `Construction Staffing & Subcontractor Network in ${cityLabel(city)}`,
    description: `Browse vetted subcontractor crews across ${trades.length} trades in ${cityLabel(city)}. Licensed, insured, and ready to bid.`,
    alternates: { canonical: `/${city.slug}` },
  }
}

export default async function CityHubPage({ params }: { params: Promise<Params> }) {
  const { city: citySlug } = await params
  const city = getCity(citySlug)

  if (!city) notFound()

  // Extract marketVibe from content overrides — find first trade override for this city
  const overrides = contentOverrides[0] as Record<string, ContentOverride> | undefined
  const marketVibe = trades
    .map((t) => overrides?.[`${citySlug}-${t.slug.split("-")[0]}`]?.marketVibe)
    .find(Boolean)

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-border bg-secondary">
        <ol className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-3 text-sm sm:px-6">
          <li>
            <Link href="/" className="font-medium text-muted-foreground hover:text-accent">
              Home
            </Link>
          </li>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <li className="font-bold text-foreground" aria-current="page">
            {cityLabel(city)}
          </li>
        </ol>
      </nav>

      <Hero
        eyebrow={city.metro}
        heading={
          <>
            Construction Staffing & Subcontractor Network in{" "}
            <span className="text-accent">{city.name}</span>.
          </>
        }
        subheading={`Pick your trade below, or send one request and our ${city.name} dispatcher will match you to available crews across every trade on your job.`}
        aside={
          <LeadForm
            city={cityLabel(city)}
            heading={`Request a ${city.name} Crew`}
            subheading="Tell us the trade and we'll match availability."
          />
        }
      />

      <section aria-labelledby="trades-heading" className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <h2 id="trades-heading" className="text-3xl font-black tracking-tight text-foreground text-balance">
            Trades available in {cityLabel(city)}
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            Every crew in the {city.name} network is license-verified and carries active general liability coverage.{" "}
            {city.majorCounties}
          </p>
          <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">{city.localMarketStat}</p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trades.map((trade) => (
              <TradeCard key={trade.slug} trade={trade} citySlug={city.slug} />
            ))}
          </div>
        </div>
      </section>

      <ValueProps />

      {marketVibe ? (
        <section className="bg-secondary">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 className="text-2xl font-bold text-foreground">Why We Focus on {city.name}</h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{marketVibe}</p>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="nearby-heading" className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 id="nearby-heading" className="text-2xl font-bold text-foreground">
            Nearby markets
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {city.nearby.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/${n.slug}`}
                  className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-4 font-bold text-foreground hover:border-accent hover:text-accent"
                >
                  <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
                  {n.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
