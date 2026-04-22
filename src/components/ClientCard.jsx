import { useMemo, useState } from 'react';
import { Badge, Button, ButtonGroup } from 'react-bootstrap';

function followUpStatus(dateStr) {
  if (!dateStr) return null;
  const days = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0)
    return { tone: 'overdue', label: 'Overdue follow-up', detail: `${Math.abs(days)} days overdue` };
  if (days <= 7)
    return { tone: 'urgent', label: 'Upcoming follow-up', detail: `${days} days` };
  return { tone: 'upcoming', label: 'Next follow-up', detail: `${days} days` };
}

export default function ClientCard({
  client,
  onEdit,
  onDelete,
  onAddPolicy,
  onEditPolicy,
  onDeletePolicy,
  onAddInteraction,
  onEditInteraction,
  onDeleteInteraction,
  onAddBank,
  onEditBank,
  onDeleteBank,
  onGenerateReport,
}) {
  const [expanded, setExpanded] = useState(false);

  const nextFollowUp = useMemo(() => {
    const upcoming = client.interactions
      .filter((i) => i.followUp && new Date(i.followUp) >= new Date())
      .sort((a, b) => new Date(a.followUp) - new Date(b.followUp));
    return upcoming.length > 0 ? upcoming[0].followUp : client.nextReviewDate;
  }, [client]);

  const status = followUpStatus(nextFollowUp);

  return (
    <div className="client-card">
      <div className="d-flex flex-wrap gap-3 justify-content-between align-items-start">
        <div style={{ flex: 1, minWidth: 250 }}>
          <h3 className="h5 mb-1">{client.name}</h3>
          <p className="small text-muted mb-1">
            {client.email} | {client.phone}
          </p>
          <p className="small text-muted mb-1">
            {client.occupation} | ${parseInt(client.annualIncome || 0).toLocaleString()}/year
          </p>
          <p className="small text-muted mb-0">Risk profile: {client.riskProfile}</p>

          {status && (
            <div className={`followup-alert ${status.tone}`}>
              <div className="fw-semibold">{status.label}</div>
              <div>
                {nextFollowUp} ({status.detail})
              </div>
            </div>
          )}
        </div>

        <ButtonGroup vertical className="d-md-none" />
        <div className="d-flex flex-wrap gap-2">
          <Button variant="success" size="sm" onClick={onGenerateReport}>
            Generate report
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={onAddPolicy}>
            Add policy
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={onAddBank}>
            Update balance
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={onAddInteraction}>
            Log interaction
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="outline-danger" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>

      <Button
        variant="link"
        size="sm"
        className="p-0 mt-2"
        onClick={() => setExpanded((e) => !e)}
      >
        {expanded ? 'Show less' : 'Show more'}
      </Button>

      {expanded && (
        <div className="mt-3">
          <h4 className="h6">Policies ({client.policies.length})</h4>
          {client.policies.length === 0 ? (
            <p className="small text-muted">No policies yet</p>
          ) : (
            client.policies.map((policy) => (
              <div key={policy.id} className="policy-item">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <div className="fw-semibold">
                      {policy.type} · {policy.provider}
                    </div>
                    <div className="small text-muted">
                      {policy.policyNumber} · ${policy.premium}/{policy.frequency}
                    </div>
                    {!policy.isHospitalization && (
                      <div className="small">
                        Coverage: ${parseInt(policy.coverageAmount || 0).toLocaleString()}{' '}
                        <Badge bg={policy.status === 'Active' ? 'success' : 'secondary'}>
                          {policy.status}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <ButtonGroup size="sm">
                    <Button variant="outline-secondary" onClick={() => onEditPolicy(policy)}>
                      Edit
                    </Button>
                    <Button variant="outline-danger" onClick={() => onDeletePolicy(policy.id)}>
                      Delete
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            ))
          )}

          {client.bankBalanceHistory && client.bankBalanceHistory.length > 0 && (
            <>
              <h4 className="h6 mt-3">Bank balance history</h4>
              {client.bankBalanceHistory.map((record, idx) => (
                <div
                  key={idx}
                  className="d-flex justify-content-between align-items-center bg-light rounded p-2 mb-2"
                >
                  <div>
                    <div className="fw-semibold small">
                      {record.date}: ${parseInt(record.balance || 0).toLocaleString()}
                    </div>
                    <div className="text-muted small">{record.notes}</div>
                  </div>
                  <ButtonGroup size="sm">
                    <Button variant="outline-secondary" onClick={() => onEditBank(record, idx)}>
                      Edit
                    </Button>
                    <Button variant="outline-danger" onClick={() => onDeleteBank(idx)}>
                      Delete
                    </Button>
                  </ButtonGroup>
                </div>
              ))}
            </>
          )}

          <h4 className="h6 mt-3">Interactions ({client.interactions.length})</h4>
          {client.interactions.length === 0 ? (
            <p className="small text-muted">No interactions logged yet</p>
          ) : (
            client.interactions.slice(0, 3).map((interaction) => (
              <div
                key={interaction.id}
                className={`interaction-item ${interaction.followUp ? 'has-followup' : ''}`}
              >
                <div className="d-flex justify-content-between gap-2">
                  <div>
                    <div>
                      <strong>{interaction.date}</strong> — {interaction.type}
                    </div>
                    <div className="text-muted">{interaction.notes}</div>
                    {interaction.followUp && (
                      <div className="text-primary fw-semibold mt-1">
                        Follow-up: {interaction.followUp}
                      </div>
                    )}
                  </div>
                  <ButtonGroup size="sm">
                    <Button
                      variant="outline-secondary"
                      onClick={() => onEditInteraction(interaction)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => onDeleteInteraction(interaction.id)}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
