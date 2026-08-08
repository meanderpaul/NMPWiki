import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EpisodesPage from './pages/EpisodesPage';
import GuestsPage from './pages/GuestsPage';
import LiteraturePage from './pages/LiteraturePage';
import LocationsPage from './pages/LocationsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="episodes" element={<EpisodesPage />} />
        <Route path="guests" element={<GuestsPage />} />
        <Route path="literature" element={<LiteraturePage />} />
        <Route path="locations" element={<LocationsPage />} />
      </Route>
    </Routes>
  );
}
