import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

const empty = () => ({
  date: new Date().toISOString().split('T')[0],
  type: 'Meeting',
  notes: '',
  followUp: '',
});

export default function InteractionFormModal({ show, interaction, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(interaction ? { ...empty(), ...interaction } : empty());
  }, [interaction, show]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal show={show} onHide={onCancel}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{interaction ? 'Edit interaction' : 'Log interaction'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Label>Date *</Form.Label>
              <Form.Control
                type="date"
                required
                value={form.date}
                onChange={update('date')}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Type *</Form.Label>
              <Form.Select value={form.type} onChange={update('type')}>
                <option>Meeting</option>
                <option>Phone Call</option>
                <option>Email</option>
                <option>Follow-up</option>
                <option>Policy Review</option>
              </Form.Select>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Notes *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              required
              value={form.notes}
              onChange={update('notes')}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Follow-up date</Form.Label>
            <Form.Control type="date" value={form.followUp} onChange={update('followUp')} />
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
