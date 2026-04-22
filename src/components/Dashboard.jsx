import { Button, Row, Col } from 'react-bootstrap';

export default function Dashboard({ stats, onGenerateReport }) {
  const cards = [
    { label: 'Total clients', value: stats.totalClients },
    { label: 'Active policies', value: stats.activePolicies },
    { label: 'Total annual premium', value: `$${Number(stats.totalPremium).toLocaleString()}` },
    { label: 'Upcoming follow-ups', value: stats.upcomingFollowUps },
  ];

  return (
    <div>
      <Row className="g-3 mb-4">
        {cards.map((card) => (
          <Col key={card.label} xs={12} sm={6} md={3}>
            <div className="stat-card">
              <div className="stat-label">{card.label}</div>
              <div className="stat-value">{card.value}</div>
            </div>
          </Col>
        ))}
      </Row>

      <div>
        <h2 className="h5 mb-3">Quick actions</h2>
        <Button variant="success" onClick={onGenerateReport}>
          Generate comprehensive report
        </Button>
      </div>
    </div>
  );
}
