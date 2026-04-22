import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

const empty = {
  name: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  occupation: '',
  annualIncome: '',
  riskProfile: 'Moderate',
  notes: '',
  totalBankBalance: '',
  cpfOA: '',
  cpfSA: '',
  cpfMA: '',
  nextReviewDate: '',
  reviewFrequency: 'Annual',
  createdDate: '',
};

export default function ClientFormModal({ show, client, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(client ? { ...empty, ...client } : empty);
  }, [client, show]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal show={show} onHide={onCancel} size="lg" scrollable>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{client ? 'Edit client' : 'Add new client'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Full name *</Form.Label>
            <Form.Control required value={form.name} onChange={update('name')} />
          </Form.Group>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Label>Email *</Form.Label>
              <Form.Control type="email" required value={form.email} onChange={update('email')} />
            </Col>
            <Col md={6}>
              <Form.Label>Phone *</Form.Label>
              <Form.Control type="tel" required value={form.phone} onChange={update('phone')} />
            </Col>
          </Row>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Label>Date of birth</Form.Label>
              <Form.Control
                type="date"
                value={form.dateOfBirth}
                onChange={update('dateOfBirth')}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Occupation</Form.Label>
              <Form.Control value={form.occupation} onChange={update('occupation')} />
            </Col>
          </Row>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Label>Annual income ($)</Form.Label>
              <Form.Control
                type="number"
                value={form.annualIncome}
                onChange={update('annualIncome')}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Risk profile</Form.Label>
              <Form.Select value={form.riskProfile} onChange={update('riskProfile')}>
                <option>Conservative</option>
                <option>Moderate</option>
                <option>Aggressive</option>
              </Form.Select>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control as="textarea" rows={3} value={form.notes} onChange={update('notes')} />
          </Form.Group>

          <fieldset className="border rounded p-3 mb-3">
            <legend className="float-none w-auto fs-6 fw-semibold px-2">
              Client relationship
            </legend>
            <Form.Group className="mb-3">
              <Form.Label>Client since</Form.Label>
              <Form.Control
                type="date"
                value={form.createdDate}
                onChange={update('createdDate')}
              />
              <Form.Text>Leave blank to use today&apos;s date.</Form.Text>
            </Form.Group>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Next review date</Form.Label>
                <Form.Control
                  type="date"
                  value={form.nextReviewDate}
                  onChange={update('nextReviewDate')}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Review frequency</Form.Label>
                <Form.Select value={form.reviewFrequency} onChange={update('reviewFrequency')}>
                  <option>Quarterly</option>
                  <option>Semi-Annual</option>
                  <option>Annual</option>
                </Form.Select>
              </Col>
            </Row>
          </fieldset>

          <fieldset className="border rounded p-3">
            <legend className="float-none w-auto fs-6 fw-semibold px-2">
              Financial information
            </legend>
            <Form.Group className="mb-3">
              <Form.Label>Total bank balance ($)</Form.Label>
              <Form.Control
                type="number"
                value={form.totalBankBalance}
                onChange={update('totalBankBalance')}
              />
            </Form.Group>
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Label>CPF OA ($)</Form.Label>
                <Form.Control type="number" value={form.cpfOA} onChange={update('cpfOA')} />
              </Col>
              <Col md={6}>
                <Form.Label>CPF SA ($)</Form.Label>
                <Form.Control type="number" value={form.cpfSA} onChange={update('cpfSA')} />
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>CPF Medisave ($)</Form.Label>
              <Form.Control type="number" value={form.cpfMA} onChange={update('cpfMA')} />
            </Form.Group>
          </fieldset>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {client ? 'Update client' : 'Add client'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
