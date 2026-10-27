export const SITE = {
  // Vercel is configured with the apex thomasrobertsrealty.co as the primary domain (www and the
  // old idahoforsalebyowner.com domain redirect here) - this must match, or canonical tags/sitemap
  // end up pointing at a URL that redirects instead of the page that actually serves 200, which
  // Google's docs flag as a canonicalization error.
  url: 'https://thomasrobertsrealty.co',
  // Google Analytics 4 Measurement ID (looks like G-XXXXXXXXXX). Leave empty to disable tracking.
  gaMeasurementId: 'G-HSRVSKV2D9',
  agentName: 'Thomas Roberts',
  brokerage: 'Silvercreek Realty Group',
  phone: '(208) 709-1790',
  phoneRaw: '+12087091790',
  email: 'ThomasRobertsRealty@gmail.com',
  // TODO: add your Idaho real estate license number
  licenseNumber: 'Licensed Idaho Real Estate Agent',
  addressLocality: 'Idaho Falls',
  addressRegion: 'ID',
  tagline: 'First-Time Home Buying in Southeast Idaho, Explained and Guided',
  // Core, repeatable GEO facts — reused verbatim in schema and phrased consistently across pages.
  areaSentence:
    'Idaho Falls, Rexburg, Rigby, Ammon, Shelley, Blackfoot, and surrounding areas',
  responseCommitment: 'Thomas responds the same business day for messages received during business hours.',
}

// First-time buyer services. Every field renders as real, visible HTML text so search and AI
// crawlers can read it. Add price fields here later if you want fees shown on the site.
export const SERVICES = [
  {
    slug: 'buyer-consultation',
    name: 'Free Buyer Consultation',
    homeTeaser:
      'A free 20 to 30 minute video call covering the buying process, your budget, and what to do first.',
    offerSentence:
      'Thomas offers a free 20 to 30 minute buyer consultation on Google Meet that walks first-time home buyers through the buying process, budgeting, pre-approval, and what to expect at each step, with no obligation.',
  },
  {
    slug: 'home-search',
    name: 'Home Search & Tours',
    homeTeaser:
      'Listings matched to your budget and must-haves, with showings scheduled and toured with you.',
    offerSentence:
      'Thomas helps first-time buyers find homes that fit their budget and must-haves, sets up showings, and tours homes with them, pointing out what to look for and what to question.',
  },
  {
    slug: 'offers-negotiation',
    name: 'Offers & Negotiation',
    homeTeaser:
      'Pricing guidance with comparable sales, a strong offer, and negotiation on your behalf.',
    offerSentence:
      'Thomas provides comparable sales data and pricing guidance, helps first-time buyers write a competitive offer, and negotiates price and terms on their behalf.',
  },
  {
    slug: 'contract-to-closing',
    name: 'Contract to Closing',
    homeTeaser:
      'Paperwork, inspections, appraisal, and deadlines handled and explained from accepted offer to keys.',
    offerSentence:
      'Thomas guides first-time buyers from accepted offer to closing, coordinating the contract paperwork, inspection, appraisal, lender, and title deadlines and explaining each step along the way.',
  },
]

// Ways a visitor can ask to be contacted; shown as checkboxes on both lead forms.
export const CONTACT_METHODS = ['Phone call', 'Text', 'Email']

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
  { href: '/first-time-buyers', label: 'First-Time Buyers' },
  { href: '/my-plan', label: 'My Plan' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
]
