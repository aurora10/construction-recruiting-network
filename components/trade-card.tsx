import Link from "next/link"
import { ArrowRight, Blocks, Droplet, Hammer, Layers, PaintRoller, SquareStack, Wind, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { Trade } from "@/lib/data"

const tradeIcons: Record<string, LucideIcon> = {
  "framing-subcontractors": Hammer,
  "drywall-subcontractors": Layers,
  "electrical-contractors": Zap,
  "plumbing-contractors": Droplet,
  "concrete-contractors": Blocks,
  "roofing-subcontractors": SquareStack,
  "painting-contractors": PaintRoller,
  "hvac-contractors": Wind,
}

export function TradeIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = tradeIcons[slug] ?? Hammer
  return <Icon className={className} aria-hidden="true" />
}

export function TradeCard({ trade, citySlug }: { trade: Trade; citySlug: string }) {
  return (
    <Link
      href={`/${citySlug}/${trade.slug}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-secondary group-hover:bg-accent/15">
        <TradeIcon slug={trade.slug} className="h-6 w-6 text-primary group-hover:text-accent" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-card-foreground">{trade.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{trade.blurb}</p>
      <span className="mt-4 flex items-center gap-2 text-sm font-bold text-accent">
        View crews
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  )
}
