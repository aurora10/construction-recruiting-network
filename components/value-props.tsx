import { BadgeCheck, Users, Zap } from "lucide-react"

const items = [
  {
    icon: BadgeCheck,
    title: "Vetted & Proven",
    body: "Every crew is background checked, license verified, and reference verified before it hits our network.",
  },
  {
    icon: Users,
    title: "Scalable Labor",
    body: "From 2-man residential crews to 20-man commercial teams — matched to your schedule and scope.",
  },
  {
    icon: Zap,
    title: "Zero Hassle",
    body: "You deal directly with the tradesmen. No markup, no middleman on the jobsite. We just make the connection.",
  },
]

export function ValueProps() {
  return (
    <section className="border-y border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="flex flex-col">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary">
                <item.icon className="h-6 w-6 text-accent" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-foreground">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
