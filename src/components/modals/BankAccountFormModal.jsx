import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const empty = () => ({
  balance: '',
  notes: '',
  date: new Date().toISOString().split('T')[0],
});

export default function BankAccountFormModal({ show, balance, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(balance?.data ? { ...empty(), ...balance.data } : empty());
  }, [balance, show]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal show={show} onHide={onCancel}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{balance ? 'Edit balance' : 'Update bank balance'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Date *</Form.Label>
            <Form.Control
              type="date"
              required
              value={form.date}
              onChange={update('date')}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Current total bank balance ($) *</Form.Label>
            <Form.Control
              type="number"
              required
              value={form.balance}
              onChange={update('balance')}
            />
            <Form.Text>Include all savings, current accounts, and accessible funds.</Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Notes *</Form.Label>
            <Form.Control
              required
              value={form.notes}
              onChange={update('notes')}
              placeholder="e.g., Annual review, after bonus"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
