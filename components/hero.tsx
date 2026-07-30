import type { ReactNode } from "react"
import { BadgeCheck, Clock, ShieldCheck } from "lucide-react"

const badges = [
  { icon: BadgeCheck, label: "Licensed" },
  { icon: ShieldCheck, label: "General Liability Insured" },
  { icon: Clock, label: "Fast Turnaround" },
]

export function Hero({
  eyebrow,
  heading,
  subheading,
  aside,
}: {
  eyebrow?: string
  heading: ReactNode
  subheading: string
  aside: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden bg-primary">
      <img
        src="/images/jobsite-hero.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 grit-overlay" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-14 lg:py-20">
        <div className="text-primary-foreground">
          {eyebrow ? (
            <p className="text-sm font-black uppercase tracking-widest text-accent">{eyebrow}</p>
          ) : null}
          <h1 className="mt-3 text-4xl font-black leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-primary-foreground/90">{subheading}</p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {badges.map((badge) => (
              <li key={badge.label} className="flex items-center gap-2 text-sm font-bold">
                <badge.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                {badge.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:pt-2">{aside}</div>
      </div>
    </section>
  )
}
