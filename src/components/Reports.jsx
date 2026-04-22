import { Button, Col, Row, Table } from 'react-bootstrap';

export default function Reports({ report }) {
  if (!report) {
    return (
      <div className="text-center text-muted py-5">
        <p>No report generated yet. Go to the Dashboard and click “Generate comprehensive report”.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="no-print mb-3">
        <Button variant="primary" onClick={() => window.print()}>
          Print / Save as PDF
        </Button>
      </div>

      <section className="report-section">
        <h2>Insurance Portfolio Review</h2>
        <p className="small text-muted">Generated: {report.generatedDate}</p>
        <Row className="g-3 mt-2">
          <Col md={3}>
            <div className="stat-card">
              <div className="stat-label">Total clients</div>
              <div className="stat-value">{report.totalClients}</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card">
              <div className="stat-label">Total policies</div>
              <div className="stat-value">{report.totalPolicies}</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card">
              <div className="stat-label">Active policies</div>
              <div className="stat-value">{report.activePolicies}</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card">
              <div className="stat-label">Total coverage</div>
              <div className="stat-value">${Math.round(report.totalCoverage).toLocaleString()}</div>
            </div>
          </Col>
        </Row>
      </section>

      <section className="report-section">
        <h2>Financial summary</h2>
        <Table className="report-table" responsive>
          <thead>
            <tr>
              <th>Metric</th>
              <th className="text-end">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total annual premium revenue</td>
              <td className="text-end">${Math.round(report.totalPremium).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Total coverage provided</td>
              <td className="text-end">${Math.round(report.totalCoverage).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Average premium per client</td>
              <td className="text-end">
                $
                {report.totalClients > 0
                  ? Math.round(report.totalPremium / report.totalClients).toLocaleString()
                  : 0}
              </td>
            </tr>
            <tr>
              <td>Average coverage per client</td>
              <td className="text-end">
                $
                {report.totalClients > 0
                  ? Math.round(report.totalCoverage / report.totalClients).toLocaleString()
                  : 0}
              </td>
            </tr>
          </tbody>
        </Table>
      </section>

      <section className="report-section">
        <h2>Client details</h2>
        {report.clients.map((client) => (
          <div key={client.id} className="mb-4" style={{ pageBreakInside: 'avoid' }}>
            <h3>{client.name}</h3>
            <Table className="report-table" responsive>
              <tbody>
                <tr>
                  <td style={{ width: 200 }}>
                    <strong>Contact</strong>
                  </td>
                  <td>
                    {client.email} · {client.phone}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Occupation</strong>
                  </td>
                  <td>{client.occupation}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Annual income</strong>
                  </td>
                  <td>${parseInt(client.annualIncome || 0).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Risk profile</strong>
                  </td>
                  <td>{client.riskProfile}</td>
                </tr>
              </tbody>
            </Table>

            {client.policies.length > 0 && (
              <>
                <h4 className="h6">Policies</h4>
                <Table className="report-table" responsive>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Provider</th>
                      <th>Policy #</th>
                      <th>Premium</th>
                      <th>Coverage</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {client.policies.map((policy) => (
                      <tr key={policy.id}>
                        <td>{policy.type}</td>
                        <td>{policy.provider}</td>
                        <td>{policy.policyNumber}</td>
                        <td>
                          ${policy.premium}/{policy.frequency}
                        </td>
                        <td>${parseInt(policy.coverageAmount || 0).toLocaleString()}</td>
                        <td>{policy.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
