import { Route, Routes } from 'react-router';
import BaseLayout from './layouts/Base';
import { SEO } from './components/SEO';
import Home from './pages/Home';
import 'lenis/dist/lenis.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<Home />} />
        <Route path="/movie" element={<>movies</>} />
        <Route path="/movie/:id" element={<>movie details</>} />
        <Route path="/tv" element={<>tv shows</>} />
        <Route path="/tv/:id" element={<>tv show details</>} />
        <Route path="/person" element={<>people</>} />
        <Route path="/person/:id" element={<>person details</>} />
        <Route path="/collection" element={<>collections</>} />
        <Route path="/collection/:id" element={<>collection details</>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="content">
      <SEO
        title="404 Page not found | JerFilm.VIP"
        description="The page you are looking for does not exist."
      />
      <h1>404</h1>
      <p>Page not found.</p>
    </div>
  );
}
