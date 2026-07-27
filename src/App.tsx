import { Route, Routes } from 'react-router';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function Home() {
  console.log('TMDB_API_KEY:', import.meta.env.TMDB_API_KEY);
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="content">
      <h1>404</h1>
      <p>Page not found.</p>
    </div>
  );
}
