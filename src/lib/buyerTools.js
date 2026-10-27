// Shared data and math for the buyer portal (calculator + readiness checklist).
// Everything here is an estimate for planning, not a loan offer or quote.

export const CHECKLIST = [
  {
    group: 'Know your money',
    items: [
      {
        key: 'budget',
        title: 'Write down your monthly budget',
        help: 'List what comes in and what goes out each month, so you know what payment you can live with comfortably, not just what a lender might allow.',
      },
      {
        key: 'savings',
        title: 'Add up your savings for a down payment and closing costs',
        help: 'Count what you have saved, and keep some cash aside for an emergency fund so a repair does not wipe you out after moving in.',
      },
      {
        key: 'debts',
        title: 'List your debts and monthly payments',
        help: 'Car loans, student loans, and credit cards all count when a lender looks at what you can afford.',
      },
    ],
  },
  {
    group: 'Check your credit',
    items: [
      {
        key: 'credit_report',
        title: 'Pull your free credit reports',
        help: 'You can get them at annualcreditreport.com, the official site. Look for accounts or errors you do not recognize.',
      },
      {
        key: 'credit_fix',
        title: 'Fix errors and pay down high card balances',
        help: 'Disputing mistakes and lowering card balances before you apply can help your credit score. Avoid opening new credit while you shop for a home.',
      },
    ],
  },
  {
    group: 'Talk to a lender',
    items: [
      {
        key: 'docs',
        title: 'Gather your paperwork',
        help: 'Lenders usually ask for recent pay stubs, W-2s or tax returns, and bank statements. Having them ready speeds things up.',
      },
      {
        key: 'compare_lenders',
        title: 'Talk to at least two lenders',
        help: 'Rates and fees can differ from one lender to the next, so ask each for a written estimate and compare.',
      },
      {
        key: 'preapproval',
        title: 'Get a pre-approval letter',
        help: 'This shows sellers you are serious and gives you a price range to shop in.',
      },
    ],
  },
  {
    group: 'Search for a home',
    items: [
      {
        key: 'must_haves',
        title: 'List your must-haves and nice-to-haves',
        help: 'Bedrooms, location, commute, yard, and budget limits. Knowing the difference keeps your search focused.',
      },
      {
        key: 'areas',
        title: 'Pick the areas you want to look in',
        help: 'Drive through the neighborhoods at different times of day, and talk to Thomas about what each area is like.',
      },
      {
        key: 'tours',
        title: 'Tour homes with Thomas',
        help: 'Touring with an agent helps you see past the staging and ask the right questions.',
      },
    ],
  },
  {
    group: 'Make an offer',
    items: [
      {
        key: 'offer_price',
        title: 'Decide on a price and terms with Thomas',
        help: 'Recent comparable sales help you choose an offer that is competitive without overpaying.',
      },
      {
        key: 'earnest_money',
        title: 'Have earnest money ready',
        help: 'This deposit goes with your offer. Ask Thomas how much is typical so you are not caught off guard.',
      },
    ],
  },
  {
    group: 'Inspection to closing',
    items: [
      {
        key: 'inspection',
        title: 'Schedule the home inspection',
        help: 'An inspection checks the condition of the home. You can negotiate repairs based on what it finds.',
      },
      {
        key: 'insurance',
        title: 'Get a homeowners insurance quote',
        help: 'Your lender will require coverage before closing, so get quotes early.',
      },
      {
        key: 'walkthrough',
        title: 'Do the final walkthrough',
        help: 'Check that agreed repairs are done and the home is in the condition you expect before you sign.',
      },
      {
        key: 'closing_funds',
        title: 'Arrange your closing funds',
        help: 'Your title company will tell you the exact amount and how to send it. Confirm the instructions by phone before wiring any money.',
      },
    ],
  },
]

export const ALL_ITEMS = CHECKLIST.flatMap((g) => g.items)

export function progressSummary(doneKeys) {
  const total = ALL_ITEMS.length
  const done = ALL_ITEMS.filter((i) => doneKeys.has(i.key)).length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  let stage = 'Just getting started'
  if (percent >= 90) stage = 'Ready for closing'
  else if (percent >= 65) stage = 'Searching and making offers'
  else if (percent >= 35) stage = 'Getting pre-approved'
  else if (percent > 0) stage = 'Getting your finances ready'
  return { total, done, percent, stage }
}

function num(value) {
  const n = parseFloat(value)
  return Number.isFinite(n) && n > 0 ? n : 0
}

// plan fields may be strings from inputs; all dollar fields are plain numbers.
export function calculateCosts(plan) {
  const price = num(plan.home_price)
  const down = Math.min(num(plan.down_payment), price)
  const annualRate = num(plan.interest_rate) / 100
  const years = Math.max(1, Math.round(num(plan.term_years)) || 30)
  const taxRate = num(plan.property_tax_rate) / 100
  const insuranceYear = num(plan.insurance_annual)
  const hoa = num(plan.hoa_monthly)

  const loan = Math.max(0, price - down)
  const months = years * 12
  const monthlyRate = annualRate / 12

  let principalAndInterest = 0
  if (loan > 0) {
    if (monthlyRate === 0) {
      principalAndInterest = loan / months
    } else {
      principalAndInterest = (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
    }
  }

  const downPercent = price > 0 ? (down / price) * 100 : 0
  // Rough planning estimate only: many loans charge mortgage insurance under 20% down.
  const mortgageInsurance = price > 0 && downPercent < 20 ? (loan * 0.005) / 12 : 0
  const propertyTax = (price * taxRate) / 12
  const insurance = insuranceYear / 12

  const monthlyTotal = principalAndInterest + propertyTax + insurance + hoa + mortgageInsurance
  const totalInterest = principalAndInterest * months - loan
  const closingCosts = price * 0.03

  return {
    price,
    down,
    loan,
    downPercent,
    principalAndInterest,
    propertyTax,
    insurance,
    hoa,
    mortgageInsurance,
    monthlyTotal,
    totalInterest: Math.max(0, totalInterest),
    closingCosts,
    cashNeeded: down + closingCosts,
  }
}

export function money(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)
}

// Starting values shown in the calculator. These are examples to edit, not quotes or market data.
export const DEFAULT_PLAN = {
  name: 'My plan',
  home_price: '350000',
  down_payment: '17500',
  interest_rate: '6.5',
  term_years: '30',
  property_tax_rate: '0.65',
  insurance_annual: '1200',
  hoa_monthly: '0',
}
