import type { ReactNode } from "react"

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <h1 className="text-4xl font-black tracking-tight text-foreground text-balance">{title}</h1>
      <p className="mt-2 text-sm font-medium text-muted-foreground">Last updated {updated}</p>
      <div className="mt-10 flex flex-col gap-8">{children}</div>
    </article>
  )
}

export function LegalSection({ heading, body }: { heading: string; body: string }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-foreground">{heading}</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">{body}</p>
    </section>
  )
}
