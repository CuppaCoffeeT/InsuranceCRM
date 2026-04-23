import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Form } from 'react-bootstrap';
import { supabase } from '../../lib/supabase';
import AuthLayout from './AuthLayout';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError(err.message);
    else navigate('/', { replace: true });
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Insurance Advisor CRM"
      footer={
        <>
          New here? <Link to="/signup">Create an account</Link>
        </>
      }
    >
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
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
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Form.Group>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link to="/reset-password" className="small">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="primary" className="w-100" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </Form>
    </AuthLayout>
  );
}
