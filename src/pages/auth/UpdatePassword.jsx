import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Form } from 'react-bootstrap';
import { supabase } from '../../lib/supabase';
import AuthLayout from './AuthLayout';

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recoverySession, setRecoverySession] = useState(false);

  useEffect(() => {
    // Supabase automatically picks up the recovery token from the URL hash
    // and fires a PASSWORD_RECOVERY event via onAuthStateChange.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setRecoverySession(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setRecoverySession(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setInfo('Password updated. Redirecting to sign in…');
      setTimeout(() => navigate('/signin', { replace: true }), 1500);
    }
  };

  return (
    <AuthLayout title="Set a new password" subtitle="Enter your new password below">
      <Form onSubmit={handleSubmit}>
        {!recoverySession && (
          <Alert variant="warning">
            This link must be opened from the email we sent. If it expired, request a new one.
          </Alert>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        {info && <Alert variant="success">{info}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>New password</Form.Label>
          <Form.Control
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm new password</Form.Label>
          <Form.Control
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100" disabled={loading}>
          {loading ? 'Saving…' : 'Update password'}
        </Button>
      </Form>
    </AuthLayout>
  );
}
