export default function StatusMessage({ loading, error, empty, emptyLabel = 'Nothing to show yet.' }) {
  if (loading) {
    return <p className="status-message">Loading…</p>;
  }
  if (error) {
    return <p className="status-message status-message--error">Could not load data. {error.message}</p>;
  }
  if (empty) {
    return <p className="status-message">{emptyLabel}</p>;
  }
  return null;
}
