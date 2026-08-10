import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { StickyMobileCta } from '@/components/sticky-mobile-cta'
import { site } from '@/lib/data'
import './globals.css'

const _inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://crewnetusa.com'),
  title: {
    default: `${site.name} — Vetted Subcontractor Crews for General Contractors`,
    template: `%s | ${site.name}`,
  },
  description:
    'Connect with pre-vetted, licensed, and insured subcontractor crews in your market. Framing, drywall, electrical, plumbing, concrete, roofing and more.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0F172A',
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: 'https://crewnetusa.com',
  description:
    'Connect with pre-vetted, licensed, and insured subcontractor crews. Framing, drywall, electrical, plumbing, concrete, roofing and more.',
  telephone: site.phoneDisplay,
  email: site.email,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <StickyMobileCta />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
