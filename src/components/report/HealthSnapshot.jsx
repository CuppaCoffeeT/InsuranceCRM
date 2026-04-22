import { Col, Row } from 'react-bootstrap';

function band(value, benchmarks) {
  if (value >= benchmarks.good) return { tone: '#059669', bg: '#d1fae5', label: 'Good' };
  if (value >= benchmarks.review) return { tone: '#f59e0b', bg: '#fef3c7', label: 'Review' };
  return { tone: '#dc2626', bg: '#fee2e2', label: 'Action needed' };
}

export default function HealthSnapshot({
  insurancePremiumsPct,
  investmentPremiumsPct,
  coverageMultiple,
  cpfAchievementPct,
  isAdequatelyCovered,
}) {
  const insuranceStatus =
    isAdequatelyCovered && insurancePremiumsPct <= 10
      ? { tone: '#059669', bg: '#d1fae5', label: 'Good' }
      : !isAdequatelyCovered
        ? { tone: '#dc2626', bg: '#fee2e2', label: 'Underinsured' }
        : { tone: '#f59e0b', bg: '#fef3c7', label: 'Review cost' };

  const investmentStatus = band(investmentPremiumsPct, { good: 20, review: 14 });
  const protectionStatus = band(coverageMultiple, { good: 5, review: 3.5 });
  const cpfStatus = band(cpfAchievementPct, { good: 100, review: 70 });

  const cards = [
    {
      title: 'Insurance premiums',
      value: `${insurancePremiumsPct.toFixed(1)}%`,
      guide: 'Guideline: <10% of income',
      status: insuranceStatus,
    },
    {
      title: 'Invested premiums',
      value: `${investmentPremiumsPct.toFixed(1)}%`,
      guide: 'Guideline: 20–30% of income',
      status: investmentStatus,
    },
    {
      title: 'Protection coverage',
      value: `${coverageMultiple.toFixed(1)}x`,
      guide: 'Guideline: 5–10x annual income',
      status: protectionStatus,
    },
    {
      title: 'CPF FRS track',
      value: `${cpfAchievementPct.toFixed(0)}%`,
      guide: 'Target: 100%+ of FRS',
      status: cpfStatus,
    },
  ];

  return (
    <div
      className="mb-4 p-3"
      style={{ background: '#fff', border: '2px solid #e5e7eb', borderRadius: 12 }}
    >
      <h2 className="h5 mb-2">Financial health snapshot</h2>
      <p className="small text-muted mb-3">Quick health check against industry benchmarks</p>
      <Row className="g-3">
        {cards.map((card) => (
          <Col key={card.title} md={6} lg={3}>
            <div
              className="health-card"
              style={{
                background: card.status.bg,
                borderColor: card.status.tone,
              }}
            >
              <div className="small fw-semibold text-secondary">{card.title}</div>
              <div
                className="mt-2"
                style={{ fontSize: 28, fontWeight: 700, color: card.status.tone }}
              >
                {card.value}
              </div>
              <div className="small text-muted">{card.guide}</div>
              <div
                className="small fw-semibold mt-1"
                style={{ color: card.status.tone }}
              >
                {card.status.label}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
