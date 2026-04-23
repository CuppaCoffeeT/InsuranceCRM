import { Card, Container } from 'react-bootstrap';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: 420 }} className="shadow-sm">
        <Card.Body className="p-4">
          <div className="mb-4 text-center">
            <h1 className="h4 mb-1">{title}</h1>
            {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="mt-3 text-center small">{footer}</div>}
        </Card.Body>
      </Card>
    </Container>
  );
}
