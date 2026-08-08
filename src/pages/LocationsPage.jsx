import { useMemo, useState } from 'react';
import { useJsonData } from '../hooks/useJsonData';
import StatusMessage from '../components/StatusMessage';

export default function LocationsPage() {
  const { data, error, loading } = useJsonData('/data/locations.json');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);

  const locations = Array.isArray(data) ? data : [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter((location) => {
      const haystack = [
        location.location_name,
        location.location_of_site,
        location.description_of_relevance,
        ...(location.sources || []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [locations, query]);

  return (
    <div className="container">
      <header className="page-header">
        <h2>Locations</h2>
        <p>Historic sites connected to episodes and Nordic history.</p>
      </header>

      <div className="toolbar">
        <label className="search-field">
          <span className="visually-hidden">Search locations</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search locations…"
          />
        </label>
        <p className="toolbar__meta">{filtered.length} locations</p>
      </div>

      <StatusMessage
        loading={loading}
        error={error}
        empty={!loading && !error && filtered.length === 0}
        emptyLabel="No locations match your search."
      />

      <div className="stack-list">
        {filtered.map((location) => {
          const id = location.location_name;
          const isOpen = openId === id;
          return (
            <article key={id} className={`location-item ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="location-item__header"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : id)}
              >
                <span>
                  <strong>{location.location_name}</strong>
                  <span className="muted"> — {location.location_of_site}</span>
                </span>
                <span className="chevron" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              <div className="location-item__body">
                <p>
                  <strong>Discovered:</strong> {location.discovered_year || 'Unknown'}
                </p>
                <p>{location.description_of_relevance}</p>
                {location.sources?.length > 0 ? (
                  <>
                    <h4>Sources</h4>
                    <ul>
                      {location.sources.map((source) => (
                        <li key={source}>{source}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
