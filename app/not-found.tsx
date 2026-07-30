import Link from "next/link"
import { cities } from "@/lib/data"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-sm font-black uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-foreground text-balance">
        We don&apos;t cover that page yet.
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        That market or trade isn&apos;t in the network. Pick one of our active markets below, or call dispatch and
        we&apos;ll tell you whether we can source a crew for your area.
      </p>
      <ul className="mt-8 flex flex-wrap gap-3">
        {cities.map((city) => (
          <li key={city.slug}>
            <Link
              href={`/${city.slug}`}
              className="flex h-11 items-center rounded-md border border-border bg-card px-4 font-bold text-foreground hover:border-accent hover:text-accent"
            >
              {city.name}, {city.state}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/"
        className="mt-10 flex h-14 w-full items-center justify-center rounded-md bg-accent text-lg font-bold text-accent-foreground sm:w-auto sm:px-8"
      >
        Back to home
      </Link>
    </div>
  )
}
