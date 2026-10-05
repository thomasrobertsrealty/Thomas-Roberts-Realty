export const SITE = {
  // Vercel is configured with www as the primary domain (thomasrobertsrealty.co 308-redirects
  // here) — this must match, or canonical tags/sitemap end up pointing at a URL that redirects
  // instead of the page that actually serves 200, which Google's docs flag as a canonicalization error.
  url: 'https://www.thomasrobertsrealty.co',
  agentName: 'Thomas Roberts',
  brokerage: 'Silvercreek Realty Group',
  phone: '(208) 709-1790',
  phoneRaw: '+12087091790',
  email: 'ThomasRobertsRealty@gmail.com',
  // TODO: add your Idaho real estate license number
  licenseNumber: 'Licensed Idaho Real Estate Agent',
  addressLocality: 'Idaho Falls',
  addressRegion: 'ID',
  tagline: 'Sell or Buy Without an Agent — Get Only the Help You Actually Need',
  // Core, repeatable GEO facts — reused verbatim in schema and phrased consistently across pages.
  areaSentence:
    'Idaho Falls, Rexburg, Rigby, Ammon, Shelley, Blackfoot, and surrounding areas',
  responseCommitment: 'Thomas responds the same business day for messages received during business hours.',
}

// Flat-fee services. Every field renders as real, visible HTML text (not just inside the
// interactive selector) so search and AI crawlers can read the current prices.
export const SERVICES = [
  {
    slug: 'contract-help',
    name: 'Contract Help',
    priceLabel: '$3,000–$6,000 flat',
    priceLabelFull: '$3,000–$6,000 flat, based on home price',
    pricingModel: 'tiered',
    priceValue: 3000,
    priceHigh: 6000,
    // Flat fee by home price range. Edit here and every page, schema, and the selector update.
    tiers: [
      { id: 'tier-1', rangeLabel: '$300,000 – $400,000', price: 3000 },
      { id: 'tier-2', rangeLabel: '$400,000 – $600,000', price: 4500 },
      { id: 'tier-3', rangeLabel: '$600,000 – $1,000,000', price: 6000 },
    ],
    homeTeaser:
      'Full contract review and paperwork prep from offer to closing, handled as one complete package.',
    offerSentence:
      "Thomas reviews and helps prepare all of the paperwork and legal documents involved in a real estate transaction, from initial offer through closing, for a flat fee based on your home's price: $3,000 for homes priced $300,000 to $400,000, $4,500 for $400,000 to $600,000, and $6,000 for $600,000 to $1,000,000.",
    note: "If you choose contract support, it covers every document in your transaction — so nothing falls through the cracks and no paperwork is left half-reviewed.",
    fullScopeOnly: true,
  },
  {
    slug: 'marketing',
    name: 'Marketing',
    priceLabel: '$499 flat',
    priceLabelFull: '$499 flat',
    pricingModel: 'flat',
    priceValue: 499,
    homeTeaser: 'Professional listing photos, a written description, and syndication to the MLS and major listing sites.',
    offerSentence:
      "Thomas's marketing service includes professional listing photos, a written listing description, and syndication to the MLS and major listing sites to get a FSBO listing in front of buyers, for a flat fee of $499.",
  },
  {
    slug: 'open-houses',
    name: 'Open Houses',
    priceLabel: '$65/hr, 2-hr min',
    priceLabelFull: '$65/hour, 2-hour minimum',
    pricingModel: 'hourly',
    hourlyRate: 65,
    minimumHours: 2,
    minimumBooking: 130,
    homeTeaser: 'Thomas hosts and runs your open house from start to finish, so you don’t have to.',
    offerSentence:
      'Thomas hosts and runs open houses on the seller’s behalf, handling scheduling, signage, and in-person buyer questions, billed at $65 per hour with a two-hour minimum ($130 minimum booking).',
  },
  {
    slug: 'market-data',
    name: 'Market Data',
    priceLabel: '$150 flat',
    priceLabelFull: '$150 flat',
    pricingModel: 'flat',
    priceValue: 150,
    homeTeaser: 'Comparable sales, pricing guidance, and local market trends for your specific area.',
    offerSentence:
      'Thomas provides comparable sales data, pricing guidance, and local market trends to help FSBO sellers and buyers price and negotiate with confidence, for a flat fee of $150.',
  },
]

export const AREAS = [
  {
    slug: 'idaho-falls',
    name: 'Idaho Falls',
    blurb:
      'The commercial and cultural hub of Southeast Idaho, Idaho Falls offers a mix of established riverside neighborhoods, new-build subdivisions, and a growing downtown core along the Snake River Greenbelt.',
  },
  {
    slug: 'rexburg',
    name: 'Rexburg',
    blurb:
      'Anchored by BYU-Idaho, Rexburg is one of the fastest-growing markets in the region, with strong demand for both single-family homes and student/investment rental properties.',
  },
  {
    slug: 'rigby',
    name: 'Rigby',
    blurb:
      'A quieter, family-oriented community northeast of Idaho Falls, Rigby offers more land per dollar and easy access to the Snake River and Yellowstone Highway.',
  },
  {
    slug: 'ammon',
    name: 'Ammon',
    blurb:
      'A fast-growing suburb of Idaho Falls, Ammon is popular with families looking for newer construction, larger lots, and top-rated schools just minutes from the city.',
  },
  {
    slug: 'shelley',
    name: 'Shelley',
    blurb:
      'A close-knit small town south of Idaho Falls, Shelley appeals to buyers wanting a slower pace, larger lots, and a strong sense of community within easy commuting distance.',
  },
  {
    slug: 'blackfoot',
    name: 'Blackfoot',
    blurb:
      'A more affordable entry point into the Southeast Idaho market, Blackfoot appeals to first-time buyers and those looking for acreage within commuting distance of Idaho Falls.',
  },
]

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/what-i-offer', label: 'What I Offer' },
  { href: '/fsbo-help', label: 'FSBO Help' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
]
