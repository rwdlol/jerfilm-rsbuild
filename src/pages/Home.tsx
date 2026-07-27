import { useTMDB, type Movie, type TMDBResponseList } from '../utils/tmdb';
import { SEO } from '../components/SEO';
import TrendingMovies from '../components/sections/TrendingMovies';
import TrendingSeries from '../components/sections/TrendingSeries';
import { HeroCarousel } from '../components/ui/HeroCarousel';

export default function Home() {
  const [data, loading, error] = useTMDB<TMDBResponseList<Movie>>(
    '/trending/movie/week',
  );

  if (loading) return <div>بارکردنی فیلمە ترێند...</div>;
  if (error) return <div>هەڵەیەک ڕوویدا: {error.message}</div>;

  return (
    <>
      <SEO title="Home | JerFilm.VIP" description="Welcome to JerFilm.VIP" />
      <HeroCarousel slides={data?.results as Movie[]} />
      <TrendingMovies />
      <TrendingSeries />
    </>
  );
}
