import type { MetadataRoute } from "next"
import { cities, trades } from "@/lib/data"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crewnetusa.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/contact", "/how-it-works", "/join-network", "/privacy", "/terms"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    priority: path === "" ? 1 : 0.4,
  }))

  const cityRoutes = cities.map((city) => ({
    url: `${baseUrl}/${city.slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }))

  const globalTradeRoutes = trades.map((trade) => ({
    url: `${baseUrl}/trades/${trade.slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }))

  const tradeRoutes = cities.flatMap((city) =>
    trades.map((trade) => ({
      url: `${baseUrl}/${city.slug}/${trade.slug}`,
      lastModified: new Date(),
      priority: 0.9,
    })),
  )

  const jobsRoutes = cities.flatMap((city) =>
    trades.map((trade) => ({
      url: `${baseUrl}/jobs/${city.slug}/${trade.slug}`,
      lastModified: new Date(),
      priority: 0.7,
    })),
  )

  const joinRoutes = cities.flatMap((city) =>
    trades.map((trade) => ({
      url: `${baseUrl}/join/${city.slug}/${trade.slug}`,
      lastModified: new Date(),
      priority: 0.5,
    })),
  )

  return [...staticRoutes, ...cityRoutes, ...globalTradeRoutes, ...tradeRoutes, ...jobsRoutes, ...joinRoutes]
}