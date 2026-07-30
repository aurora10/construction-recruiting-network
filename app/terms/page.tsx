import type { Metadata } from "next"
import { LegalPage, LegalSection } from "@/components/legal-page"
import { site } from "@/lib/data"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern use of the ${site.name} subcontractor referral network.`,
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 2026">
      <LegalSection
        heading="Referral network only"
        body={`${site.name} is a referral and matching service. We are not a licensed general contractor, we do not perform construction work, and we are not a party to any contract you sign with a subcontractor introduced through this site.`}
      />
      <LegalSection
        heading="Verification scope"
        body="We verify trade licensing where required, active general liability coverage, and contractor references at the time a crew joins the network. Verification is a screening step, not a guarantee of workmanship, schedule performance, or code compliance. You remain responsible for confirming current insurance certificates and licensing before mobilization."
      />
      <LegalSection
        heading="Your responsibilities"
        body="You agree to provide accurate project information, to contract directly with the crews you engage, and to handle payment, scheduling, safety orientation, and site supervision under your own agreements and jobsite policies."
      />
      <LegalSection
        heading="Limitation of liability"
        body={`To the maximum extent permitted by law, ${site.name} is not liable for indirect, incidental, or consequential damages arising from work performed by any subcontractor introduced through this site, including delays, defects, injury, or property damage.`}
      />
      <LegalSection
        heading="Contact"
        body={`Questions about these terms? Email ${site.email} or call ${site.phoneDisplay}.`}
      />
    </LegalPage>
  )
}
