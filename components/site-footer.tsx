import Link from "next/link"
import { ArrowRight, Clock, HardHat, Mail, Phone } from "lucide-react"
import { cities, site } from "@/lib/data"

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="rounded-lg border border-accent/40 bg-accent/10 p-6 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold">Are you a subcontractor?</p>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Get sent qualified work from vetted general contractors in your area.
            </p>
          </div>
          <Link
            href="/join-network"
            className="mt-4 flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 font-bold text-accent-foreground sm:mt-0"
          >
            Join our network
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <HardHat className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="text-base font-black uppercase tracking-tight">{site.name}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">{site.tagline}</p>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-wide text-accent">Contact</h2>
            <ul className="mt-3 flex flex-col gap-3 text-sm">
              <li>
                <a href={site.phoneHref} className="flex items-center gap-2 font-bold hover:text-accent">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-accent">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {site.hours}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-wide text-accent">Service Areas</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link href={`/${city.slug}`} className="text-primary-foreground/80 hover:text-accent">
                    {city.name}, {city.state}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-wide text-accent">Company</h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <Link href="/about" className="text-primary-foreground/80 hover:text-accent">
                  About
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-primary-foreground/80 hover:text-accent">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary-foreground/80 hover:text-accent">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/join-network" className="text-primary-foreground/80 hover:text-accent">
                  Join the network
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-primary-foreground/80 hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-primary-foreground/80 hover:text-accent">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} {site.name}. {site.name} is a referral network and is not a licensed general
          contractor. All crews carry their own licensing and insurance.
        </p>
      </div>
    </footer>
  )
}
