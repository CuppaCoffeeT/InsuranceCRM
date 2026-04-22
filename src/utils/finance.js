export const MEDICAL_INFLATION_RATE = 0.06;
export const AVERAGE_CRITICAL_ILLNESS_COST = 150000;
export const AVERAGE_EARLY_CI_COST = 30000;
export const BHS_2026 = 79000;

// Official CPF Retirement Sums (Source: MOM Budget 2022, ~3.5% annual growth)
export const RETIREMENT_SUMS = {
  2023: { brs: 99400, frs: 198800, ers: 298200 },
  2024: { brs: 102900, frs: 205800, ers: 308700 },
  2025: { brs: 106500, frs: 213000, ers: 426000 },
  2026: { brs: 110200, frs: 220400, ers: 440800 },
  2027: { brs: 114100, frs: 228200, ers: 456400 },
};

export function ageFromDOB(dob) {
  if (!dob) return 40;
  return new Date().getFullYear() - new Date(dob).getFullYear();
}

export function annualisePremium(policy) {
  const premium = parseFloat(policy.premium || 0);
  switch (policy.frequency) {
    case 'Monthly':
      return premium * 12;
    case 'Quarterly':
      return premium * 4;
    case 'Semi-Annual':
      return premium * 2;
    default:
      return premium;
  }
}

export function formatCoverage(amount) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${Math.round(amount).toLocaleString()}`;
}

export function projectCPFTo55({ cpfOA, cpfSA, cpfMA, yearsTo55 }) {
  const oaRate = 0.025;
  const saRate = 0.04;
  const maRate = 0.04;

  let currentMA = cpfMA;
  let currentSA = cpfSA;
  let totalOverflow = 0;

  for (let year = 0; year < yearsTo55; year++) {
    currentMA *= 1 + maRate;
    if (currentMA > BHS_2026) {
      const overflow = currentMA - BHS_2026;
      totalOverflow += overflow;
      currentMA = BHS_2026;
      currentSA += overflow;
    }
    currentSA *= 1 + saRate;
  }

  const oaAt55 = cpfOA * Math.pow(1 + oaRate, yearsTo55);
  const saAt55 = currentSA;
  const maAt55 = currentMA;
  const saWithoutOverflow = cpfSA * Math.pow(1 + saRate, yearsTo55);

  return {
    oaAt55,
    saAt55,
    maAt55,
    totalOverflow,
    saBoostFromOverflow: saAt55 - saWithoutOverflow,
    totalCPFAt55: oaAt55 + saAt55 + maAt55,
  };
}

export function retirementSumsFor(dob) {
  const birthYear = dob ? parseInt(dob.split('-')[0], 10) : null;
  const age55Year = birthYear ? birthYear + 55 : null;

  if (age55Year && RETIREMENT_SUMS[age55Year]) {
    return { ...RETIREMENT_SUMS[age55Year], cohortYear: age55Year, projected: false };
  }
  if (age55Year && age55Year > 2027) {
    const yearsAfter = age55Year - 2027;
    const base = RETIREMENT_SUMS[2027];
    return {
      brs: Math.round(base.brs * Math.pow(1.025, yearsAfter)),
      frs: Math.round(base.frs * Math.pow(1.025, yearsAfter)),
      ers: Math.round(base.ers * Math.pow(1.025, yearsAfter)),
      cohortYear: age55Year,
      projected: true,
    };
  }
  return { ...RETIREMENT_SUMS[2026], cohortYear: 2026, projected: false };
}

export function summariseClient(client) {
  const income = parseFloat(client.annualIncome || 0);
  const totalCoverage = client.policies.reduce((s, p) => s + parseFloat(p.coverageAmount || 0), 0);
  const totalCICoverage = client.policies.reduce(
    (s, p) => s + parseFloat(p.criticalIllnessCoverage || 0),
    0,
  );
  const totalECICoverage = client.policies.reduce(
    (s, p) => s + parseFloat(p.earlyCriticalIllnessCoverage || 0),
    0,
  );

  const totalAnnualPremium = client.policies.reduce((sum, p) => {
    let prem = annualisePremium(p);
    if (p.isInvestmentLinked) {
      const pct = parseFloat(p.ilpPremiumInclusionPercent || 0) / 100;
      prem *= pct;
    }
    return sum + prem;
  }, 0);

  const totalAnnualInvestment = client.policies.reduce((s, p) => s + annualisePremium(p), 0);

  return {
    income,
    totalCoverage,
    totalCICoverage,
    totalECICoverage,
    totalAnnualPremium,
    totalAnnualInvestment,
    coverageRatio: income > 0 ? totalCoverage / income : 0,
    ciCoverageRatio: income > 0 ? totalCICoverage / income : 0,
    eciCoverageRatio: income > 0 ? totalECICoverage / income : 0,
    premiumRatio: income > 0 ? (totalAnnualPremium / income) * 100 : 0,
  };
}
