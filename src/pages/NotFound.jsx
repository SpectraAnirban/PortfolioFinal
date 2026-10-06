import { Link } from 'react-router-dom';
import Page from '../components/Page.jsx';

export default function NotFound() {
  return (
    <Page title="Not found">
      <section className="page-hero container notfound">
        <p className="mono muted">HTTP 404 · route not registered in gateway policy</p>
        <h1 className="page-title">This page doesn’t exist.</h1>
        <Link to="/" className="btn">Back home</Link>
      </section>
    </Page>
  );
}
