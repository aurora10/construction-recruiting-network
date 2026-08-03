"use client"

import { useEffect, useState } from "react"
import { site } from "@/lib/data"
import WhatsAppButton from "@/components/whatsapp-button"

export function StickyMobileCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-primary-foreground/15 bg-primary p-3 transition-transform duration-200 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex gap-3">
        <WhatsAppButton
          phoneNumber={site.whatsappPhone}
        />
        <a
          href="#request-crew"
          className="flex h-12 flex-1 items-center justify-center rounded-md bg-accent font-bold text-accent-foreground"
        >
          Request Crew
        </a>
      </div>
    </div>
  )
}
