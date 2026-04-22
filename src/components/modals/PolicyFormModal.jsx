import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

const empty = {
  type: '',
  provider: '',
  policyNumber: '',
  premium: '',
  frequency: 'Annual',
  coverageAmount: '',
  tpdCoverage: '',
  tpdSameAsDeath: false,
  criticalIllnessCoverage: '',
  ciNotes: '',
  earlyCriticalIllnessCoverage: '',
  eciNotes: '',
  startDate: '',
  endDate: '',
  status: 'Active',
  hasCashValue: false,
  currentCashValue: '',
  projectedCashValue: [],
  isInvestmentLinked: false,
  currentAccountValue: '',
  investmentAllocation: '',
  illustratedValueAge55: '',
  illustratedValueAge65: '',
  ilpPremiumInclusionPercent: '0',
  isHospitalization: false,
  hospitalType: 'Private',
  integratedShieldCPF: '',
  integratedShieldCash: '',
  riderCash: '',
};

export default function PolicyFormModal({ show, policy, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);
  const [projections, setProjections] = useState([{ age: '', value: '' }]);

  useEffect(() => {
    if (policy) {
      setForm({ ...empty, ...policy });
      setProjections(
        policy.projectedCashValue && policy.projectedCashValue.length > 0
          ? policy.projectedCashValue
          : [{ age: '', value: '' }],
      );
    } else {
      setForm(empty);
      setProjections([{ age: '', value: '' }]);
    }
  }, [policy, show]);

  const update = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

  const handleTypeChange = (e) => {
    const type = e.target.value;
    const isHosp = type === 'Hospitalization';
    setForm((f) => ({
      ...f,
      type,
      isHospitalization: isHosp,
      coverageAmount: isHosp ? '0' : f.coverageAmount,
      premium: isHosp ? '0' : f.premium,
    }));
  };

  const updateProjection = (index, field, value) => {
    setProjections((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      projectedCashValue: form.hasCashValue
        ? projections.filter((p) => p.age && p.value)
        : [],
    });
  };

  return (
    <Modal show={show} onHide={onCancel} size="lg" scrollable>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{policy ? 'Edit policy' : 'Add new policy'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Label>Policy type *</Form.Label>
              <Form.Select required value={form.type} onChange={handleTypeChange}>
                <option value="">Select type</option>
                <option>Life Insurance</option>
                <option>Critical Illness</option>
                <option>Early Critical Illness</option>
                <option>Disability Income</option>
                <option>Whole Life</option>
                <option>Term Life</option>
                <option>Investment-Linked Policy</option>
                <option>Hospitalization</option>
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label>Provider *</Form.Label>
              <Form.Control required value={form.provider} onChange={update('provider')} />
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Policy number *</Form.Label>
            <Form.Control
              required
              value={form.policyNumber}
              onChange={update('policyNumber')}
            />
          </Form.Group>

          {!form.isHospitalization && (
            <>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <Form.Label>Premium ($) *</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={form.premium}
                    onChange={update('premium')}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Frequency *</Form.Label>
                  <Form.Select value={form.frequency} onChange={update('frequency')}>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Semi-Annual</option>
                    <option>Annual</option>
                  </Form.Select>
                </Col>
              </Row>

              <fieldset className="border rounded p-3 mb-3">
                <legend className="float-none w-auto fs-6 fw-semibold px-2">
                  Coverage amounts
                </legend>
                <Form.Group className="mb-3">
                  <Form.Label>Death benefit ($) *</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={form.coverageAmount}
                    onChange={update('coverageAmount')}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>TPD coverage ($)</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.tpdCoverage}
                    onChange={update('tpdCoverage')}
                  />
                  <Form.Check
                    className="mt-2"
                    type="checkbox"
                    label="Same as death benefit (most common in Singapore)"
                    checked={form.tpdSameAsDeath}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        tpdSameAsDeath: e.target.checked,
                        tpdCoverage: e.target.checked ? f.coverageAmount : f.tpdCoverage,
                      }))
                    }
                  />
                </Form.Group>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Critical illness coverage ($)</Form.Label>
                    <Form.Control
                      type="number"
                      value={form.criticalIllnessCoverage}
                      onChange={update('criticalIllnessCoverage')}
                    />
                    <Form.Control
                      className="mt-2"
                      size="sm"
                      placeholder="Special features"
                      value={form.ciNotes}
                      onChange={update('ciNotes')}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Early CI coverage ($)</Form.Label>
                    <Form.Control
                      type="number"
                      value={form.earlyCriticalIllnessCoverage}
                      onChange={update('earlyCriticalIllnessCoverage')}
                    />
                    <Form.Control
                      className="mt-2"
                      size="sm"
                      placeholder="Special features"
                      value={form.eciNotes}
                      onChange={update('eciNotes')}
                    />
                  </Col>
                </Row>
              </fieldset>
            </>
          )}

          {form.isHospitalization && (
            <fieldset className="border rounded p-3 mb-3" style={{ background: '#fef3c7' }}>
              <legend className="float-none w-auto fs-6 fw-semibold px-2">
                Hospitalization plan details
              </legend>
              <Form.Group className="mb-3">
                <Form.Label>Hospital coverage type *</Form.Label>
                <Form.Select value={form.hospitalType} onChange={update('hospitalType')}>
                  <option>Private</option>
                  <option>Public - Class A</option>
                  <option>Public - Class B1</option>
                  <option>Public - Class B2/C</option>
                </Form.Select>
              </Form.Group>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <Form.Label>IS Plan: CPF portion ($)</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.integratedShieldCPF}
                    onChange={update('integratedShieldCPF')}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>IS Plan: Cash portion ($)</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.integratedShieldCash}
                    onChange={update('integratedShieldCash')}
                  />
                </Col>
              </Row>
              <Form.Group>
                <Form.Label>Rider premium, full cash ($)</Form.Label>
                <Form.Control
                  type="number"
                  value={form.riderCash}
                  onChange={update('riderCash')}
                />
              </Form.Group>
            </fieldset>
          )}

          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Label>Start date *</Form.Label>
              <Form.Control
                type="date"
                required
                value={form.startDate}
                onChange={update('startDate')}
              />
            </Col>
            <Col md={6}>
              <Form.Label>End date</Form.Label>
              <Form.Control type="date" value={form.endDate} onChange={update('endDate')} />
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select value={form.status} onChange={update('status')}>
              <option>Active</option>
              <option>Pending</option>
              <option>Lapsed</option>
              <option>Cancelled</option>
            </Form.Select>
          </Form.Group>

          {!form.isHospitalization && (
            <>
              <Form.Check
                className="mb-2"
                type="checkbox"
                label="This policy has cash value (e.g., Whole Life)"
                checked={form.hasCashValue}
                onChange={(e) =>
                  setForm((f) => ({ ...f, hasCashValue: e.target.checked }))
                }
              />

              {form.hasCashValue && (
                <fieldset className="border rounded p-3 mb-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Current cash value ($)</Form.Label>
                    <Form.Control
                      type="number"
                      value={form.currentCashValue}
                      onChange={update('currentCashValue')}
                    />
                  </Form.Group>
                  <Form.Label>Projected cash value at future ages</Form.Label>
                  {projections.map((proj, idx) => (
                    <Row key={idx} className="g-2 mb-2">
                      <Col xs={4}>
                        <Form.Control
                          type="number"
                          placeholder="Age"
                          value={proj.age}
                          onChange={(e) => updateProjection(idx, 'age', e.target.value)}
                        />
                      </Col>
                      <Col xs={6}>
                        <Form.Control
                          type="number"
                          placeholder="Cash value ($)"
                          value={proj.value}
                          onChange={(e) => updateProjection(idx, 'value', e.target.value)}
                        />
                      </Col>
                      <Col xs={2}>
                        {projections.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() =>
                              setProjections((prev) => prev.filter((_, i) => i !== idx))
                            }
                          >
                            ×
                          </Button>
                        )}
                      </Col>
                    </Row>
                  ))}
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setProjections((p) => [...p, { age: '', value: '' }])}
                  >
                    Add projection
                  </Button>
                </fieldset>
              )}

              <Form.Check
                className="mb-2"
                type="checkbox"
                label="Investment-linked policy (ILP)"
                checked={form.isInvestmentLinked}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isInvestmentLinked: e.target.checked }))
                }
              />

              {form.isInvestmentLinked && (
                <fieldset className="border rounded p-3 mb-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Current account value ($)</Form.Label>
                    <Form.Control
                      type="number"
                      value={form.currentAccountValue}
                      onChange={update('currentAccountValue')}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Investment allocation</Form.Label>
                    <Form.Control
                      value={form.investmentAllocation}
                      onChange={update('investmentAllocation')}
                      placeholder="e.g., 70% Equity, 30% Bonds"
                    />
                  </Form.Group>
                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <Form.Label>Illustrated value age 55 ($)</Form.Label>
                      <Form.Control
                        type="number"
                        value={form.illustratedValueAge55}
                        onChange={update('illustratedValueAge55')}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label>Illustrated value age 65 ($)</Form.Label>
                      <Form.Control
                        type="number"
                        value={form.illustratedValueAge65}
                        onChange={update('illustratedValueAge65')}
                      />
                    </Col>
                  </Row>
                  <Form.Group>
                    <Form.Label>Include premium in affordability (%)</Form.Label>
                    <Form.Select
                      value={form.ilpPremiumInclusionPercent}
                      onChange={update('ilpPremiumInclusionPercent')}
                    >
                      <option value="0">0% — Don&apos;t include</option>
                      <option value="30">30% — Partial protection</option>
                      <option value="50">50% — Balanced</option>
                      <option value="100">100% — Full premium</option>
                    </Form.Select>
                  </Form.Group>
                </fieldset>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {policy ? 'Update policy' : 'Add policy'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
