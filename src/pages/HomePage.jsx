import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="container home-page">
      <section className="intro-block">
        <h2>Explore the podcast deeper</h2>
        <p>
          Since 2019, the Nordic Mythology Podcast has shared accurate, engaging discussions about
          Nordic mythology and the Viking Age. NMP Resources gathers the people, places, and
          literature behind each episode so you can keep exploring after you listen.
        </p>
      </section>

      <section className="path-grid" aria-label="Resource sections">
        <Link className="path-link" to="/episodes">
          <h3>Episodes</h3>
          <p>Browse the full catalogue by year, with guests and descriptions.</p>
        </Link>
        <Link className="path-link" to="/guests">
          <h3>Guests</h3>
          <p>Meet scholars, artists, authors, and storytellers who joined the show.</p>
        </Link>
        <Link className="path-link" to="/literature">
          <h3>Literature</h3>
          <p>Follow books, papers, and links referenced across episodes.</p>
        </Link>
        <Link className="path-link" to="/locations">
          <h3>Locations</h3>
          <p>Visit historic sites discussed on the podcast, from Hedeby to Vinland.</p>
        </Link>
      </section>
    </div>
  );
}
