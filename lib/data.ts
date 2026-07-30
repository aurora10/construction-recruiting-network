export const site = {
  name: "CrewBridge",
  tagline: "Subcontractor Network for General Contractors",
  phoneDisplay: "(919) 555-0142",
  phoneHref: "tel:+19195550142",
  email: "dispatch@crewbridge.com",
  hours: "Mon–Sat, 6:00 AM – 7:00 PM ET",
}

export type Trade = {
  slug: string
  name: string
  singular: string
  blurb: string
  projectTypes: string[]
  subBenefits: string[]
  averageCrewSize: string
  stateLicenseRequirement: Record<string, string>
}

export type City = {
  slug: string
  name: string
  state: string
  metro: string
  nearby: { slug: string; name: string }[]
  majorCounties: string
  localMarketStat: string
}

export const trades: Trade[] = [
  {
    slug: "framing-subcontractors",
    name: "Framing Subcontractors",
    singular: "Framing Crew",
    blurb:
      "Rough carpentry crews for stick-built and panelized residential, multifamily, and light commercial framing.",
    projectTypes: ["Single-family residential", "Multifamily / Apartments", "Light commercial", "Remodel / Addition"],
    subBenefits: [
      "Crews sized to your production schedule — 3-man, 4-man, or full-squad matches",
      "Stick-built and panelized jobs matched to your specialty",
      "Direct contact with the GC before you bid — no middlemen",
      "Verified scope, start dates, and material availability before mobilization",
      "Same-week dry-in requests for weather-critical schedules",
    ],
    averageCrewSize: "4–8 men",
    stateLicenseRequirement: {
      NC: "In North Carolina, framing contractors working on jobs over $30,000 must hold a NC General Contractors License. We verify this for you.",
      SC: "In South Carolina, residential framing crews need a SC Residential Builders License for projects exceeding $5,000. We verify this for you.",
      GA: "In Georgia, framing subcontractors on projects over $2,500 must hold a GA Residential Basic Contractor license. We verify this for you.",
      TN: "In Tennessee, framing contractors need a TN Home Improvement License for remodeling jobs and a contractor's license for new builds over $25,000. We verify this for you.",
      TX: "In Texas, framing crews generally work under the GC's license, but crews performing structural framing should carry a Texas residential builder registration. We verify this for you.",
      AZ: "In Arizona, framing subcontractors on residential jobs over $1,000 must hold an AZ Registrar of Contractors license (B-1 or R-62). We verify this for you.",
    },
  },
  {
    slug: "drywall-subcontractors",
    name: "Drywall Subcontractors",
    singular: "Drywall Crew",
    blurb:
      "Hang, tape, finish, and texture crews sized for punch-list repairs up to full-building multifamily turns.",
    projectTypes: ["Single-family residential", "Multifamily / Apartments", "Tenant improvement", "Repair / Patchwork"],
    subBenefits: [
      "Hang-tape-finish crews matched to job square footage and timeline",
      "Skip the union hall — direct-to-GC referrals with verified scopes",
      "Production builders and custom home GCs both in the network",
      "Punch-list to full-building multifamily turns — you pick the project size",
      "No pay-per-lead fees — contract directly with the GC on your terms",
    ],
    averageCrewSize: "3–6 men",
    stateLicenseRequirement: {
      NC: "In North Carolina, drywall contractors on jobs over $30,000 need a NC General Contractors License. We verify this for you.",
      SC: "In South Carolina, drywall subcontractors need a SC Residential Builders License for projects over $5,000. We verify this for you.",
      GA: "In Georgia, drywall contractors on projects over $2,500 need a GA Residential Basic Contractor license. We verify this for you.",
      TN: "In Tennessee, drywall subs need a TN Home Improvement License for remodeling jobs and a contractor's license for new construction over $25,000. We verify this for you.",
      TX: "In Texas, drywall subcontractors generally work under the GC's license; no standalone drywall license is required at the state level. We verify this for you.",
      AZ: "In Arizona, drywall contractors on jobs over $1,000 require an AZ Registrar of Contractors license (R-10). We verify this for you.",
    },
  },
  {
    slug: "electrical-contractors",
    name: "Electrical Contractors",
    singular: "Electrical Crew",
    blurb:
      "Licensed electricians and journeyman-led crews for rough-in, trim-out, service upgrades, and inspections.",
    projectTypes: ["Residential rough-in", "Commercial build-out", "Service upgrade", "Troubleshooting / Repair"],
    subBenefits: [
      "Master electrician and journeyman-led crews only — no unlicensed labor",
      "Rough-in, trim-out, and service upgrade requests pre-qualified to your license class",
      "Commercial build-out jobs with permit-ready scopes",
      "GCs who understand load calcs and inspection timelines",
      "Weekend troubleshooting and emergency repair leads available",
    ],
    averageCrewSize: "2–5 men",
    stateLicenseRequirement: {
      NC: "In North Carolina, electrical contractors must hold a NC State Board of Electrical Examiners license (Limited, Intermediate, or Unlimited). We verify this for you.",
      SC: "In South Carolina, electricians must hold a SC Contractor's Licensing Board electrical license (Residential or Commercial). We verify this for you.",
      GA: "In Georgia, electrical contractors must hold a GA State Board of Electrical Contractors license (Class I or Class II). We verify this for you.",
      TN: "In Tennessee, electrical contractors need a TN Board for Licensing Contractors electrical license (L.L.E. or C.E.). We verify this for you.",
      TX: "In Texas, HVAC subs must hold a TDLR license. We verify this for you.",
      AZ: "In Arizona, electrical contractors must hold an AZ Registrar of Contractors license (R-11, C-11, or K-11). We verify this for you.",
    },
  },
  {
    slug: "plumbing-contractors",
    name: "Plumbing Contractors",
    singular: "Plumbing Crew",
    blurb: "Licensed plumbers for underslab, rough-in, top-out, and fixture set on tight production schedules.",
    projectTypes: ["Residential rough-in", "Commercial build-out", "Repipe", "Service / Repair"],
    subBenefits: [
      "Licensed crews matched to underslab, rough-in, top-out, and fixture set phases",
      "Repipe and service calls routed directly to your crew lead",
      "GCs who schedule inspections ahead of your rough-in window",
      "No competing bids — GCs come to you ready to negotiate",
      "Material-heavy jobs flagged upfront so you can quote accurately",
    ],
    averageCrewSize: "2–5 men",
    stateLicenseRequirement: {
      NC: "In North Carolina, plumbing contractors must hold a NC State Board of Examiners of Plumbing, Heating & Fire Sprinklers license. We verify this for you.",
      SC: "In South Carolina, plumbers must hold a SC Contractor's Licensing Board plumbing license. We verify this for you.",
      GA: "In Georgia, plumbing contractors must hold a GA State Construction Industry Licensing Board Master Plumber license. We verify this for you.",
      TN: "In Tennessee, plumbing contractors need a TN Board for Licensing Contractors plumbing license. We verify this for you.",
      TX: "In Texas, plumbing contractors must hold a Texas State Board of Plumbing Examiners license (Tradesman, Journeyman, or Master). We verify this for you.",
      AZ: "In Arizona, plumbing contractors must hold an AZ Registrar of Contractors license (R-37, C-37, or C-37R). We verify this for you.",
    },
  },
  {
    slug: "concrete-contractors",
    name: "Concrete Contractors",
    singular: "Concrete Crew",
    blurb: "Form, pour, and finish crews for footings, slabs, flatwork, and structural concrete.",
    projectTypes: ["Footings / Foundation", "Slab on grade", "Flatwork / Sidewalks", "Structural concrete"],
    subBenefits: [
      "Footing, slab, and flatwork pours matched by yardage and your crew capacity",
      "Weather-dependent scheduling — GCs coordinate pour dates with your availability",
      "Form-set, rebar-tie, and pump-ready jobs pre-verified before you arrive",
      "Structural concrete and foundation work from repeat GCs",
      "Short-pour and small-yardage jobs also available — not just big pours",
    ],
    averageCrewSize: "4–10 men",
    stateLicenseRequirement: {
      NC: "In North Carolina, concrete contractors on jobs over $30,000 need a NC General Contractors License. We verify this for you.",
      SC: "In South Carolina, concrete subcontractors need a SC Residential Builders License for projects over $5,000. We verify this for you.",
      GA: "In Georgia, concrete contractors on projects over $2,500 need a GA Residential Basic Contractor license. We verify this for you.",
      TN: "In Tennessee, concrete subs need a TN contractor's license for jobs over $25,000. We verify this for you.",
      TX: "In Texas, concrete contractors generally work under the GC's license; no standalone concrete license at the state level. We verify this for you.",
      AZ: "In Arizona, concrete contractors on jobs over $1,000 require an AZ Registrar of Contractors license (R-4, C-4, or K-4). We verify this for you.",
    },
  },
  {
    slug: "roofing-subcontractors",
    name: "Roofing Subcontractors",
    singular: "Roofing Crew",
    blurb: "Shingle, metal, and low-slope crews with fall-protection compliance and same-week dry-in.",
    projectTypes: ["Asphalt shingle", "Metal roofing", "Low-slope / TPO", "Repair / Tear-off"],
    subBenefits: [
      "Shingle, metal, and low-slope jobs matched to your crew's expertise",
      "Fall-protection compliance verified — GCs who take safety seriously",
      "Same-week dry-in requests for weather-critical schedules",
      "Insurance repair and tear-off jobs from vetted contractors",
      "Material order confirmed before you mobilize — no wasted trips",
    ],
    averageCrewSize: "3–7 men",
    stateLicenseRequirement: {
      NC: "In North Carolina, roofing contractors on jobs over $30,000 need a NC General Contractors License. We verify this for you.",
      SC: "In South Carolina, roofing contractors need a SC Residential Builders License for projects over $5,000. We verify this for you.",
      GA: "In Georgia, roofing contractors on projects over $2,500 need a GA Residential Basic Contractor license. We verify this for you.",
      TN: "In Tennessee, roofing contractors need a TN contractor's license for jobs over $25,000. We verify this for you.",
      TX: "In Texas, roofing contractors generally work under the GC's license; no standalone roofing license required at the state level. We verify this for you.",
      AZ: "In Arizona, roofing contractors on jobs over $1,000 require an AZ Registrar of Contractors license (R-42, C-42, or CR-42). We verify this for you.",
    },
  },
  {
    slug: "painting-contractors",
    name: "Painting Contractors",
    singular: "Painting Crew",
    blurb: "Spray and roll crews for new construction production painting, repaints, and commercial coatings.",
    projectTypes: ["New construction", "Repaint", "Commercial coatings", "Punch-list"],
    subBenefits: [
      "Spray and roll crews matched to new construction production schedules",
      "Interior and exterior jobs — you choose your scope and season",
      "Commercial coatings and multi-unit repaints from repeat GCs",
      "Punch-list and touch-up work when you need fill-in jobs between big projects",
      "Paint specs and color schedules provided upfront — no guessing on bid day",
    ],
    averageCrewSize: "2–4 men",
    stateLicenseRequirement: {
      NC: "In North Carolina, painting contractors on jobs over $30,000 need a NC General Contractors License. We verify this for you.",
      SC: "In South Carolina, painting subcontractors need a SC Residential Builders License for projects over $5,000. We verify this for you.",
      GA: "In Georgia, painting contractors on projects over $2,500 need a GA Residential Basic Contractor license. We verify this for you.",
      TN: "In Tennessee, painting contractors need a TN Home Improvement License for remodeling jobs and a contractor's license for new construction over $25,000. We verify this for you.",
      TX: "In Texas, painting contractors generally work under the GC's license; no standalone painting license required at the state level. We verify this for you.",
      AZ: "In Arizona, painting contractors on jobs over $1,000 require an AZ Registrar of Contractors license (R-34 or C-34). We verify this for you.",
    },
  },
  {
    slug: "hvac-contractors",
    name: "HVAC Contractors",
    singular: "HVAC Crew",
    blurb: "Mechanical crews for duct rough-in, equipment set, start-up, and load-calc documentation.",
    projectTypes: ["Residential install", "Commercial install", "Change-out", "Service / Repair"],
    subBenefits: [
      "Duct rough-in, equipment set, and start-up jobs matched to your crew size",
      "Load-calc documentation provided — GCs who do their homework",
      "Residential change-outs and full-system installs with permit-ready scopes",
      "Commercial mechanical rooms and rooftop unit replacements",
      "Seasonal service and repair leads to keep your crew busy year-round",
    ],
    averageCrewSize: "2–4 men",
    stateLicenseRequirement: {
      NC: "In North Carolina, HVAC contractors must hold a NC State Board of Examiners of Plumbing, Heating & Fire Sprinklers license (H-2 or H-3 classification). We verify this for you.",
      SC: "In South Carolina, HVAC contractors must hold a SC Contractor's Licensing Board mechanical license. We verify this for you.",
      GA: "In Georgia, HVAC contractors must hold a GA State Construction Industry Licensing Board Conditioned Air Contractor license. We verify this for you.",
      TN: "In Tennessee, HVAC contractors need a TN Board for Licensing Contractors mechanical license. We verify this for you.",
      TX: "In Texas, HVAC subs must hold a TDLR license. We verify this for you.",
      AZ: "In Arizona, HVAC contractors must hold an AZ Registrar of Contractors license (R-39, C-39, or CR-39). We verify this for you.",
    },
  },
]

export const cities: City[] = [
  {
    slug: "raleigh",
    name: "Raleigh",
    state: "NC",
    metro: "Research Triangle",
    nearby: [
      { slug: "durham", name: "Durham" },
      { slug: "charlotte", name: "Charlotte" },
      { slug: "greensboro", name: "Greensboro" },
    ],
    majorCounties: "Serving Wake, Durham, and Orange counties.",
    localMarketStat: "With over 12,000 new single-family permits pulled in the Triangle this year and a 15% year-over-year increase in multifamily starts, subcontractor availability is tighter than ever.",
  },
  {
    slug: "durham",
    name: "Durham",
    state: "NC",
    metro: "Research Triangle",
    nearby: [
      { slug: "raleigh", name: "Raleigh" },
      { slug: "greensboro", name: "Greensboro" },
      { slug: "charlotte", name: "Charlotte" },
    ],
    majorCounties: "Serving Durham, Wake, and Orange counties.",
    localMarketStat: "Durham County alone issued over 3,800 residential permits last year. With the downtown revitalization adding 2,000+ multifamily units annually, drywall and electrical crews are in high demand.",
  },
  {
    slug: "charlotte",
    name: "Charlotte",
    state: "NC",
    metro: "Charlotte Metro",
    nearby: [
      { slug: "raleigh", name: "Raleigh" },
      { slug: "greenville", name: "Greenville" },
      { slug: "durham", name: "Durham" },
    ],
    majorCounties: "Serving Mecklenburg, Union, Cabarrus, and Gaston counties.",
    localMarketStat: "Charlotte is the fastest-growing metro in the Carolinas with over 18,000 housing starts in the past 12 months. GCs report 6–8 week backlogs for framing and concrete crews across Mecklenburg County.",
  },
  {
    slug: "greensboro",
    name: "Greensboro",
    state: "NC",
    metro: "Piedmont Triad",
    nearby: [
      { slug: "durham", name: "Durham" },
      { slug: "charlotte", name: "Charlotte" },
      { slug: "raleigh", name: "Raleigh" },
    ],
    majorCounties: "Serving Guilford, Forsyth, Alamance, and Randolph counties.",
    localMarketStat: "The Piedmont Triad posted a 22% increase in commercial building permits last quarter. With Toyota's battery plant driving thousands of new housing starts, every trade from concrete to HVAC is stretched thin.",
  },
  {
    slug: "greenville",
    name: "Greenville",
    state: "SC",
    metro: "Upstate",
    nearby: [
      { slug: "charlotte", name: "Charlotte" },
      { slug: "atlanta", name: "Atlanta" },
      { slug: "greensboro", name: "Greensboro" },
    ],
    majorCounties: "Serving Greenville, Spartanburg, Anderson, and Pickens counties.",
    localMarketStat: "The Upstate is booming — Greenville County alone recorded 5,200 new residential permits this year, a 19% jump. Roofing and framing crews are booking 4–6 weeks out across the I-85 corridor.",
  },
  {
    slug: "atlanta",
    name: "Atlanta",
    state: "GA",
    metro: "Metro Atlanta",
    nearby: [
      { slug: "greenville", name: "Greenville" },
      { slug: "charlotte", name: "Charlotte" },
      { slug: "nashville", name: "Nashville" },
    ],
    majorCounties: "Serving Fulton, Cobb, Gwinnett, DeKalb, and Forsyth counties.",
    localMarketStat: "Metro Atlanta is on pace for 35,000+ new housing units this year across the 29-county MSA. GCs in Cobb and Gwinnett counties report critical shortages of electrical and plumbing crews for production builds.",
  },
  {
    slug: "nashville",
    name: "Nashville",
    state: "TN",
    metro: "Middle Tennessee",
    nearby: [
      { slug: "atlanta", name: "Atlanta" },
      { slug: "charlotte", name: "Charlotte" },
      { slug: "dallas", name: "Dallas" },
    ],
    majorCounties: "Serving Davidson, Williamson, Rutherford, and Sumner counties.",
    localMarketStat: "Nashville added 98 new residents per day last year. With 16,000+ residential permits pulled across Middle Tennessee, framing and concrete crews are in critical shortage — some GCs are paying 20% above market rates.",
  },
  {
    slug: "dallas",
    name: "Dallas",
    state: "TX",
    metro: "DFW Metroplex",
    nearby: [
      { slug: "austin", name: "Austin" },
      { slug: "nashville", name: "Nashville" },
      { slug: "phoenix", name: "Phoenix" },
    ],
    majorCounties: "Serving Dallas, Collin, Denton, Tarrant, and Rockwall counties.",
    localMarketStat: "DFW leads the nation in housing starts with over 68,000 new units permitted this year. The northern suburbs in Collin and Denton counties are so backlogged that GCs are importing crews from Oklahoma and Louisiana.",
  },
  {
    slug: "austin",
    name: "Austin",
    state: "TX",
    metro: "Central Texas",
    nearby: [
      { slug: "dallas", name: "Dallas" },
      { slug: "phoenix", name: "Phoenix" },
      { slug: "nashville", name: "Nashville" },
    ],
    majorCounties: "Serving Travis, Williamson, Hays, and Bastrop counties.",
    localMarketStat: "Austin construction employment grew 8% year-over-year, but demand still outpaces supply. With 22,000+ residential permits pulled in Central Texas, HVAC and electrical subs can command premium rates year-round.",
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    state: "AZ",
    metro: "Valley of the Sun",
    nearby: [
      { slug: "dallas", name: "Dallas" },
      { slug: "austin", name: "Austin" },
      { slug: "atlanta", name: "Atlanta" },
    ],
    majorCounties: "Serving Maricopa, Pinal, and Yavapai counties.",
    localMarketStat: "Phoenix remains one of the top 3 housing markets in the country with 31,000+ single-family permits this year. The West Valley and Pinal County submarkets are especially underserved — roofing and drywall crews can fill their calendars 12 months a year.",
  },
]

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug)
}

export function getTrade(slug: string) {
  return trades.find((t) => t.slug === slug)
}

export function cityLabel(city: City) {
  return `${city.name}, ${city.state}`
}

export function getLicenseReq(trade: Trade, state: string): string {
  return trade.stateLicenseRequirement[state] ?? "Active trade license and general liability coverage required. We verify this for you."
}