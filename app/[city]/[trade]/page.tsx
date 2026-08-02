import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, CircleCheckBig, Phone } from "lucide-react"
import { Faq } from "@/components/faq"
import { Hero } from "@/components/hero"
import { InternalLinks } from "@/components/internal-links"
import { LeadForm } from "@/components/lead-form"
import { TradeIcon } from "@/components/trade-card"
import { ValueProps } from "@/components/value-props"
import { cities, cityLabel, getCity, getLicenseReq, getTrade, site, trades } from "@/lib/data"
import type { ContentOverride } from "@/lib/data"
import contentOverrides from "@/lib/generated-content.json"

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
    title: `${trade.name} in ${city.name}, ${city.state} — Vetted & Insured Crews`,
    description: `Hire pre-vetted ${trade.name.toLowerCase()} in ${cityLabel(city)}. Licensed, insured, and ready to bid. Request available crews in under 60 seconds.`,
    alternates: { canonical: `/${city.slug}/${trade.slug}` },
  }
}


export default async function TradeLandingPage({ params }: { params: Promise<Params> }) {
  const { city: citySlug, trade: tradeSlug } = await params
  const city = getCity(citySlug)
  const trade = getTrade(tradeSlug)

  if (!city || !trade) notFound()

  const contentKey = `${citySlug}-${tradeSlug.split("-")[0]}`
  const override: ContentOverride | undefined =
    contentOverrides[0]?.[contentKey as keyof (typeof contentOverrides)[0]]

  const isDev = process.env.NODE_ENV === "development"
  const showDevWarning = isDev && !override

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: trade.name,
    provider: {
      '@type': 'Organization',
      name: site.name,
    },
    areaServed: {
      '@type': 'City',
      name: cityLabel(city),
    },
    description: `Hire pre-vetted ${trade.name.toLowerCase()} in ${cityLabel(city)}. Licensed, insured, and ready to bid. Request available crews in under 60 seconds.`,
  }

  const scopeChecklist = [
    `Crew size matched to your production schedule — ${trade.averageCrewSize} per crew`,
    "Certificate of insurance provided before mobilization",
    city.majorCounties,
    `References from GCs in the ${city.metro} area on request`,
  ]

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
          <li>
            <Link href={`/${city.slug}`} className="font-medium text-muted-foreground hover:text-accent">
              {cityLabel(city)}
            </Link>
          </li>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <li className="whitespace-nowrap font-bold text-foreground" aria-current="page">
            {trade.name}
          </li>
        </ol>
      </nav>

      {showDevWarning ? (
        <div className="bg-red-600 text-white text-center text-sm font-bold py-2 px-4">
          ⚠️ Generic SEO Content — Update JSON (missing key:{" "}
          <code className="bg-red-800 px-1.5 py-0.5 rounded text-xs">{contentKey}</code>)
        </div>
      ) : null}

      <Hero
        eyebrow={`${cityLabel(city)} · ${city.metro}`}
        heading={
          <>
            Reliable {trade.name} in <span className="text-accent">{city.name}</span>.
          </>
        }
        subheading={
          override?.heroSubheading ??
          `Pre-vetted, insured, and ready to bid. Stop dealing with Craigslist flakes — connect with professional ${trade.name.toLowerCase()} today.`
        }
        aside={
          <LeadForm
            trade={trade.name}
            city={cityLabel(city)}
            projectTypes={trade.projectTypes}
            heading={`Get ${trade.singular} Availability`}
            subheading={`Serving ${city.name} and the greater ${city.metro}.`}
          />
        }
      />

      {override?.uniqueParagraph ? (
        <section className="bg-background">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <p className="text-lg leading-relaxed text-muted-foreground">{override.uniqueParagraph}</p>
          </div>
        </section>
      ) : null}

      <ValueProps />

      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary">
              <TradeIcon slug={trade.slug} className="h-6 w-6 text-accent" />
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground text-balance">
              What our {city.name} {trade.singular.toLowerCase()}s handle
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{trade.blurb}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {(override?.expertise ?? trade.projectTypes).map((item) => (
                <li key={item} className="flex items-start gap-2 font-medium text-foreground">
                  <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-secondary p-6 sm:p-8">
            <h3 className="text-xl font-bold text-foreground">Every referral includes</h3>
            <ul className="mt-5 flex flex-col gap-4">
              {(override?.compliance ?? scopeChecklist).map((item) => (
                <li key={item} className="flex items-start gap-3 leading-relaxed text-foreground">
                  <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={site.phoneHref}
              className="mt-7 flex h-14 items-center justify-center gap-2 rounded-md bg-primary text-lg font-bold text-primary-foreground"
            >
              <Phone className="h-5 w-5 text-accent" aria-hidden="true" />
              Call dispatch: {site.phoneDisplay}
            </a>
            <p className="mt-3 text-center text-sm text-muted-foreground">{site.hours}</p>
          </div>
        </div>
      </section>

      {override?.recentPlacements?.length ? (
        <section className="bg-background">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 className="text-2xl font-bold text-foreground">
              Recent {trade.name} Placements in {city.name}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {override.recentPlacements.map((placement) => (
                <li key={placement} className="flex items-start gap-2 leading-relaxed text-muted-foreground">
                  <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  {placement}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <InternalLinks city={city} trade={trade} />
      <Faq city={city} trade={trade} />
    </>
  )
}
