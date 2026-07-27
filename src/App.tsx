import { Link, Route, Routes } from 'react-router';
import BaseLayout from './layouts/Base';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function Home() {
  console.log('TMDB_API_KEY:', import.meta.env.TMDB_API_KEY);
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <Link to="/about">Link to About</Link>
    </div>
  );
}

function About() {
  return (
    <div className="content">
      <h1>About</h1>
      <p>This is a sample application built with Rsbuild and React.</p>
      <Link to="/">Go back to Home</Link>
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
