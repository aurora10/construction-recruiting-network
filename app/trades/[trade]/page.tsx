import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ChevronRight, MapPin } from "lucide-react"
import { TradeIcon } from "@/components/trade-card"
import { cities, getTrade, trades } from "@/lib/data"

type Params = { trade: string }

export function generateStaticParams() {
  return trades.map((trade) => ({ trade: trade.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { trade: tradeSlug } = await params
  const trade = getTrade(tradeSlug)
  if (!trade) return {}

  return {
    title: `${trade.name} — National Subcontractor Network | CrewNetUSA`,
    description: `We staff ${trade.name.toLowerCase()} in ${cities.length} markets across the US. Pre-vetted, insured crews ready to bid. Select your market to see available crews.`,
    alternates: { canonical: `/trades/${trade.slug}` },
  }
}

export default async function TradeLandingPage({ params }: { params: Promise<Params> }) {
  const { trade: tradeSlug } = await params
  const trade = getTrade(tradeSlug)

  if (!trade) notFound()

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-border bg-secondary">
        <ol className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-3 text-sm sm:px-6">
          <li>
            <Link href="/" className="font-medium text-muted-foreground hover:text-accent">
              Home
            </Link>
          </li>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <li className="whitespace-nowrap font-bold text-foreground" aria-current="page">
            {trade.name}
          </li>
        </ol>
      </nav>

      <section aria-labelledby="trade-heading" className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary">
            <TradeIcon slug={trade.slug} className="h-6 w-6 text-accent" />
          </span>
          <h1
            id="trade-heading"
            className="mt-4 text-3xl font-black tracking-tight text-foreground text-balance sm:text-4xl"
          >
            We staff {trade.name.toLowerCase()} in the following markets
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            {trade.blurb}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Select your market below to see available crews, license requirements, and request a bid.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}/${trade.slug}`}
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