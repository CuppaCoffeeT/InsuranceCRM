import { Alert, Button, Col, Modal, Row, Table } from 'react-bootstrap';
import {
  AVERAGE_CRITICAL_ILLNESS_COST,
  AVERAGE_EARLY_CI_COST,
  BHS_2026,
  MEDICAL_INFLATION_RATE,
  ageFromDOB,
  annualisePremium,
  formatCoverage,
  projectCPFTo55,
  retirementSumsFor,
  summariseClient,
} from '../utils/finance';
import HealthSnapshot from './report/HealthSnapshot';
import CPFProjection from './report/CPFProjection';
import RetirementProjection from './report/RetirementProjection';

export default function ClientReportModal({ client, onClose }) {
  if (!client) return null;

  const currentAge = ageFromDOB(client.dateOfBirth);
  const yearsToRetirement = Math.max(0, 65 - currentAge);
  const summary = summariseClient(client);

  const cashValuePolicies = client.policies.filter((p) => p.hasCashValue);
  const hospitalPolicies = client.policies.filter((p) => p.isHospitalization);
  const investmentPolicies = client.policies.filter((p) => p.isInvestmentLinked);

  const totalILPValueAt65 = investmentPolicies.reduce(
    (s, p) => s + parseFloat(p.illustratedValueAge65 || 0),
    0,
  );
  const bankBalanceAt65 =
    parseFloat(client.totalBankBalance || 0) * Math.pow(1.005, yearsToRetirement);
  const totalRetirementValue = totalILPValueAt65 + bankBalanceAt65;

  const futureCICost =
    AVERAGE_CRITICAL_ILLNESS_COST * Math.pow(1 + MEDICAL_INFLATION_RATE, yearsToRetirement);
  const futureECICost =
    AVERAGE_EARLY_CI_COST * Math.pow(1 + MEDICAL_INFLATION_RATE, yearsToRetirement);

  const coverageGap = Math.max(0, summary.income * 10 - summary.totalCoverage);
  const ciCoverageGap = Math.max(0, summary.income * 5 - summary.totalCICoverage);
  const eciCoverageGap = Math.max(0, summary.income * 1.5 - summary.totalECICoverage);

  const postCoverageDeathOOP = Math.max(0, summary.income * 10 - summary.totalCoverage);
  const postCoverageCIOOP = Math.max(0, futureCICost - summary.totalCICoverage);
  const postCoverageECIOOP = Math.max(0, futureECICost - summary.totalECICoverage);

  // Health snapshot inputs
  let protectionPremiums = 0;
  let investmentPremiums = 0;
  client.policies.forEach((p) => {
    const prem = annualisePremium(p);
    const t = (p.type || '').toLowerCase();
    if (t.includes('investment') || t.includes('ilp') || t.includes('endowment'))
      investmentPremiums += prem;
    else protectionPremiums += prem;
  });
  const insurancePremiumsPct =
    summary.income > 0 ? (protectionPremiums / summary.income) * 100 : 0;
  const investmentPremiumsPct =
    summary.income > 0 ? (investmentPremiums / summary.income) * 100 : 0;

  const yearsTo55 = Math.max(0, 55 - currentAge);
  const cpfProjection = projectCPFTo55({
    cpfOA: parseFloat(client.cpfOA || 0),
    cpfSA: parseFloat(client.cpfSA || 0),
    cpfMA: parseFloat(client.cpfMA || 0),
    yearsTo55,
  });
  const sums = retirementSumsFor(client.dateOfBirth);
  const projectedRA = Math.min(cpfProjection.saAt55 + cpfProjection.oaAt55, sums.frs);
  const cpfAchievementPct = sums.frs > 0 ? (projectedRA / sums.frs) * 100 : 0;

  const policyTypes = {};
  client.policies.forEach((p) => {
    if (!policyTypes[p.type]) policyTypes[p.type] = [];
    policyTypes[p.type].push(p);
  });

  return (
    <Modal show={!!client} onHide={onClose} size="xl" scrollable>
      <Modal.Header closeButton className="no-print">
        <Modal.Title>Personalized insurance & investment report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="report-hero">
          <h1>{client.name}&apos;s Financial Protection Plan</h1>
          <p className="mb-3 opacity-75">
            Comprehensive insurance and investment review as of{' '}
            {new Date().toLocaleDateString('en-SG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <Row className="g-3">
            <Col md>
              <div className="hero-stat">
                <div className="label">Total policies</div>
                <div className="value">{client.policies.length}</div>
              </div>
            </Col>
            <Col md>
              <div className="hero-stat">
                <div className="label">Death coverage</div>
                <div className="value">{formatCoverage(summary.totalCoverage)}</div>
              </div>
            </Col>
            <Col md>
              <div className="hero-stat">
                <div className="label">Annual investment in self</div>
                <div className="value">{formatCoverage(summary.totalAnnualInvestment)}</div>
              </div>
            </Col>
            <Col md>
              <div className="hero-stat">
                <div className="label">Projected at age 65</div>
                <div className="value">{formatCoverage(totalRetirementValue)}</div>
                <div className="small opacity-75">ILP + bank</div>
              </div>
            </Col>
            <Col md>
              <div className="hero-stat">
                <div className="label">Years to retirement</div>
                <div className="value">{yearsToRetirement}</div>
              </div>
            </Col>
          </Row>
        </div>

        <HealthSnapshot
          insurancePremiumsPct={insurancePremiumsPct}
          investmentPremiumsPct={investmentPremiumsPct}
          coverageMultiple={summary.coverageRatio}
          cpfAchievementPct={cpfAchievementPct}
          isAdequatelyCovered={
            summary.coverageRatio >= 5 &&
            summary.ciCoverageRatio >= 5 &&
            summary.eciCoverageRatio >= 1.5
          }
        />

        <section className="report-section">
          <h2>Client profile</h2>
          <div className="bg-light rounded p-3">
            <h3 className="h5 mb-3">{client.name}</h3>
            <Row className="g-2 small">
              <Col md={6}>
                <strong>Email:</strong> {client.email}
              </Col>
              <Col md={6}>
                <strong>Phone:</strong> {client.phone}
              </Col>
              <Col md={6}>
                <strong>Date of birth:</strong> {client.dateOfBirth || 'Not specified'}
              </Col>
              <Col md={6}>
                <strong>Current age:</strong> {currentAge}
              </Col>
              <Col md={6}>
                <strong>Occupation:</strong> {client.occupation}
              </Col>
              <Col md={6}>
                <strong>Annual income:</strong> ${summary.income.toLocaleString()}
              </Col>
              <Col md={6}>
                <strong>Risk profile:</strong> {client.riskProfile}
              </Col>
              <Col md={6}>
                <strong>Years to retirement:</strong> {yearsToRetirement}
              </Col>
            </Row>
            {client.notes && (
              <div className="mt-3 pt-3 border-top">
                <strong>Notes:</strong> {client.notes}
              </div>
            )}
          </div>
        </section>

        <section className="report-section page-break-before">
          <h2>Coverage analysis with medical inflation</h2>
          <Table className="report-table" responsive>
            <thead>
              <tr>
                <th>Coverage type</th>
                <th className="text-end">Current</th>
                <th className="text-end">Ratio</th>
                <th className="text-end">Recommended</th>
                <th className="text-end">Cost at age 65</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Death benefit</strong>
                </td>
                <td className="text-end">
                  ${Math.round(summary.totalCoverage).toLocaleString()}
                </td>
                <td className="text-end">{summary.coverageRatio.toFixed(1)}x</td>
                <td className="text-end">10–15x income</td>
                <td className="text-end">
                  $
                  {Math.round(
                    summary.income * 10 * Math.pow(1.025, yearsToRetirement),
                  ).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Critical illness</strong>
                </td>
                <td className="text-end">
                  ${Math.round(summary.totalCICoverage).toLocaleString()}
                </td>
                <td className="text-end">{summary.ciCoverageRatio.toFixed(1)}x</td>
                <td className="text-end">5x income</td>
                <td className="text-end">
                  $
                  {Math.round(
                    AVERAGE_CRITICAL_ILLNESS_COST * Math.pow(1.06, yearsToRetirement) +
                      (summary.income * 5 - AVERAGE_CRITICAL_ILLNESS_COST),
                  ).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Early CI</strong>
                </td>
                <td className="text-end">
                  ${Math.round(summary.totalECICoverage).toLocaleString()}
                </td>
                <td className="text-end">{summary.eciCoverageRatio.toFixed(1)}x</td>
                <td className="text-end">1.5x income</td>
                <td className="text-end">
                  $
                  {Math.round(
                    AVERAGE_EARLY_CI_COST * Math.pow(1.06, yearsToRetirement) +
                      (summary.income * 1.5 - AVERAGE_EARLY_CI_COST),
                  ).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Premium / income</strong>
                </td>
                <td className="text-end">
                  ${Math.round(summary.totalAnnualPremium).toLocaleString()}
                </td>
                <td className="text-end">{summary.premiumRatio.toFixed(1)}%</td>
                <td className="text-end">10–15%</td>
                <td className="text-end">-</td>
              </tr>
            </tbody>
          </Table>
        </section>

        {cashValuePolicies.length > 0 && (
          <section className="report-section">
            <h2>Cash value accumulation</h2>
            <Table className="report-table" responsive>
              <thead>
                <tr>
                  <th>Policy</th>
                  <th>Provider</th>
                  <th className="text-end">Current cash value</th>
                  <th>Future projections</th>
                </tr>
              </thead>
              <tbody>
                {cashValuePolicies.map((policy) => (
                  <tr key={policy.id}>
                    <td>{policy.type}</td>
                    <td>{policy.provider}</td>
                    <td className="text-end">
                      ${parseInt(policy.currentCashValue || 0).toLocaleString()}
                    </td>
                    <td>
                      {policy.projectedCashValue && policy.projectedCashValue.length > 0
                        ? policy.projectedCashValue.map((p, i) => (
                            <div key={i}>
                              Age {p.age}: <strong>${parseInt(p.value).toLocaleString()}</strong>
                            </div>
                          ))
                        : 'No projections'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>
        )}

        {hospitalPolicies.length > 0 && (
          <section className="report-section">
            <h2>Hospitalization coverage</h2>
            {hospitalPolicies.map((policy) => {
              const cpf = parseFloat(policy.integratedShieldCPF || 0);
              const cash = parseFloat(policy.integratedShieldCash || 0);
              const rider = parseFloat(policy.riderCash || 0);
              return (
                <div key={policy.id} className="bg-warning-subtle rounded p-3 mb-3">
                  <h4 className="h6">
                    {policy.provider} — {policy.hospitalType} Hospital Plan
                  </h4>
                  <div className="small mb-2">
                    <strong>Policy number:</strong> {policy.policyNumber}
                  </div>
                  <Table className="report-table" responsive>
                    <thead>
                      <tr>
                        <th>Component</th>
                        <th className="text-end">Annual premium</th>
                        <th>Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Integrated Shield Plan</td>
                        <td className="text-end">
                          ${cpf.toLocaleString()} CPF + ${cash.toLocaleString()} cash = $
                          {(cpf + cash).toLocaleString()}
                        </td>
                        <td>CPF Medisave + cash</td>
                      </tr>
                      <tr>
                        <td>Rider</td>
                        <td className="text-end">${rider.toLocaleString()}</td>
                        <td>Full cash</td>
                      </tr>
                      <tr style={{ fontWeight: 600, background: '#fef3c7' }}>
                        <td>Total</td>
                        <td className="text-end">
                          ${(cpf + cash + rider).toLocaleString()}
                        </td>
                        <td />
                      </tr>
                    </tbody>
                  </Table>
                </div>
              );
            })}
          </section>
        )}

        {investmentPolicies.length > 0 && (
          <section className="report-section">
            <h2>Investment-linked policy analysis</h2>
            {investmentPolicies.map((policy) => {
              const age55 = parseFloat(policy.illustratedValueAge55 || 0);
              const age65 = parseFloat(policy.illustratedValueAge65 || 0);
              return (
                <div key={policy.id} className="bg-success-subtle rounded p-3 mb-3">
                  <h4 className="h6">
                    {policy.type} — {policy.provider}
                  </h4>
                  <Row className="g-2 small">
                    <Col md={6}>
                      <div>
                        <strong>Policy number:</strong> {policy.policyNumber}
                      </div>
                      <div>
                        <strong>Current account value:</strong> $
                        {parseInt(policy.currentAccountValue || 0).toLocaleString()}
                      </div>
                      <div>
                        <strong>Annual premium:</strong> $
                        {parseFloat(policy.premium).toLocaleString()}
                      </div>
                      <div>
                        <strong>Allocation:</strong>{' '}
                        {policy.investmentAllocation || 'Not specified'}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div>
                        <strong>Death benefit:</strong> $
                        {parseInt(policy.coverageAmount || 0).toLocaleString()}
                      </div>
                      <div>
                        <strong>CI coverage:</strong> $
                        {parseInt(policy.criticalIllnessCoverage || 0).toLocaleString()}
                      </div>
                      <div>
                        <strong>Early CI:</strong> $
                        {parseInt(policy.earlyCriticalIllnessCoverage || 0).toLocaleString()}
                      </div>
                    </Col>
                  </Row>
                  {(age55 > 0 || age65 > 0) && (
                    <Row className="g-2 mt-3 pt-3 border-top">
                      {age55 > 0 && (
                        <Col md={6}>
                          <div className="bg-white rounded p-2">
                            <div className="small text-muted">Pre-retirement (age 55)</div>
                            <div style={{ fontSize: 20, fontWeight: 500, color: '#059669' }}>
                              ${Math.round(age55).toLocaleString()}
                            </div>
                          </div>
                        </Col>
                      )}
                      {age65 > 0 && (
                        <Col md={6}>
                          <div className="bg-white rounded p-2">
                            <div className="small text-muted">Retirement (age 65)</div>
                            <div style={{ fontSize: 20, fontWeight: 500, color: '#059669' }}>
                              ${Math.round(age65).toLocaleString()}
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {(parseFloat(client.cpfOA || 0) > 0 ||
          parseFloat(client.cpfSA || 0) > 0 ||
          parseFloat(client.cpfMA || 0) > 0) && (
          <CPFProjection client={client} currentAge={currentAge} />
        )}

        {((client.totalBankBalance && parseFloat(client.totalBankBalance) > 0) ||
          investmentPolicies.length > 0) && (
          <RetirementProjection
            client={client}
            investmentPolicies={investmentPolicies}
            currentAge={currentAge}
            income={summary.income}
          />
        )}

        <section className="report-section">
          <h2>Policy portfolio</h2>
          {Object.keys(policyTypes).length === 0 ? (
            <p className="text-muted small">No policies on record.</p>
          ) : (
            Object.entries(policyTypes).map(([type, policies]) => (
              <div key={type} className="mb-3">
                <h3>
                  {type} ({policies.length})
                </h3>
                <Table className="report-table" responsive>
                  <thead>
                    <tr>
                      <th>Provider</th>
                      <th>Policy #</th>
                      <th>Death benefit</th>
                      <th>CI coverage</th>
                      <th>Premium</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policies.map((policy) => (
                      <tr key={policy.id}>
                        <td>{policy.provider}</td>
                        <td>{policy.policyNumber}</td>
                        <td>${parseInt(policy.coverageAmount || 0).toLocaleString()}</td>
                        <td>
                          ${parseInt(policy.criticalIllnessCoverage || 0).toLocaleString()}
                        </td>
                        <td>
                          ${policy.premium}/{policy.frequency}
                        </td>
                        <td>{policy.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ))
          )}
        </section>

        <section className="report-section">
          <h2>Coverage gap analysis</h2>
          <Alert variant={coverageGap > 0 ? 'warning' : 'success'}>
            <h4 className="h6">Death benefit</h4>
            <p className="mb-0 small">
              {coverageGap > 0
                ? `Coverage gap of $${Math.round(coverageGap).toLocaleString()}. Beneficiaries could face $${Math.round(postCoverageDeathOOP).toLocaleString()} in out-of-pocket expenses.`
                : `Coverage of ${summary.coverageRatio.toFixed(1)}x income meets industry recommendations.`}
            </p>
          </Alert>
          <Alert variant={ciCoverageGap > 0 ? 'warning' : 'success'}>
            <h4 className="h6">Critical illness</h4>
            <p className="mb-0 small">
              {ciCoverageGap > 0
                ? `Gap of $${Math.round(ciCoverageGap).toLocaleString()}. Future CI cost at 65: $${Math.round(futureCICost).toLocaleString()}. Out-of-pocket exposure: $${Math.round(postCoverageCIOOP).toLocaleString()}.`
                : `CI coverage provides strong protection.`}
            </p>
          </Alert>
          <Alert variant={eciCoverageGap > 0 ? 'warning' : 'success'}>
            <h4 className="h6">Early CI</h4>
            <p className="mb-0 small">
              {eciCoverageGap > 0
                ? `Gap of $${Math.round(eciCoverageGap).toLocaleString()}. Future early CI cost: $${Math.round(futureECICost).toLocaleString()}. Exposure: $${Math.round(postCoverageECIOOP).toLocaleString()}.`
                : `Adequate protection for early-stage intervention.`}
            </p>
          </Alert>
          <Alert variant="primary">
            <h4 className="h6">Premium affordability</h4>
            <p className="mb-0 small">
              Annual premium ${Math.round(summary.totalAnnualPremium).toLocaleString()} is{' '}
              {summary.premiumRatio.toFixed(1)}% of income.
              {summary.premiumRatio > 15
                ? ' Exceeds the 10–15% threshold; review for optimization.'
                : ' Within a sustainable range.'}
            </p>
          </Alert>
        </section>

        <section className="report-section">
          <h2>Client interaction history</h2>
          {client.interactions.length === 0 ? (
            <p className="text-muted small">No interactions recorded yet.</p>
          ) : (
            <Table className="report-table" responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Notes</th>
                  <th>Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {client.interactions.map((i) => (
                  <tr key={i.id}>
                    <td>{i.date}</td>
                    <td>{i.type}</td>
                    <td>{i.notes}</td>
                    <td>{i.followUp || 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </section>

        <section className="report-section">
          <p className="small text-muted border-top pt-3">
            <strong>Disclaimer:</strong> This report is for informational purposes only and does
            not constitute financial or medical advice. Medical cost projections assume{' '}
            {(MEDICAL_INFLATION_RATE * 100).toFixed(0)}% annual inflation. All recommendations
            should be reviewed with a licensed financial advisor.
          </p>
          <p className="small text-muted">
            Report generated: {new Date().toLocaleString()} · Current age {currentAge},{' '}
            {yearsToRetirement} years to retirement · BHS 2026: ${BHS_2026.toLocaleString()}
          </p>
        </section>
      </Modal.Body>
      <Modal.Footer className="no-print">
        <Button variant="primary" onClick={() => window.print()}>
          Print / Save as PDF
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
