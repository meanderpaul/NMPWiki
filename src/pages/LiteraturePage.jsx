import { useMemo, useState } from 'react';
import { useJsonData } from '../hooks/useJsonData';
import StatusMessage from '../components/StatusMessage';

export default function LiteraturePage() {
  const { data, error, loading } = useJsonData('/data/literature.json');
  const [query, setQuery] = useState('');

  const entries = Array.isArray(data) ? data : [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((entry) => {
      const haystack = [
        entry.videoTitle,
        entry.summary,
        ...(entry.books || []),
        ...(entry.authors || []),
        ...(entry.keyPoints || []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [entries, query]);

  return (
    <div className="container">
      <header className="page-header">
        <h2>Literature</h2>
        <p>Books, authors, and links drawn from episode descriptions.</p>
      </header>

      <div className="toolbar">
        <label className="search-field">
          <span className="visually-hidden">Search literature</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles, books, authors…"
          />
        </label>
        <p className="toolbar__meta">{filtered.length} entries</p>
      </div>

      <StatusMessage
        loading={loading}
        error={error}
        empty={!loading && !error && filtered.length === 0}
        emptyLabel="No literature entries found yet."
      />

      <div className="stack-list">
        {filtered.map((entry) => (
          <article key={entry.videoId || entry.videoTitle} className="lit-entry">
            <h3>{entry.videoTitle || 'Unknown Title'}</h3>
            <p>{entry.summary || 'No summary available'}</p>

            {entry.keyPoints?.length > 0 ? (
              <>
                <h4>Key points</h4>
                <ul>
                  {entry.keyPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {entry.books?.length > 0 ? (
              <>
                <h4>Books</h4>
                <ul>
                  {entry.books.map((book) => (
                    <li key={book}>{book}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {entry.authors?.length > 0 ? (
              <>
                <h4>Authors</h4>
                <ul>
                  {entry.authors.map((author) => (
                    <li key={author}>{author}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {entry.additionalResources?.length > 0 ? (
              <>
                <h4>Additional resources</h4>
                <ul>
                  {entry.additionalResources.map((resource) => (
                    <li key={resource}>
                      <a href={resource} target="_blank" rel="noopener noreferrer">
                        {resource}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
