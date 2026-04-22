import { useMemo, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import ClientCard from './ClientCard';

export default function ClientsPanel({
  clients,
  onAddClient,
  onEditClient,
  onDeleteClient,
  onAddPolicy,
  onEditPolicy,
  onDeletePolicy,
  onAddInteraction,
  onEditInteraction,
  onDeleteInteraction,
  onAddBank,
  onEditBank,
  onDeleteBank,
  onGenerateClientReport,
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }, [clients, search]);

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <InputGroup style={{ maxWidth: 320 }}>
          <InputGroup.Text>Search</InputGroup.Text>
          <Form.Control
            placeholder="Name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <Button variant="primary" onClick={onAddClient}>
          Add new client
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p>No clients found. Add your first client to get started.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={() => onEditClient(client)}
              onDelete={() => {
                if (confirm('Delete this client?')) onDeleteClient(client.id);
              }}
              onAddPolicy={() => onAddPolicy(client)}
              onEditPolicy={(policy) => onEditPolicy(client, policy)}
              onDeletePolicy={(policyId) => {
                if (confirm('Delete this policy?')) onDeletePolicy(client.id, policyId);
              }}
              onAddInteraction={() => onAddInteraction(client)}
              onEditInteraction={(interaction) => onEditInteraction(client, interaction)}
              onDeleteInteraction={(id) => {
                if (confirm('Delete this interaction?')) onDeleteInteraction(client.id, id);
              }}
              onAddBank={() => onAddBank(client)}
              onEditBank={(record, idx) => onEditBank(client, record, idx)}
              onDeleteBank={(idx) => {
                if (confirm('Delete this balance record?')) onDeleteBank(client.id, idx);
              }}
              onGenerateReport={() => onGenerateClientReport(client)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
