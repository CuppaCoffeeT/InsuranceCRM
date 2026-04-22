import { Alert, Col, Row, Table } from 'react-bootstrap';

export default function RetirementProjection({ client, investmentPolicies, currentAge, income }) {
  const totalILPValueAt65 = investmentPolicies.reduce(
    (sum, p) => sum + parseFloat(p.illustratedValueAge65 || 0),
    0,
  );
  const currentBalance = parseFloat(client.totalBankBalance || 0);
  const yearsTo65 = Math.max(0, 65 - currentAge);
  const nominalBankRate = 0.005;
  const inflationRate = 0.025;
  const moderateReturn = 0.06;

  const balanceAt65WithBank = currentBalance * Math.pow(1 + nominalBankRate, yearsTo65);
  const balanceAt65WithInvestment = currentBalance * Math.pow(1 + moderateReturn, yearsTo65);
  const opportunityCost = balanceAt65WithInvestment - balanceAt65WithBank;

  const totalRetirementSum = totalILPValueAt65 + balanceAt65WithBank;
  const totalRetirementSumIfInvested = totalILPValueAt65 + balanceAt65WithInvestment;
  const purchasingPowerToday = totalRetirementSum / Math.pow(1 + inflationRate, yearsTo65);

  return (
    <section className="report-section page-break-before">
      <h2>Combined retirement projection (age 65)</h2>

      <Row className="g-3 mb-3">
        <Col md={4}>
          <div className="retirement-card ilp">
            <div className="small opacity-75">Investment-linked policies</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>
              ${Math.round(totalILPValueAt65).toLocaleString()}
            </div>
            <div className="small opacity-75">at age 65 (illustrated)</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="retirement-card bank">
            <div className="small opacity-75">Bank balance projected</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>
              ${Math.round(balanceAt65WithBank).toLocaleString()}
            </div>
            <div className="small opacity-75">at age 65 (0.5% interest)</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="retirement-card total">
            <div className="small opacity-75">Total retirement sum</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>
              ${Math.round(totalRetirementSum).toLocaleString()}
            </div>
            <div className="small opacity-75">Combined at age 65</div>
          </div>
        </Col>
      </Row>

      {client.bankBalanceHistory && client.bankBalanceHistory.length > 0 && (
        <>
          <h3>Bank balance history</h3>
          <Table className="report-table" responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th className="text-end">Balance</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {client.bankBalanceHistory.map((record, idx) => (
                <tr key={idx}>
                  <td>{record.date}</td>
                  <td className="text-end">
                    ${parseInt(record.balance || 0).toLocaleString()}
                  </td>
                  <td>{record.notes}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Table className="report-table" responsive>
        <thead>
          <tr>
            <th>Component</th>
            <th className="text-end">Current</th>
            <th className="text-end">Value at 65</th>
            <th>Assumption</th>
          </tr>
        </thead>
        <tbody>
          {investmentPolicies.map((policy) => (
            <tr key={policy.id}>
              <td>
                {policy.type} — {policy.provider}
              </td>
              <td className="text-end">
                ${parseFloat(policy.currentAccountValue || 0).toLocaleString()}
              </td>
              <td className="text-end" style={{ color: '#059669', fontWeight: 500 }}>
                ${Math.round(parseFloat(policy.illustratedValueAge65 || 0)).toLocaleString()}
              </td>
              <td>From benefit illustration</td>
            </tr>
          ))}
          <tr>
            <td>Bank balance</td>
            <td className="text-end">${currentBalance.toLocaleString()}</td>
            <td className="text-end" style={{ color: '#2563eb', fontWeight: 500 }}>
              ${Math.round(balanceAt65WithBank).toLocaleString()}
            </td>
            <td>0.5% annual interest</td>
          </tr>
          <tr style={{ fontWeight: 600, background: '#f3e8ff' }}>
            <td>Total</td>
            <td className="text-end">
              $
              {(
                currentBalance +
                investmentPolicies.reduce((s, p) => s + parseFloat(p.currentAccountValue || 0), 0)
              ).toLocaleString()}
            </td>
            <td className="text-end" style={{ color: '#7c3aed' }}>
              ${Math.round(totalRetirementSum).toLocaleString()}
            </td>
            <td />
          </tr>
        </tbody>
      </Table>

      {currentBalance > 0 && (
        <Alert variant="warning">
          <h4 className="h6">Bank balance opportunity cost</h4>
          <Table className="report-table mt-2" responsive>
            <thead>
              <tr>
                <th>Scenario</th>
                <th className="text-end">Bank at 65</th>
                <th className="text-end">Total retirement sum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Current plan (keep in bank)</td>
                <td className="text-end">
                  ${Math.round(balanceAt65WithBank).toLocaleString()}
                </td>
                <td className="text-end">
                  ${Math.round(totalRetirementSum).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>If invested (6% returns)</td>
                <td className="text-end" style={{ color: '#059669', fontWeight: 500 }}>
                  ${Math.round(balanceAt65WithInvestment).toLocaleString()}
                </td>
                <td className="text-end" style={{ color: '#059669', fontWeight: 500 }}>
                  ${Math.round(totalRetirementSumIfInvested).toLocaleString()}
                </td>
              </tr>
              <tr style={{ background: '#fee2e2' }}>
                <td>Opportunity cost</td>
                <td className="text-end" style={{ color: '#dc2626', fontWeight: 500 }}>
                  ${Math.round(opportunityCost).toLocaleString()}
                </td>
                <td className="text-end" style={{ color: '#dc2626', fontWeight: 500 }}>
                  ${Math.round(totalRetirementSumIfInvested - totalRetirementSum).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </Table>
        </Alert>
      )}

      <Alert variant="danger">
        <h4 className="h6">Inflation impact</h4>
        <p className="mb-2">
          With {(inflationRate * 100).toFixed(1)}% annual inflation over {yearsTo65} years, your
          retirement sum of ${Math.round(totalRetirementSum).toLocaleString()} will have the
          purchasing power of only ${Math.round(purchasingPowerToday).toLocaleString()} in today's
          dollars.
        </p>
        <div className="fw-semibold">
          Purchasing power loss: $
          {Math.round(totalRetirementSum - purchasingPowerToday).toLocaleString()} (
          {((1 - 1 / Math.pow(1 + inflationRate, yearsTo65)) * 100).toFixed(1)}%)
        </div>
      </Alert>

      <Alert variant="primary">
        <h4 className="h6">Recommendations</h4>
        <ol className="mb-0">
          <li>
            ILP policies projected to grow to $
            {Math.round(totalILPValueAt65).toLocaleString()} by age 65 based on benefit
            illustrations.
          </li>
          <li>
            Keep 6–12 months of expenses as emergency fund in bank (~$
            {Math.round(income * 0.75).toLocaleString()}).
          </li>
          {currentBalance > income * 0.75 && (
            <li>
              Consider investing excess bank balance ($
              {Math.round(currentBalance - income * 0.75).toLocaleString()}) aligned with the{' '}
              {client.riskProfile.toLowerCase()} risk profile.
            </li>
          )}
          <li>Review ILP account values annually to track actual vs illustrated performance.</li>
          <li>
            Total projected retirement sum: $
            {Math.round(totalRetirementSum).toLocaleString()} (ILP + bank).
          </li>
        </ol>
      </Alert>
    </section>
  );
}
