import type { City, Trade } from "@/lib/data"

type FaqProps = {
  city: City
  trade: Trade
}

export function Faq({ city, trade }: FaqProps) {
  const faqs = [
    {
      question: `How do you vet your ${trade.name.toLowerCase()} in ${city.name}?`,
      answer: `Every ${trade.singular.toLowerCase()} in our network is required to provide proof of general liability insurance, worker's comp (if applicable), and references from recent commercial or residential projects in the ${city.metro} metro area.`,
    },
    {
      question: "How does the finder's fee work?",
      answer: `Once you hire a ${trade.singular.toLowerCase()} through our network, you pay a flat finder's fee per crew matched — no recurring commissions, no hidden markups, and no ongoing cut of the subcontractor's contract. You negotiate your scope and rate directly with the crew.`,
    },
    {
      question: `What if the ${trade.singular.toLowerCase()} doesn't show up?`,
      answer: `If a crew no-shows or can't mobilize, call our dispatch team immediately. We'll work to find a replacement ${trade.singular.toLowerCase()} from our ${city.metro} network the same day, at no additional finder's fee.`,
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="border-y border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <h2 className="text-3xl font-black tracking-tight text-foreground text-balance">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {faqs.map((faq) => (
            <div key={faq.question} className="flex flex-col">
              <h3 className="text-lg font-bold text-foreground">{faq.question}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  )
}
