import { Alert, Col, Row, Table } from 'react-bootstrap';
import { BHS_2026, projectCPFTo55, retirementSumsFor } from '../../utils/finance';

export default function CPFProjection({ client, currentAge }) {
  const cpfOA = parseFloat(client.cpfOA || 0);
  const cpfSA = parseFloat(client.cpfSA || 0);
  const cpfMA = parseFloat(client.cpfMA || 0);
  const yearsTo55 = Math.max(0, 55 - currentAge);

  const { oaAt55, saAt55, maAt55, totalOverflow, saBoostFromOverflow, totalCPFAt55 } =
    projectCPFTo55({ cpfOA, cpfSA, cpfMA, yearsTo55 });

  const sums = retirementSumsFor(client.dateOfBirth);
  const projectedRA = Math.min(saAt55 + oaAt55, sums.frs);
  const remainingOA = Math.max(0, oaAt55 - Math.max(0, sums.frs - saAt55));
  const meetsFRS = projectedRA >= sums.frs;
  const meetsBRS = projectedRA >= sums.brs;
  const frsPercentage = Math.round((projectedRA / sums.frs) * 100);

  return (
    <section className="report-section page-break-before">
      <h2>CPF projection to age 55</h2>
      <p className="small text-muted">
        Projection based on current CPF interest rates (OA: 2.5%, SA: 4%, MA: 4%) with Medisave cap
        overflow to SA.
      </p>

      {totalOverflow > 0 && (
        <Alert variant="warning">
          <strong>Medisave overflow detected.</strong> Medisave will hit the BHS 2026 cap of $
          {BHS_2026.toLocaleString()}. Approx ${Math.round(totalOverflow).toLocaleString()} will
          overflow to the Special Account, boosting SA by $
          {Math.round(saBoostFromOverflow).toLocaleString()} at age 55.
        </Alert>
      )}

      <Row className="g-3 mb-3">
        <Col md={4}>
          <div className="cpf-card oa">
            <div className="small opacity-75">Ordinary Account (OA)</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>
              ${Math.round(oaAt55).toLocaleString()}
            </div>
            <div className="small opacity-75">at age 55 (2.5% p.a.)</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="cpf-card sa">
            <div className="small opacity-75">Special Account (SA)</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>
              ${Math.round(saAt55).toLocaleString()}
            </div>
            <div className="small opacity-75">→ Retirement Account at 55 (4% p.a.)</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="cpf-card ma">
            <div className="small opacity-75">Medisave (MA)</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>
              ${Math.round(maAt55).toLocaleString()}
            </div>
            <div className="small opacity-75">for healthcare (4% p.a.)</div>
          </div>
        </Col>
      </Row>

      <Table className="report-table" responsive>
        <thead>
          <tr>
            <th>Account</th>
            <th className="text-end">Current</th>
            <th className="text-end">Rate</th>
            <th className="text-end">Years to 55</th>
            <th className="text-end">Value at 55</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>OA</strong>
            </td>
            <td className="text-end">${cpfOA.toLocaleString()}</td>
            <td className="text-end">2.5%</td>
            <td className="text-end">{yearsTo55}</td>
            <td className="text-end">${Math.round(oaAt55).toLocaleString()}</td>
            <td>Withdrawable for personal use</td>
          </tr>
          <tr>
            <td>
              <strong>SA</strong>
            </td>
            <td className="text-end">${cpfSA.toLocaleString()}</td>
            <td className="text-end">4.0%</td>
            <td className="text-end">{yearsTo55}</td>
            <td className="text-end">${Math.round(saAt55).toLocaleString()}</td>
            <td>Converts to RA for CPF LIFE</td>
          </tr>
          <tr>
            <td>
              <strong>MA</strong>
            </td>
            <td className="text-end">${cpfMA.toLocaleString()}</td>
            <td className="text-end">4.0%</td>
            <td className="text-end">{yearsTo55}</td>
            <td className="text-end">${Math.round(maAt55).toLocaleString()}</td>
            <td>Healthcare expenses</td>
          </tr>
          <tr style={{ fontWeight: 600, background: '#f0fdf4' }}>
            <td>Total</td>
            <td className="text-end">${(cpfOA + cpfSA + cpfMA).toLocaleString()}</td>
            <td />
            <td />
            <td className="text-end">${Math.round(totalCPFAt55).toLocaleString()}</td>
            <td />
          </tr>
        </tbody>
      </Table>

      <div
        className="p-3 mt-3"
        style={{ background: '#f0f9ff', border: '2px solid #0284c7', borderRadius: 12 }}
      >
        <h3 className="h6" style={{ color: '#0369a1' }}>
          Retirement account assessment at age 55
        </h3>

        <div
          className="p-2 mb-3"
          style={{ background: '#fef3c7', borderRadius: 8 }}
        >
          <div className="small">
            <strong>Cohort: </strong>
            {sums.projected
              ? `Turning 55 in ${sums.cohortYear} (projected at 2.5%)`
              : `Turning 55 in ${sums.cohortYear} (official)`}
          </div>
          <Row className="g-2 mt-2">
            <Col>
              <div className="small">BRS</div>
              <div className="fw-semibold">${sums.brs.toLocaleString()}</div>
            </Col>
            <Col>
              <div className="small">FRS</div>
              <div className="fw-semibold">${sums.frs.toLocaleString()}</div>
            </Col>
            <Col>
              <div className="small">ERS</div>
              <div className="fw-semibold">${sums.ers.toLocaleString()}</div>
            </Col>
          </Row>
        </div>

        <div
          className="p-3"
          style={{ background: 'white', border: '1px solid #0284c7', borderRadius: 8 }}
        >
          <div className="small text-muted">Projected Retirement Account (RA):</div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: meetsFRS ? '#059669' : '#dc2626',
            }}
          >
            ${projectedRA.toLocaleString()}
          </div>
          <div className="small text-muted">
            ({frsPercentage}% of FRS) · Withdrawable OA: ${remainingOA.toLocaleString()}
          </div>

          <div className="mt-3 pt-3 border-top">
            {meetsFRS && (
              <Alert variant="success" className="mb-0">
                <strong>You meet Full Retirement Sum (FRS).</strong> Can withdraw all remaining OA
                (${remainingOA.toLocaleString()}) at age 55.
              </Alert>
            )}
            {!meetsFRS && meetsBRS && (
              <Alert variant="warning" className="mb-0">
                <strong>You meet Basic Retirement Sum (BRS).</strong> Shortfall to FRS: $
                {(sums.frs - projectedRA).toLocaleString()}. Consider voluntary top-ups or property
                pledge.
              </Alert>
            )}
            {!meetsBRS && (
              <Alert variant="danger" className="mb-0">
                <strong>Below Basic Retirement Sum (BRS).</strong> Shortfall: $
                {(sums.brs - projectedRA).toLocaleString()}. Urgent: increase CPF contributions or
                top-ups.
              </Alert>
            )}
          </div>

          {projectedRA > 0 && (
            <div className="p-2 mt-3" style={{ background: '#fefce8', borderRadius: 6 }}>
              <div className="small fw-semibold" style={{ color: '#713f12' }}>
                Estimated CPF LIFE monthly payout (from age 65):
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#854d0e' }}>
                ${Math.round((projectedRA / sums.frs) * 1780).toLocaleString()}/month
              </div>
              <div className="small fst-italic" style={{ color: '#713f12' }}>
                Based on Standard Plan · At FRS, payout ≈ $1,780/month
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
