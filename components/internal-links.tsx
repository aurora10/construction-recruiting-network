import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { trades, type City, type Trade } from "@/lib/data"

export function InternalLinks({ city, trade }: { city: City; trade: Trade }) {
  const otherTrades = trades.filter((t) => t.slug !== trade.slug).slice(0, 6)

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

          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-muted-foreground">
              {trade.name} in nearby areas
            </h3>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {city.nearby.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/${n.slug}/${trade.slug}`}
                    className="flex items-center justify-between py-3 font-medium text-foreground hover:text-accent"
                  >
                    {trade.name} in {n.name}
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
          </div>
        </div>
      </div>
    </section>
  )
}
