import type { Metadata } from "next"
import { LegalPage, LegalSection } from "@/components/legal-page"
import { site } from "@/lib/data"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and protects the information you submit through our crew request forms.`,
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 2026">
      <LegalSection
        heading="Information we collect"
        body={`When you submit a crew request we collect your name, phone number, email address, project type, and any scope details you provide. We also collect basic analytics about which pages you visit so we can understand which markets and trades need more coverage.`}
      />
      <LegalSection
        heading="How we use your information"
        body="We use your contact details for one purpose: matching you with subcontractor crews and following up about your request. We share your name, phone number, and project scope with the specific crews we introduce you to. We do not sell your information to third-party lead brokers."
      />
      <LegalSection
        heading="Communications"
        body="By submitting a request you agree that we may contact you by phone, SMS, or email about that request. You can opt out of any channel at any time by replying STOP to a text or emailing us."
      />
      <LegalSection
        heading="Data retention"
        body="Request records are retained for 24 months so we can support warranty questions and repeat placements, then deleted. You may request earlier deletion of your record at any time."
      />
      <LegalSection
        heading="Contact"
        body={`Questions about this policy? Email ${site.email} or call ${site.phoneDisplay} during office hours (${site.hours}).`}
      />
    </LegalPage>
  )
}
