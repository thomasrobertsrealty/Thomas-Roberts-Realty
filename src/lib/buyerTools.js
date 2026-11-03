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
    downWasCapped: num(plan.down_payment) > price,
    loan,
    downPercent,
    years,
    months,
    annualRatePercent: annualRate * 100,
    monthlyRate,
    taxRatePercent: taxRate * 100,
    annualPropertyTax: price * taxRate,
    insuranceAnnual: insuranceYear,
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

export function money2(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0)
}

function trimNumber(value, digits) {
  return String(parseFloat(Number(value).toFixed(digits)))
}

// Plain-English breakdown of every result, built from the same numbers calculateCosts returns,
// so what the buyer reads always matches what is on screen. Each entry has:
//   what (one sentence), formula (the rule), lines (the buyer's own numbers plugged in), note.
export function explainCosts(c) {
  const rate = trimNumber(c.annualRatePercent, 3)
  const taxRate = trimNumber(c.taxRatePercent, 3)
  const monthlyRatePercent = (c.monthlyRate * 100).toFixed(4)
  const piTotal = c.principalAndInterest * c.months
  const out = {}

  out.loan = {
    what: 'The amount you would borrow: the home price minus your down payment.',
    formula: 'Home price - down payment',
    lines: [money(c.price) + ' - ' + money(c.down) + ' = ' + money(c.loan)],
    note: c.downWasCapped
      ? 'The down payment you entered is more than the home price, so it is counted as the full price and no loan is needed.'
      : null,
  }

  const piLines = []
  if (c.loan <= 0) {
    piLines.push('Your loan amount is $0, so there is no principal and interest payment.')
  } else if (c.monthlyRate === 0) {
    piLines.push('Loan amount: ' + money(c.loan))
    piLines.push('Number of payments: ' + c.years + ' years x 12 = ' + c.months)
    piLines.push(
      'With a 0% rate there is no interest, so the payment is the loan divided by the number of payments: ' +
        money(c.loan) + ' / ' + c.months + ' = ' + money2(c.principalAndInterest)
    )
  } else {
    piLines.push('Loan amount: ' + money(c.loan))
    piLines.push('Monthly rate (r): ' + rate + '% per year / 12 = ' + monthlyRatePercent + '% per month')
    piLines.push('Number of payments (n): ' + c.years + ' years x 12 = ' + c.months)
    piLines.push('Payment: ' + money2(c.principalAndInterest) + ' per month')
  }
  out.principalAndInterest = {
    what: 'The part of your payment that pays back the loan and the interest the lender charges.',
    formula: 'Payment = loan x r / (1 - (1 + r)^-n), where r is the monthly interest rate and n is the number of monthly payments',
    lines: piLines,
    note: 'This is the standard fixed-rate loan formula. On a fixed-rate loan this amount stays the same every month. Early payments are mostly interest, and later ones are mostly principal.',
  }

  out.propertyTax = {
    what: 'Your share of the yearly property tax, spread over twelve months. Most lenders collect it with your payment.',
    formula: 'Home price x yearly tax rate / 12',
    lines: [
      money(c.price) + ' x ' + taxRate + '% = ' + money2(c.annualPropertyTax) + ' per year',
      money2(c.annualPropertyTax) + ' / 12 = ' + money2(c.propertyTax) + ' per month',
    ],
    note: 'Actual property taxes vary by county and by home, so check the specific home you are considering.',
  }

  out.insurance = {
    what: 'Homeowners insurance, spread over twelve months. Lenders require it, and most collect it with your payment.',
    formula: 'Yearly insurance cost / 12',
    lines: [money2(c.insuranceAnnual) + ' per year / 12 = ' + money2(c.insurance) + ' per month'],
    note: 'An insurance quote for the specific home gives you the real number.',
  }

  out.mortgageInsurance = {
    what: 'Many loans charge mortgage insurance when the down payment is under 20% of the price. This is a rough planning estimate.',
    formula: 'Loan amount x 0.5% per year / 12',
    lines: [
      c.downPercent.toFixed(1) + '% down is under 20%, so mortgage insurance is included in this estimate.',
      money(c.loan) + ' x 0.5% = ' + money2(c.loan * 0.005) + ' per year',
      money2(c.loan * 0.005) + ' / 12 = ' + money2(c.mortgageInsurance) + ' per month',
    ],
    note: 'The 0.5% yearly rate is an assumed placeholder, not a quote. Real mortgage insurance depends on the loan type, your credit, and your down payment, so ask a lender.',
  }

  out.hoa = {
    what: 'Homeowners association dues, if the home has them.',
    formula: 'The monthly amount you entered',
    lines: ['Dues are entered as a monthly amount, so nothing is calculated: ' + money2(c.hoa) + ' per month.'],
    note: null,
  }

  const totalLines = [
    'Principal and interest: ' + money2(c.principalAndInterest),
    'Property tax: ' + money2(c.propertyTax),
    'Homeowners insurance: ' + money2(c.insurance),
  ]
  if (c.mortgageInsurance > 0) {
    totalLines.push('Mortgage insurance (estimate): ' + money2(c.mortgageInsurance))
  } else if (c.price > 0) {
    totalLines.push('Mortgage insurance: not included, because your down payment is 20% or more of the price.')
  }
  if (c.hoa > 0) totalLines.push('HOA dues: ' + money2(c.hoa))
  totalLines.push('Total: ' + money2(c.monthlyTotal) + ' per month')
  out.monthlyTotal = {
    what: 'Everything in your monthly housing payment added together.',
    formula: 'Principal and interest + property tax + homeowners insurance + mortgage insurance (if any) + HOA dues (if any)',
    lines: totalLines,
    note: 'This does not include utilities, maintenance, or repairs. Each figure on this page is rounded to the nearest dollar, so the rounded numbers can differ from the total by a dollar.',
  }

  out.totalInterest = {
    what: 'All the interest you would pay over the full loan if you made every payment on schedule and never paid extra.',
    formula: '(Monthly principal and interest x number of payments) - loan amount',
    lines:
      c.loan > 0
        ? [
            money2(c.principalAndInterest) + ' x ' + c.months + ' payments = ' + money(piTotal),
            money(piTotal) + ' - ' + money(c.loan) + ' = ' + money(c.totalInterest),
          ]
        : ['Your loan amount is $0, so there is no interest.'],
    note: 'Taxes, insurance, and mortgage insurance are not part of this figure. The calculation uses the exact monthly payment, so multiplying the rounded payment shown here can differ by a couple of dollars.',
  }

  out.closingCosts = {
    what: 'A rough planning estimate of the fees paid at closing, separate from your down payment.',
    formula: 'Home price x 3%',
    lines: [money(c.price) + ' x 3% = ' + money(c.closingCosts)],
    note: 'Real closing costs depend on your loan, lender, and title company. The Loan Estimate your lender gives you lists the actual amounts.',
  }

  out.cashNeeded = {
    what: 'The cash you would need to bring to closing.',
    formula: 'Down payment + estimated closing costs',
    lines: [money(c.down) + ' + ' + money(c.closingCosts) + ' = ' + money(c.cashNeeded)],
    note: 'This does not include the home inspection, moving costs, or savings you want to keep in reserve.',
  }

  return out
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
