export const site = {
  name: "CrewNetUSA",
  tagline: "Subcontractor Network for General Contractors",
  phoneDisplay: "(919) 555-0142",
  phoneHref: "tel:+19195550142",
  whatsappPhone: "19195550142",
  whatsappHref: "https://wa.me/19195550142",
  email: "dispatch@crewnetusa.com",
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

export type LocationType = 'metro-hub' | 'suburb'

export type City = {
  slug: string
  name: string
  state: string
  metro: string
  type: LocationType
  parentMetro?: string
  nearbySuburbs?: string[]
  majorCounties: string
  localMarketStat: string
}

export type ContentOverride = {
  heroSubheading?: string
  uniqueParagraph?: string
  expertise?: string[]
  compliance?: string[]
  marketVibe?: string
  recentPlacements?: string[]
}

export const trades: Trade[] = [
  {
    slug: "framing-subcontractors",
    name: "Framing Subcontractors",
    singular: "Framing Crew",
    blurb: "Rough carpentry crews for stick-built and panelized residential, multifamily, and light commercial framing.",
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
    blurb: "Hang, tape, finish, and texture crews sized for punch-list repairs up to full-building multifamily turns.",
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
      TX: "In Texas, drywall subcontractors generally work under the GC's license. We verify this for you.",
      AZ: "In Arizona, drywall contractors on jobs over $1,000 require an AZ Registrar of Contractors license (R-10). We verify this for you.",
    },
  },
  {
    slug: "electrical-contractors",
    name: "Electrical Contractors",
    singular: "Electrical Crew",
    blurb: "Licensed electricians and journeyman-led crews for rough-in, trim-out, service upgrades, and inspections.",
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
      NC: "In North Carolina, electrical contractors must hold a NC State Board of Electrical Examiners license. We verify this for you.",
      SC: "In South Carolina, electricians must hold a SC Contractor's Licensing Board electrical license. We verify this for you.",
      GA: "In Georgia, electrical contractors must hold a GA State Board of Electrical Contractors license. We verify this for you.",
      TN: "In Tennessee, electrical contractors need a TN Board for Licensing Contractors electrical license. We verify this for you.",
      TX: "In Texas, electrical subs must hold a TDLR license. We verify this for you.",
      AZ: "In Arizona, electrical contractors must hold an AZ Registrar of Contractors license. We verify this for you.",
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
      NC: "In North Carolina, plumbing contractors must hold a NC State Board of Examiners of Plumbing license. We verify this for you.",
      SC: "In South Carolina, plumbers must hold a SC Contractor's Licensing Board plumbing license. We verify this for you.",
      GA: "In Georgia, plumbing contractors must hold a GA Master Plumber license. We verify this for you.",
      TN: "In Tennessee, plumbing contractors need a TN Board for Licensing Contractors plumbing license. We verify this for you.",
      TX: "In Texas, plumbing contractors must hold a Texas State Board of Plumbing Examiners license. We verify this for you.",
      AZ: "In Arizona, plumbing contractors must hold an AZ Registrar of Contractors license. We verify this for you.",
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
      NC: "In NC, concrete contractors on jobs over $30,000 need a General Contractors License. We verify this for you.",
      SC: "In SC, concrete subcontractors need a Residential Builders License for projects over $5,000. We verify this for you.",
      GA: "In GA, concrete contractors on projects over $2,500 need a Residential Basic Contractor license. We verify this for you.",
      TN: "In TN, concrete subs need a contractor's license for jobs over $25,000. We verify this for you.",
      TX: "In TX, concrete contractors generally work under the GC's license. We verify this for you.",
      AZ: "In AZ, concrete contractors on jobs over $1,000 require an AZ Registrar of Contractors license. We verify this for you.",
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
      NC: "In NC, roofing contractors on jobs over $30,000 need a General Contractors License. We verify this for you.",
      SC: "In SC, roofing contractors need a Residential Builders License for projects over $5,000. We verify this for you.",
      GA: "In GA, roofing contractors on projects over $2,500 need a Residential Basic Contractor license. We verify this for you.",
      TN: "In TN, roofing contractors need a contractor's license for jobs over $25,000. We verify this for you.",
      TX: "In TX, roofing contractors generally work under the GC's license. We verify this for you.",
      AZ: "In AZ, roofing contractors on jobs over $1,000 require an AZ Registrar of Contractors license. We verify this for you.",
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
      NC: "In NC, painting contractors on jobs over $30,000 need a General Contractors License. We verify this for you.",
      SC: "In SC, painting subcontractors need a Residential Builders License for projects over $5,000. We verify this for you.",
      GA: "In GA, painting contractors on projects over $2,500 need a Residential Basic Contractor license. We verify this for you.",
      TN: "In TN, painting contractors need a Home Improvement License. We verify this for you.",
      TX: "In TX, painting contractors generally work under the GC's license. We verify this for you.",
      AZ: "In AZ, painting contractors on jobs over $1,000 require an AZ Registrar of Contractors license. We verify this for you.",
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
      NC: "In North Carolina, HVAC contractors must hold a NC State Board of Examiners license. We verify this for you.",
      SC: "In South Carolina, HVAC contractors must hold a SC Contractor's Licensing Board mechanical license. We verify this for you.",
      GA: "In Georgia, HVAC contractors must hold a GA Conditioned Air Contractor license. We verify this for you.",
      TN: "In Tennessee, HVAC contractors need a TN Board mechanical license. We verify this for you.",
      TX: "In Texas, HVAC subs must hold a TDLR license. We verify this for you.",
      AZ: "In Arizona, HVAC contractors must hold an AZ Registrar of Contractors license. We verify this for you.",
    },
  },
]

export const cities: City[] = [
  // --- RALEIGH HUB & SPOKES ---
  { slug: "raleigh", name: "Raleigh", state: "NC", metro: "Research Triangle", type: "metro-hub", nearbySuburbs: ["apex", "cary", "wake-forest"], majorCounties: "Serving Wake, Durham, and Orange counties.", localMarketStat: "With over 12,000 new single-family permits pulled in the Triangle this year, subcontractor availability is tighter than ever." },
  { slug: "apex", name: "Apex", state: "NC", metro: "Research Triangle", type: "suburb", parentMetro: "raleigh", majorCounties: "Serving Wake County.", localMarketStat: "Apex's master-planned residential growth requires rapid deployment of licensed trades." },
  { slug: "cary", name: "Cary", state: "NC", metro: "Research Triangle", type: "suburb", parentMetro: "raleigh", majorCounties: "Serving Wake and Chatham counties.", localMarketStat: "High-end corporate campuses and luxury renovations in Cary demand highly vetted subcontractors." },
  { slug: "wake-forest", name: "Wake Forest", state: "NC", metro: "Research Triangle", type: "suburb", parentMetro: "raleigh", majorCounties: "Serving Wake and Franklin counties.", localMarketStat: "Rapid northern suburban sprawl means framing and concrete crews are booking 4-6 weeks out." },

  // --- DURHAM HUB & SPOKES ---
  { slug: "durham", name: "Durham", state: "NC", metro: "Research Triangle", type: "metro-hub", nearbySuburbs: ["chapel-hill", "hillsborough", "carrboro"], majorCounties: "Serving Durham, Wake, and Orange counties.", localMarketStat: "Durham County issued over 3,800 residential permits last year. Drywall and electrical crews are in high demand." },
  { slug: "chapel-hill", name: "Chapel Hill", state: "NC", metro: "Research Triangle", type: "suburb", parentMetro: "durham", majorCounties: "Serving Orange County.", localMarketStat: "Strict local zoning and university-adjacent commercial build-outs require highly compliant tradesmen." },
  { slug: "hillsborough", name: "Hillsborough", state: "NC", metro: "Research Triangle", type: "suburb", parentMetro: "durham", majorCounties: "Serving Orange County.", localMarketStat: "Expanding residential subdivisions along the I-85 corridor have created a severe shortage of MEP trades." },
  { slug: "carrboro", name: "Carrboro", state: "NC", metro: "Research Triangle", type: "suburb", parentMetro: "durham", majorCounties: "Serving Orange County.", localMarketStat: "High-density infill and mixed-use development are driving demand for specialized structural crews." },

  // --- CHARLOTTE HUB & SPOKES ---
  { slug: "charlotte", name: "Charlotte", state: "NC", metro: "Charlotte Metro", type: "metro-hub", nearbySuburbs: ["huntersville", "concord", "gastonia"], majorCounties: "Serving Mecklenburg, Union, and Gaston counties.", localMarketStat: "Charlotte is the fastest-growing metro in the Carolinas. GCs report 6–8 week backlogs for concrete crews." },
  { slug: "huntersville", name: "Huntersville", state: "NC", metro: "Charlotte Metro", type: "suburb", parentMetro: "charlotte", majorCounties: "Serving North Mecklenburg County.", localMarketStat: "Lake Norman waterfront luxury builds and commercial retail are absorbing local labor rapidly." },
  { slug: "concord", name: "Concord", state: "NC", metro: "Charlotte Metro", type: "suburb", parentMetro: "charlotte", majorCounties: "Serving Cabarrus County.", localMarketStat: "Heavy logistics, warehousing, and massive subdivisions off I-85 require high-volume production crews." },
  { slug: "gastonia", name: "Gastonia", state: "NC", metro: "Charlotte Metro", type: "suburb", parentMetro: "charlotte", majorCounties: "Serving Gaston County.", localMarketStat: "Affordable housing tracts and manufacturing facility expansions have drained local subcontractor pools." },

  // --- GREENSBORO HUB & SPOKES ---
  { slug: "greensboro", name: "Greensboro", state: "NC", metro: "Piedmont Triad", type: "metro-hub", nearbySuburbs: ["high-point", "burlington", "kernersville"], majorCounties: "Serving Guilford, Forsyth, and Alamance counties.", localMarketStat: "The Piedmont Triad posted a 22% increase in commercial building permits last quarter." },
  { slug: "high-point", name: "High Point", state: "NC", metro: "Piedmont Triad", type: "suburb", parentMetro: "greensboro", majorCounties: "Serving Guilford County.", localMarketStat: "Industrial and furniture-market facility expansions require robust commercial MEP trades." },
  { slug: "burlington", name: "Burlington", state: "NC", metro: "Piedmont Triad", type: "suburb", parentMetro: "greensboro", majorCounties: "Serving Alamance County.", localMarketStat: "Located between two major hubs, Burlington's residential sprawl is pulling labor from all directions." },
  { slug: "kernersville", name: "Kernersville", state: "NC", metro: "Piedmont Triad", type: "suburb", parentMetro: "greensboro", majorCounties: "Serving Forsyth County.", localMarketStat: "Heavy logistics and distribution center construction has created a premium on commercial concrete and steel trades." },

  // --- GREENVILLE HUB & SPOKES ---
  { slug: "greenville", name: "Greenville", state: "SC", metro: "Upstate", type: "metro-hub", nearbySuburbs: ["spartanburg", "greer", "mauldin"], majorCounties: "Serving Greenville, Spartanburg, and Anderson counties.", localMarketStat: "Greenville County alone recorded 5,200 new residential permits this year, a 19% jump." },
  { slug: "spartanburg", name: "Spartanburg", state: "SC", metro: "Upstate", type: "suburb", parentMetro: "greenville", majorCounties: "Serving Spartanburg County.", localMarketStat: "Massive manufacturing and automotive supply chain builds require specialized commercial crews." },
  { slug: "greer", name: "Greer", state: "SC", metro: "Upstate", type: "suburb", parentMetro: "greenville", majorCounties: "Serving Greenville and Spartanburg counties.", localMarketStat: "Inland port logistics expansion means flatwork and commercial roofing subs are heavily backlogged." },
  { slug: "mauldin", name: "Mauldin", state: "SC", metro: "Upstate", type: "suburb", parentMetro: "greenville", majorCounties: "Serving Greenville County.", localMarketStat: "Rapid multi-family and retail strip developments are driving peak demand for drywall and plumbing." },

  // --- ATLANTA HUB & SPOKES ---
  { slug: "atlanta", name: "Atlanta", state: "GA", metro: "Metro Atlanta", type: "metro-hub", nearbySuburbs: ["alpharetta", "marietta", "roswell"], majorCounties: "Serving Fulton, Cobb, and Gwinnett counties.", localMarketStat: "Metro Atlanta is on pace for 35,000+ new housing units. Traffic requires strictly localized subcontractor dispatch." },
  { slug: "alpharetta", name: "Alpharetta", state: "GA", metro: "Metro Atlanta", type: "suburb", parentMetro: "atlanta", majorCounties: "Serving North Fulton County.", localMarketStat: "Major tech hubs and affluent housing demand premium finishes and reliable framing crews." },
  { slug: "marietta", name: "Marietta", state: "GA", metro: "Metro Atlanta", type: "suburb", parentMetro: "atlanta", majorCounties: "Serving Cobb County.", localMarketStat: "Industrial warehousing and hospital expansions require highly compliant commercial MEP trades." },
  { slug: "roswell", name: "Roswell", state: "GA", metro: "Metro Atlanta", type: "suburb", parentMetro: "atlanta", majorCounties: "Serving North Fulton County.", localMarketStat: "Historic downtown renovations and luxury multi-family require specialized infill contractors." },

  // --- NASHVILLE HUB & SPOKES ---
  { slug: "nashville", name: "Nashville", state: "TN", metro: "Middle Tennessee", type: "metro-hub", nearbySuburbs: ["franklin", "murfreesboro", "hendersonville"], majorCounties: "Serving Davidson, Williamson, and Rutherford counties.", localMarketStat: "With 16,000+ residential permits pulled, framing and concrete crews are in critical shortage across the region." },
  { slug: "franklin", name: "Franklin", state: "TN", metro: "Middle Tennessee", type: "suburb", parentMetro: "nashville", majorCounties: "Serving Williamson County.", localMarketStat: "Wealthy corporate relocations and high-end custom builds require strict architectural compliance." },
  { slug: "murfreesboro", name: "Murfreesboro", state: "TN", metro: "Middle Tennessee", type: "suburb", parentMetro: "nashville", majorCounties: "Serving Rutherford County.", localMarketStat: "Massive population influx is driving tract housing and school construction at record speeds." },
  { slug: "hendersonville", name: "Hendersonville", state: "TN", metro: "Middle Tennessee", type: "suburb", parentMetro: "nashville", majorCounties: "Serving Sumner County.", localMarketStat: "Lakefront properties and retail commercial growth have spiked demand for roofing and concrete subs." },

  // --- DALLAS HUB & SPOKES ---
  { slug: "dallas", name: "Dallas", state: "TX", metro: "DFW Metroplex", type: "metro-hub", nearbySuburbs: ["frisco", "plano", "mckinney"], majorCounties: "Serving Dallas, Collin, and Tarrant counties.", localMarketStat: "DFW leads the nation in housing starts. Expansive clay soils demand specialized concrete and framing knowledge." },
  { slug: "frisco", name: "Frisco", state: "TX", metro: "DFW Metroplex", type: "suburb", parentMetro: "dallas", majorCounties: "Serving Collin and Denton counties.", localMarketStat: "PGA headquarters and luxury mixed-use developments are absorbing commercial crews entirely." },
  { slug: "plano", name: "Plano", state: "TX", metro: "DFW Metroplex", type: "suburb", parentMetro: "dallas", majorCounties: "Serving Collin County.", localMarketStat: "Corporate headquarters build-outs keep low-voltage, electrical, and drywall crews at full capacity." },
  { slug: "mckinney", name: "McKinney", state: "TX", metro: "DFW Metroplex", type: "suburb", parentMetro: "dallas", majorCounties: "Serving Collin County.", localMarketStat: "Rapid northern residential sprawl relies on high-volume production framing and plumbing trades." },

  // --- AUSTIN HUB & SPOKES ---
  { slug: "austin", name: "Austin", state: "TX", metro: "Central Texas", type: "metro-hub", nearbySuburbs: ["round-rock", "georgetown", "cedar-park"], majorCounties: "Serving Travis and Williamson counties.", localMarketStat: "Austin construction employment grew 8% YoY. Rocky limestone excavation complicates underground trade schedules." },
  { slug: "round-rock", name: "Round Rock", state: "TX", metro: "Central Texas", type: "suburb", parentMetro: "austin", majorCounties: "Serving Williamson County.", localMarketStat: "Tech-manufacturing hubs and endless residential sprawl require massive concrete and structural steel scaling." },
  { slug: "georgetown", name: "Georgetown", state: "TX", metro: "Central Texas", type: "suburb", parentMetro: "austin", majorCounties: "Serving Williamson County.", localMarketStat: "Heavy retirement community builds create consistent demand for drywall, painting, and HVAC trades." },
  { slug: "cedar-park", name: "Cedar Park", state: "TX", metro: "Central Texas", type: "suburb", parentMetro: "austin", majorCounties: "Serving Williamson County.", localMarketStat: "Retail power centers and high-density mixed use require fast, reliable commercial subcontracting." },

  // --- PHOENIX HUB & SPOKES ---
  { slug: "phoenix", name: "Phoenix", state: "AZ", metro: "Valley of the Sun", type: "metro-hub", nearbySuburbs: ["scottsdale", "mesa", "chandler"], majorCounties: "Serving Maricopa and Pinal counties.", localMarketStat: "With 31,000+ single-family permits, extreme summer heat demands crews capable of early-morning production shifts." },
  { slug: "scottsdale", name: "Scottsdale", state: "AZ", metro: "Valley of the Sun", type: "suburb", parentMetro: "phoenix", majorCounties: "Serving Maricopa County.", localMarketStat: "Ultra-luxury custom homes and high-end hospitality builds require elite, detail-oriented tradesmen." },
  { slug: "mesa", name: "Mesa", state: "AZ", metro: "Valley of the Sun", type: "suburb", parentMetro: "phoenix", majorCounties: "Serving Maricopa County.", localMarketStat: "East Valley tech expansions and heavy residential tracts are driving severe concrete and stucco shortages." },
  { slug: "chandler", name: "Chandler", state: "AZ", metro: "Valley of the Sun", type: "suburb", parentMetro: "phoenix", majorCounties: "Serving Maricopa County.", localMarketStat: "Semiconductor supply chain facilities demand strict commercial MEP (Mechanical, Electrical, Plumbing) compliance." },
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