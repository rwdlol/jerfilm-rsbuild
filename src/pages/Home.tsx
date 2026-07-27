import { SEO } from '../components/SEO';
import TrendingMovies from '../components/sections/TrendingMovies';
import TrendingSeries from '../components/sections/TrendingSeries';

export default function Home() {
  return (
    <>
      <SEO title="Home | JerFilm.VIP" description="Welcome to JerFilm.VIP" />

      <TrendingMovies />
      <TrendingSeries />
    </>
  );
}
