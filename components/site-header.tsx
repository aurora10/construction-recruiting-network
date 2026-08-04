"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { site } from "@/lib/data"
import WhatsAppButton from "@/components/whatsapp-button"

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background overflow-hidden">
      <div className="mx-auto flex h-22 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 mt-1">
          <img
            src="/images/5.png"
            alt={site.name}
            className="h-44 w-auto flex-shrink-0 -ml-4"
          />
        </Link>

        {/* Desktop nav (hidden on mobile) */}
        <div className="hidden items-center gap-2 sm:flex">
          {/* Nav links group */}
          <Link
            href="/about"
            className="text-base font-bold text-foreground hover:text-accent transition-colors mr-2"
          >
            About
          </Link>
          <Link
            href="/how-it-works"
            className="text-base font-bold text-foreground hover:text-accent transition-colors mr-4"
          >
            How It Works
          </Link>

          {/* Action items group */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <WhatsAppButton phoneNumber={site.whatsappPhone} compact />
            <a
              href="/#request-crew"
              className="flex h-11 items-center rounded-md bg-accent px-5 font-bold text-accent-foreground transition-colors hover:brightness-95"
            >
              Request a Crew
            </a>
          </div>
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          className="sm:hidden p-2 text-foreground hover:text-accent transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-4 py-6 sm:hidden">
          <div className="flex flex-col gap-4 mx-auto max-w-6xl">
            <Link
              href="/about"
              className="text-base font-bold text-foreground hover:text-accent transition-colors py-1"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/how-it-works"
              className="text-base font-bold text-foreground hover:text-accent transition-colors py-1"
              onClick={() => setMenuOpen(false)}
            >
              How It Works
            </Link>

            <div className="flex items-stretch gap-3 pt-2">
              <WhatsAppButton phoneNumber={site.whatsappPhone} />
              <a
                href="/#request-crew"
                className="flex flex-1 h-11 items-center justify-center rounded-md bg-accent font-bold text-accent-foreground transition-colors hover:brightness-95"
                onClick={() => setMenuOpen(false)}
              >
                Request a Crew
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}