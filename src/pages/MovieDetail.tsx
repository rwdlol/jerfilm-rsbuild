import { Link, useParams } from 'react-router';
import { useTMDB, type MovieDetail } from '../utils/tmdb';
import AdultContent from '../components/AdultContent';
import { tToSorani, tToSoraniList } from '../utils/tToSorani';
import NotFound from '../components/NotFound';
import MediaPlayer from '../components/MediaPlayer';

export default function MovieDetail() {
  const { movieId } = useParams<{ movieId: string }>();
  const [data, loading, error] = useTMDB<MovieDetail>(`/movie/${movieId}`);

  if (loading)
    return <div className="text-zinc-400 p-4">بارکردنی فیلمە...</div>;

  if (
    error &&
    error.message === 'The resource you requested could not be found.'
  ) {
    return <NotFound />;
  }
  if (error)
    return (
      <div className="text-red-500 p-4">هەڵەیەک ڕوویدا: {error.message}</div>
    );

  if (data?.adult) return <AdultContent />;

  return (
    <div className="flex flex-col w-full gap-6 pb-6">
      {/* 1. Backdrop Path & Top Header section */}
      {data?.backdrop_path && (
        <div className="relative w-full h-48 md:h-80 rounded-2xl overflow-hidden border border-zinc-800">
          <img
            src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
            alt={data?.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>
      )}

      {/* 2. Main Details Section */}
      <section className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 w-full rounded-2xl -mt-16 md:-mt-32">
        <img
          src={`https://image.tmdb.org/t/p/w500${data?.poster_path}`}
          alt={data?.title}
          className="w-full max-w-52 h-auto object-center object-cover rounded-2xl border border-zinc-800 shadow-xl"
        />
        <div className="w-full h-full flex flex-col gap-3 items-center md:items-start text-center md:text-start mt-16 md:mt-32">
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
            <h1 className="text-3xl font-bold text-white">{data?.title}</h1>
            {data?.status && (
              <span className="bg-zinc-800 text-sm text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-700">
                {tToSorani(data.status)}
              </span>
            )}
          </div>

          {data?.original_title && data.original_title !== data.title && (
            <p className="italic text-lg text-zinc-400">
              {data?.original_title}
            </p>
          )}

          <p className="text-gray-300 max-w-3xl leading-relaxed text-base">
            {data?.overview}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-zinc-400 justify-center md:justify-start">
            {data?.runtime ? <span>ماوە: {data.runtime} خولەک</span> : null}
            {data?.release_date ? (
              <>
                <span className="text-zinc-700">|</span>
                <span>بڵاوکردنەوە: {data.release_date}</span>
              </>
            ) : null}
            {data?.vote_average ? (
              <>
                <span className="text-zinc-700">|</span>
                <span className="inline-flex items-center gap-1">
                  نمرە: 10/{data.vote_average.toFixed(1)}{' '}
                  {data?.vote_count &&
                    `(${data?.vote_count.toLocaleString('ku-IQ')} دەنگ)`}
                </span>
              </>
            ) : null}
          </div>

          {data?.genres && data.genres.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-1">
              {data.genres.map((g) => (
                <span
                  key={g.id}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-lg"
                >
                  {tToSorani(g.name)}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* 3. Detailed Metadata Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/80 p-4 rounded-2xl flex flex-col gap-2">
          <h3 className="text-white border-b border-zinc-800/60 pb-2 mb-1">
            زمانەکان
          </h3>
          <p className="text-zinc-400">
            <span className="text-zinc-500">زمانی سەرەکی:</span>{' '}
            {data?.original_language
              ? tToSorani(data.original_language)
              : 'نادیار'}
          </p>
          {data?.origin_country && data.origin_country.length > 0 && (
            <p className="text-zinc-400">
              <span className="text-zinc-500">وڵاتی سەرەکی:</span>{' '}
              {tToSoraniList(data.origin_country)?.join('، ')}
            </p>
          )}
        </div>

        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/80 p-4 rounded-2xl flex flex-col gap-2">
          <h3 className="text-white border-b border-zinc-800/60 pb-2 mb-1">
            کۆکردنەوە و بەندکردن
          </h3>
          {data?.belongs_to_collection ? (
            <p className="text-zinc-400">
              <span className="text-zinc-500">سەر بە زنجیرەی:</span>{' '}
              <Link
                to={`/collection/${data.belongs_to_collection.id}`}
                className="text-gold hover:underline"
              >
                {data.belongs_to_collection.name}
              </Link>
            </p>
          ) : (
            <p className="text-zinc-500 italic">
              ئەم فیلمە بەشێک نییە لە هیچ کۆمەڵە یان زنجیرە فیلمێک.
            </p>
          )}
          <p className="text-zinc-400">
            <span className="text-zinc-500">ڕێپێدانی تەمەن:</span>{' '}
            {data?.adult ? 'سەروو ١٨ ساڵ (+18)' : 'بۆ هەمووان'}
          </p>
        </div>
      </section>

      {/* 4. Media Player Section */}
      {data?.id && (
        <section className="flex flex-col">
          <div className="flex flex-col gap-2 bg-zinc-950 border border-zinc-900 p-4 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
                سەیرکردنی فیلمەکە
              </h2>
            </div>
            <MediaPlayer type="movie" id={data.id} />
          </div>
        </section>
      )}
    </div>
  );
}
