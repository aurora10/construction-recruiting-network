import Link from "next/link"
import { HardHat, Phone } from "lucide-react"
import { site } from "@/lib/data"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <HardHat className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="text-lg font-black uppercase tracking-tight text-foreground">{site.name}</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/about"
            className="hidden text-sm font-bold text-foreground hover:text-accent transition-colors sm:inline"
          >
            About
          </Link>
          <Link
            href="/how-it-works"
            className="hidden text-sm font-bold text-foreground hover:text-accent transition-colors sm:inline"
          >
            How It Works
          </Link>
          <a
            href={site.phoneHref}
            className="flex items-center gap-2 text-base font-bold text-foreground hover:text-accent"
          >
            <Phone className="h-5 w-5 text-accent" aria-hidden="true" />
            <span className="hidden sm:inline">{site.phoneDisplay}</span>
            <span className="sr-only sm:hidden">Call {site.phoneDisplay}</span>
          </a>
          <Link
            href="#request-crew"
            className="hidden h-11 items-center rounded-md bg-accent px-5 font-bold text-accent-foreground transition-colors hover:brightness-95 sm:flex"
          >
            Request a Crew
          </Link>
        </div>
      </div>
    </header>
  )
}
