import { useMemo, useState } from 'react';
import { useJsonData } from '../hooks/useJsonData';
import StatusMessage from '../components/StatusMessage';
import {
  cleanDescription,
  extractEpisodeNumber,
  extractGuestName,
  groupEpisodesByYear,
} from '../utils/episodes';

export default function EpisodesPage() {
  const { data, error, loading } = useJsonData('/data/episodes.json');
  const [query, setQuery] = useState('');
  const [openYears, setOpenYears] = useState(() => new Set());

  const episodes = Array.isArray(data) ? data : [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return episodes;
    return episodes.filter((episode) => {
      const title = episode.snippet?.title || '';
      const description = episode.snippet?.description || '';
      const guest = extractGuestName(description, title);
      return (
        title.toLowerCase().includes(q) ||
        guest.toLowerCase().includes(q) ||
        description.toLowerCase().includes(q)
      );
    });
  }, [episodes, query]);

  const byYear = useMemo(() => groupEpisodesByYear(filtered), [filtered]);
  const years = useMemo(
    () => Object.keys(byYear).map(Number).sort((a, b) => b - a),
    [byYear]
  );

  function toggleYear(year) {
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  }

  return (
    <div className="container">
      <header className="page-header">
        <h2>Episodes</h2>
        <p>Search titles and guests, then open a year to browse.</p>
      </header>

      <div className="toolbar">
        <label className="search-field">
          <span className="visually-hidden">Search episodes</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or guest…"
          />
        </label>
        <p className="toolbar__meta">{filtered.length} episodes</p>
      </div>

      <StatusMessage
        loading={loading}
        error={error}
        empty={!loading && !error && filtered.length === 0}
        emptyLabel="No episodes match your search."
      />

      <div className="year-list">
        {years.map((year) => {
          const isOpen = openYears.has(year);
          const yearEpisodes = [...byYear[year]].sort(
            (a, b) =>
              new Date(b.snippet?.publishedAt || 0) - new Date(a.snippet?.publishedAt || 0)
          );

          return (
            <section key={year} className={`year-panel ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="year-panel__header"
                aria-expanded={isOpen}
                onClick={() => toggleYear(year)}
              >
                <span>{year}</span>
                <span className="year-panel__count">{yearEpisodes.length}</span>
              </button>
              <div className="year-panel__body">
                {yearEpisodes.map((episode) => {
                  const title = episode.snippet?.title || 'No title';
                  const description = episode.snippet?.description || '';
                  const videoId =
                    episode.contentDetails?.videoId ||
                    episode.snippet?.resourceId?.videoId;
                  return (
                    <article key={episode.id || videoId || title} className="episode-card">
                      <h3>{title}</h3>
                      <p>
                        <strong>Episode:</strong> {extractEpisodeNumber(title) || 'N/A'}
                      </p>
                      <p>
                        <strong>Guest:</strong> {extractGuestName(description, title)}
                      </p>
                      <p>
                        <strong>Published:</strong>{' '}
                        {episode.snippet?.publishedAt
                          ? new Date(episode.snippet.publishedAt).toLocaleDateString()
                          : 'Unknown'}
                      </p>
                      <p className="episode-card__description">
                        {cleanDescription(description) || 'No description available'}
                      </p>
                      {videoId ? (
                        <a
                          className="text-link"
                          href={`https://www.youtube.com/watch?v=${videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Watch on YouTube
                        </a>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
