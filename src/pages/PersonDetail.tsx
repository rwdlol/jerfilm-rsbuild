import { useParams } from 'react-router';
import { Link } from 'react-router';
import { useTMDB } from '../utils/tmdb';
import NotFound from '../components/NotFound';
import {
  Star,
  Link as LinkIcon,
  MapPin,
  Calendar,
  Heart,
  Film,
  Tv,
  User,
} from 'lucide-react';

interface PersonDetail {
  id: number;
  name: string;
  biography?: string;
  birthday?: string | null;
  deathday?: string | null;
  gender?: number;
  place_of_birth?: string | null;
  popularity?: number;
  profile_path?: string | null;
  known_for_department?: string;
  also_known_as?: string[];
}

interface ExternalIds {
  imdb_id?: string | null;
  facebook_id?: string | null;
  instagram_id?: string | null;
  tiktok_id?: string | null;
  twitter_id?: string | null;
}

interface PersonImages {
  profiles: { file_path: string; aspect_ratio: number }[];
}

interface CreditItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  character?: string;
  vote_average?: number;
}

interface CreditsResponse {
  cast: CreditItem[];
  crew: CreditItem[];
}

const getGenderLabel = (value?: number) => {
  if (value === 1) return 'مێ (Female)';
  if (value === 2) return 'نێر (Male)';
  if (value === 3) return 'نەن-باینەری (Non-binary)';
  return 'دیاری نەکراو';
};

export default function PersonDetail() {
  const { personId } = useParams<{ personId: string }>();

  // Fetch all parallel API details
  const [person, personLoading, personError] = useTMDB<PersonDetail>(
    personId ? `/person/${personId}` : null,
  );
  const [externals] = useTMDB<ExternalIds>(
    personId ? `/person/${personId}/external_ids` : null,
  );
  const [images] = useTMDB<PersonImages>(
    personId ? `/person/${personId}/images` : null,
  );
  const [movieCredits] = useTMDB<CreditsResponse>(
    personId ? `/person/${personId}/movie_credits` : null,
  );
  const [tvCredits] = useTMDB<CreditsResponse>(
    personId ? `/person/${personId}/tv_credits` : null,
  );

  if (personLoading)
    return (
      <div className="text-zinc-400 py-4">بارکردنی زانیاری کەسایەتی...</div>
    );

  if (personError && personError.message.includes('could not be found')) {
    return <NotFound />;
  }
  if (personError)
    return (
      <div className="text-red-500 py-4">
        هەڵەیەک ڕوویدا: {personError.message}
      </div>
    );

  return (
    <div className="flex flex-col w-full gap-8 pb-8">
      {/* 1. Profile Hero Section */}
      <section className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 w-full rounded-2xl px-4 md:px-8 mt-4">
        {/* Profile Image Container */}
        <div className="w-full max-w-52 aspect-2/3 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-xl shrink-0">
          {person?.profile_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
              alt={person.name}
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
              بێ وێنە
            </div>
          )}
        </div>

        {/* Profile Intro Texts */}
        <div className="w-full h-full flex flex-col gap-3 items-center md:items-start text-center md:text-right">
          <h1 className="text-3xl font-black text-white">{person?.name}</h1>

          {person?.known_for_department && (
            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-lg">
              پۆلی سەرەکی: {person.known_for_department}
            </span>
          )}

          {person?.biography ? (
            <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl whitespace-pre-line">
              {person.biography}
            </p>
          ) : (
            <p className="text-zinc-500 text-sm italic">
              ژیاننامەی فەرمی بەردەست نییە.
            </p>
          )}

          {/* Social Media External Link Badges */}
          <div className="flex items-center gap-2.5 mt-2 flex-wrap justify-center md:justify-start">
            {externals?.instagram_id && (
              <a
                href={`https://instagram.com/${externals.instagram_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit px-2 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                title="Instagram"
              >
                Instagram
              </a>
            )}
            {externals?.facebook_id && (
              <a
                href={`https://facebook.com/${externals.facebook_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit px-2 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                title="Facebook"
              >
                Facebook
              </a>
            )}
            {externals?.twitter_id && (
              <a
                href={`https://twitter.com/${externals.twitter_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit px-2 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                title="Twitter"
              >
                Twitter
              </a>
            )}
            {externals?.imdb_id && (
              <a
                href={`https://imdb.com/name/${externals.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit px-2 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-500 flex items-center justify-center font-bold text-xs transition-colors"
                title="IMDb"
              >
                IMDb
              </a>
            )}
          </div>
        </div>
      </section>

      {/* 2. Personal Metadata Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-8">
        {/* Card 1: Born Details */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 p-4 rounded-2xl flex flex-col gap-2">
          <h3 className="text-white border-b border-zinc-800 pb-2 mb-1 flex items-center gap-2">
            <Calendar size={14} className="text-gold" /> لەدایکبوون و مێژوو
          </h3>
          <p className="text-zinc-400 text-sm">
            <span className="text-zinc-500">بەرواری لەدایکبوون:</span>{' '}
            {person?.birthday || 'نادیار'}
          </p>
          {person?.deathday && (
            <p className="text-red-400 text-sm">
              <span className="text-zinc-500">بەرواری کۆچی دوایی:</span>{' '}
              {person.deathday}
            </p>
          )}
          {person?.place_of_birth && (
            <p className="text-zinc-400 text-sm flex items-center gap-1">
              <MapPin size={12} className="text-zinc-500 shrink-0" />
              <span>{person.place_of_birth}</span>
            </p>
          )}
        </div>

        {/* Card 2: Gender and Personal stats */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 p-4 rounded-2xl flex flex-col gap-2">
          <h3 className="text-white border-b border-zinc-800 pb-2 mb-1 flex items-center gap-2">
            <User size={14} className="text-gold" /> ڕەگەز و پێناسە
          </h3>
          <p className="text-zinc-400 text-sm">
            <span className="text-zinc-500">ڕەگەز:</span>{' '}
            {getGenderLabel(person?.gender)}
          </p>
          <p className="text-zinc-400 text-sm">
            <span className="text-zinc-500">مەودای ناوبانگ (Popularity):</span>{' '}
            {person?.popularity?.toFixed(1) || '0'}
          </p>
        </div>

        {/* Card 3: Alternative Names */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 p-4 rounded-2xl flex flex-col gap-2">
          <h3 className="text-white border-b border-zinc-800 pb-2 mb-1 flex items-center gap-2">
            <LinkIcon size={14} className="text-gold" /> ناوەکانی تر
          </h3>
          {person?.also_known_as && person.also_known_as.length > 0 ? (
            <p
              className="text-zinc-400 text-xs leading-relaxed truncate max-w-full"
              title={person.also_known_as.join(', ')}
            >
              {person.also_known_as.slice(0, 3).join('، ')}
            </p>
          ) : (
            <p className="text-zinc-500 text-xs italic">
              ناوی تری تۆمارنەکراوە.
            </p>
          )}
        </div>
      </section>

      {/* 3. Movie Filmography Cast Credits */}
      {movieCredits?.cast && movieCredits.cast.length > 0 && (
        <section className="px-4 md:px-8">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3 mb-4">
            <Film size={18} className="text-gold" />
            <h2 className="text-lg font-bold text-white">
              بەشداریکردن لە فیلمەکاندا (کاست)
            </h2>
          </div>

          {/* Horizontal Scroll list of Movies */}
          <div className="flex flex-row overflow-x-auto gap-4 pb-4 pt-1 scrollbar-none snap-x snap-mandatory">
            {movieCredits.cast.slice(0, 15).map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={`${movie.id}-${movie.character}`}
                className="group relative flex flex-col w-36 sm:w-44 shrink-0 snap-start transition-all"
              >
                <div className="relative w-full aspect-2/3 rounded-2xl overflow-hidden border border-zinc-900 bg-zinc-950 shadow-md group-hover:border-zinc-700/50 group-hover:shadow-lg transition-all duration-350">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 text-xs">
                      بێ پۆستەر
                    </div>
                  )}
                  {movie.vote_average && movie.vote_average > 0 ? (
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-xs bg-zinc-950/80 backdrop-blur-md text-white p-1 px-1.5 rounded-lg font-bold">
                      <Star size={10} fill="gold" stroke="gold" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col gap-0.5 mt-2.5 px-1">
                  <h4 className="text-xs font-bold text-zinc-200 group-hover:text-gold transition-colors duration-200 truncate leading-tight">
                    {movie.title}
                  </h4>
                  {movie.character && (
                    <p
                      className="text-xs text-zinc-500 truncate"
                      title={movie.character}
                    >
                      ڕۆڵ: {movie.character}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. TV Filmography Cast Credits */}
      {tvCredits?.cast && tvCredits.cast.length > 0 && (
        <section className="px-4 md:px-8">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3 mb-4">
            <Tv size={18} className="text-gold" />
            <h2 className="text-lg font-bold text-white">
              بەشداریکردن لە زنجیرە تەلەفزیۆنییەکاندا
            </h2>
          </div>

          <div className="flex flex-row overflow-x-auto gap-4 pb-4 pt-1 scrollbar-none snap-x snap-mandatory">
            {tvCredits.cast.slice(0, 15).map((tv) => (
              <Link
                to={`/tv/${tv.id}`}
                key={`${tv.id}-${tv.character}`}
                className="group relative flex flex-col w-36 sm:w-44 shrink-0 snap-start transition-all"
              >
                <div className="relative w-full aspect-2/3 rounded-2xl overflow-hidden border border-zinc-900 bg-zinc-950 shadow-md group-hover:border-zinc-700/50 group-hover:shadow-lg transition-all duration-350">
                  {tv.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${tv.poster_path}`}
                      alt={tv.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 text-xs">
                      بێ پۆستەر
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 mt-2.5 px-1">
                  <h4 className="text-xs font-bold text-zinc-200 group-hover:text-gold transition-colors duration-200 truncate leading-tight">
                    {tv.name}
                  </h4>
                  {tv.character && (
                    <p
                      className="text-xs text-zinc-500 truncate"
                      title={tv.character}
                    >
                      ڕۆڵ: {tv.character}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. Headshots Profile Gallery */}
      {images?.profiles && images.profiles.length > 0 && (
        <section className="px-4 md:px-8">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3 mb-4">
            <Heart size={18} className="text-gold" />
            <h2 className="text-lg font-bold text-white">ئەلبومی وێنەکان</h2>
          </div>

          <div className="flex flex-row overflow-x-auto gap-4 pb-4 scrollbar-none snap-x snap-mandatory">
            {images.profiles.slice(0, 10).map((img, index) => (
              <div
                key={index}
                className="relative aspect-2/3 w-32 sm:w-40 shrink-0 snap-start overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 shadow-md"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${img.file_path}`}
                  alt={`${person?.name} profile shot`}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
