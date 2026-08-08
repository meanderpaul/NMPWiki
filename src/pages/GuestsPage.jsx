import { useMemo, useState } from 'react';
import { useJsonData } from '../hooks/useJsonData';
import StatusMessage from '../components/StatusMessage';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function GuestsPage() {
  const { data, error, loading } = useJsonData('/data/guests.json');
  const [letter, setLetter] = useState('All');
  const [query, setQuery] = useState('');

  const guests = Array.isArray(data) ? data : [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guests.filter((guest) => {
      const name = guest.name || '';
      const matchesLetter =
        letter === 'All' || name.toLocaleUpperCase().startsWith(letter);
      const matchesQuery = !q || name.toLowerCase().includes(q);
      return matchesLetter && matchesQuery;
    });
  }, [guests, letter, query]);

  return (
    <div className="container">
      <header className="page-header">
        <h2>Guests</h2>
        <p>Filter by letter or search for a name.</p>
      </header>

      <div className="toolbar">
        <label className="search-field">
          <span className="visually-hidden">Search guests</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search guests…"
          />
        </label>
        <p className="toolbar__meta">{filtered.length} guests</p>
      </div>

      <div className="letter-bar" role="group" aria-label="Filter by letter">
        <button
          type="button"
          className={letter === 'All' ? 'letter-chip is-active' : 'letter-chip'}
          onClick={() => setLetter('All')}
        >
          All
        </button>
        {LETTERS.map((item) => (
          <button
            key={item}
            type="button"
            className={letter === item ? 'letter-chip is-active' : 'letter-chip'}
            onClick={() => setLetter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <StatusMessage
        loading={loading}
        error={error}
        empty={!loading && !error && filtered.length === 0}
        emptyLabel="No guests match this filter."
      />

      <div className="guest-grid">
        {filtered.map((guest) => (
          <article key={guest.name} className="guest-item">
            <h3>{guest.name}</h3>
            <p>
              {guest.episodes} episode{guest.episodes === 1 ? '' : 's'}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
