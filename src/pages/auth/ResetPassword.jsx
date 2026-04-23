import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Form } from 'react-bootstrap';
import { supabase } from '../../lib/supabase';
import AuthLayout from './AuthLayout';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setLoading(false);
    if (err) setError(err.message);
    else setInfo('If an account exists for this email, a reset link has been sent.');
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="We will send you a recovery link"
      footer={
        <>
          Remembered it? <Link to="/signin">Back to sign in</Link>
        </>
      }
    >
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        {info && <Alert variant="success">{info}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
      </Form>
    </AuthLayout>
  );
}
