import { Component } from 'react';
import { Alert, Container } from 'react-bootstrap';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <Container className="py-5" style={{ maxWidth: 720 }}>
          <Alert variant="danger">
            <Alert.Heading>Something went wrong</Alert.Heading>
            <p className="mb-2">
              <strong>{this.state.error.name}:</strong> {this.state.error.message}
            </p>
            <details className="small">
              <summary>Stack</summary>
              <pre className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error.stack}
              </pre>
            </details>
          </Alert>
          <Alert variant="info" className="small">
            Common cause: missing Supabase env vars.
            <br />
            Local dev needs <code>.env.local</code> with{' '}
            <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.
            <br />
            Production needs the same two set in Vercel → Settings → Environment Variables,
            then redeploy.
          </Alert>
        </Container>
      );
    }
    return this.props.children;
  }
}
