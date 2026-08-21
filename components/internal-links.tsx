import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cities, getCity, trades, type City, type Trade } from "@/lib/data"

export function InternalLinks({ city, trade }: { city: City; trade: Trade }) {
  const otherTrades = trades.filter((t) => t.slug !== trade.slug).slice(0, 6)

  const parentMetro = city.parentMetro ? getCity(city.parentMetro) : undefined
  const siblingCities = city.parentMetro
    ? cities.filter((c): c is City => c.parentMetro === city.parentMetro && c.slug !== city.slug)
    : []
  const nearbySuburbCities = city.nearbySuburbs
    ? city.nearbySuburbs.map((slug) => getCity(slug)).filter((c): c is City => Boolean(c))
    : []

  const relatedLinks =
    city.type === "metro-hub" ? (
      <>
        <h3 className="text-sm font-black uppercase tracking-wide text-muted-foreground">
          {trade.name} in nearby {city.name} suburbs
        </h3>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {nearbySuburbCities.map((suburb) => (
            <li key={suburb.slug}>
              <Link
                href={`/${suburb.slug}/${trade.slug}`}
                className="flex items-center justify-between py-3 font-medium text-foreground hover:text-accent"
              >
                {trade.name} in {suburb.name}
                <ChevronRight className="h-4 w-4 text-accent" aria-hidden="true" />
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={`/${city.slug}`}
              className="flex items-center justify-between py-3 font-medium text-foreground hover:text-accent"
            >
              All trades in {city.name}
              <ChevronRight className="h-4 w-4 text-accent" aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </>
    ) : (
      <>
        <h3 className="text-sm font-black uppercase tracking-wide text-muted-foreground">
          {trade.name} near {city.name}
        </h3>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {parentMetro ? (
            <li>
              <Link
                href={`/${parentMetro.slug}/${trade.slug}`}
                className="flex items-center justify-between py-3 font-medium text-foreground hover:text-accent"
              >
                {trade.name} in {parentMetro.name}
                <ChevronRight className="h-4 w-4 text-accent" aria-hidden="true" />
              </Link>
            </li>
          ) : null}
          {siblingCities.map((sibling) => (
            <li key={sibling.slug}>
              <Link
                href={`/${sibling.slug}/${trade.slug}`}
                className="flex items-center justify-between py-3 font-medium text-foreground hover:text-accent"
              >
                {trade.name} in {sibling.name}
                <ChevronRight className="h-4 w-4 text-accent" aria-hidden="true" />
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={`/${city.slug}`}
              className="flex items-center justify-between py-3 font-medium text-foreground hover:text-accent"
            >
              All trades in {city.name}
              <ChevronRight className="h-4 w-4 text-accent" aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </>
    )

  return (
    <section aria-labelledby="explore-heading" className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 id="explore-heading" className="text-2xl font-bold text-foreground">
          Explore the {city.name} network
        </h2>

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-muted-foreground">
              Other trades in {city.name}
            </h3>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {otherTrades.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/${city.slug}/${t.slug}`}
                    className="flex items-center justify-between py-3 font-medium text-foreground hover:text-accent"
                  >
                    {t.name} in {city.name}
                    <ChevronRight className="h-4 w-4 text-accent" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>{relatedLinks}</div>
        </div>
      </div>
    </section>
  )
}

