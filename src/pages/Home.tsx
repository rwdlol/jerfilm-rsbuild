import { SEO } from '../components/SEO';
import TrendingMovies from '../components/sections/TrendingMovies';
import TrendingSeries from '../components/sections/TrendingSeries';
import { HeroCarousel } from '../components/ui/HeroCarousel';
import type { Movie } from '../utils/tmdb';
import FristSlideImage from '../assets/images/netflix_banner.jpg';

const slides: Movie[] = [
  {
    id: 0,
    title: ' بەبێ چاوەڕوانی، فیلمەکان بە کوردی ببینە!',
    poster_path: FristSlideImage,
    overview:
      ' چیتر پێویست بە چاوەڕوانی وەرگێڕان ناکات. سیستەمە فەورییەکەمان ڕاستەوخۆ کار دەکات بۆت، زۆرترین خێرایی و باشترین کوالیتی بەبێ ڕێکلام.',
    cta_text: 'بینینی فیلمەکان',
    cta_link: '#watch',
    cta_type: 'gold',
  },
  {
    id: 1,
    title: ' بەبێ چاوەڕوانی، فیلمەکان بە کوردی ببینە!',
    poster_path: FristSlideImage,
    overview:
      ' چیتر پێویست بە چاوەڕوانی وەرگێڕان ناکات. سیستەمە فەورییەکەمان ڕاستەوخۆ کار دەکات بۆت، زۆرترین خێرایی و باشترین کوالیتی بەبێ ڕێکلام.',
    cta_text: 'بینینی فیلمەکان',
    cta_link: '#watch',
    cta_type: 'gold',
  },
];

export default function Home() {
  return (
    <>
      <SEO title="Home | JerFilm.VIP" description="Welcome to JerFilm.VIP" />
      <HeroCarousel slides={slides} />
      <TrendingMovies />
      <TrendingSeries />
    </>
  );
}
