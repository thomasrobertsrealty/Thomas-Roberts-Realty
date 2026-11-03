// Every outside source cited on the site, defined once so each page links to the same verified URL.
// Each of these pages was opened and read in November 2026 to confirm it supports the claim it is
// cited for. Programs and rates change, so re-check a source before updating the claim it backs.

export const SRC = {
  // Idaho Housing and Finance Association
  idahoHousingDpa: {
    label: 'Idaho Housing: Down Payment Assistance',
    href: 'https://www.idahohousing.com/homebuyers/down-payment-closing-cost-assistance/',
  },
  idahoHousingHomebuyers: {
    label: 'Idaho Housing: Homebuyers',
    href: 'https://www.idahohousing.com/homebuyers/',
  },

  // Federal loan programs
  hudFha: {
    label: 'HUD: FHA loans',
    href: 'https://www.hud.gov/helping-americans/loans',
  },
  hudBuying: {
    label: 'HUD: Buying a Home',
    href: 'https://www.hud.gov/helping-americans/buying-a-home',
  },
  vaPurchase: {
    label: 'VA: Purchase loan',
    href: 'https://www.va.gov/housing-assistance/home-loans/loan-types/purchase-loan/',
  },
  usdaGuaranteed: {
    label: 'USDA: Single Family Housing Guaranteed Loan Program overview (PDF)',
    href: 'https://www.rd.usda.gov/media/file/download/usda-rd-sfh-guarantee-loan-program-101-jan-2026.pdf',
  },
  usdaEligibility: {
    label: 'USDA: Income and Property Eligibility Site',
    href: 'https://eligibility.sc.egov.usda.gov/',
  },

  // Conventional low down payment programs
  fannieHomeReady: {
    label: 'Fannie Mae: HomeReady',
    href: 'https://yourhome.fanniemae.com/buy/homeready',
  },
  fannie97: {
    label: 'Fannie Mae: 97% LTV options FAQ',
    href: 'https://singlefamily.fanniemae.com/learning-center/originating-and-underwriting/faqs-97-ltv-options',
  },
  freddieHomePossible: {
    label: 'Freddie Mac: 3% down payment (Home Possible)',
    href: 'https://myhome.freddiemac.com/buying/3-percent-down-payment',
  },

  // Consumer Financial Protection Bureau
  cfpbMortgageInsurance: {
    label: 'CFPB: What is mortgage insurance and how does it work?',
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-mortgage-insurance-and-how-does-it-work-en-1953/',
  },
  cfpbDti: {
    label: 'CFPB: What is a debt-to-income ratio?',
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/',
  },
  cfpbPreapproval: {
    label: 'CFPB: Get a preapproval letter',
    href: 'https://www.consumerfinance.gov/owning-a-home/explore/get-a-preapproval-letter/',
  },
  cfpbPrequal: {
    label: 'CFPB: Prequalification vs. preapproval',
    href: 'https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-prequalification-letter-and-a-preapproval-letter-en-127/',
  },
  cfpbLoanEstimate: {
    label: 'CFPB: What is a Loan Estimate?',
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-estimate-en-1995/',
  },
  cfpbClosingCosts: {
    label: 'CFPB: What costs come with taking out a mortgage?',
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-costs-come-with-taking-out-a-mortgage-en-153/',
  },

  // Real estate agent compensation rules
  narSettlement: {
    label: 'NAR: Settlement FAQs (written buyer agreements)',
    href: 'https://d7.nar.realtor/the-facts/nar-settlement-faqs',
  },
}

// Combine several source lists into one, with duplicates (same URL) removed.
export function uniqueSources(...lists) {
  const seen = new Set()
  const out = []
  for (const list of lists) {
    for (const s of list || []) {
      if (!seen.has(s.href)) {
        seen.add(s.href)
        out.push(s)
      }
    }
  }
  return out
}
