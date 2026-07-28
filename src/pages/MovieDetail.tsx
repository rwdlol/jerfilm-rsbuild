import { Link, useParams } from 'react-router';
import { useTMDB, type MovieDetail } from '../utils/tmdb';
import AdultContent from '../components/AdultContent';
import { tToSorani, tToSoraniList } from '../utils/tToSorani';
import NotFound from '../components/NotFound';
import { useState } from 'react';

export default function MovieDetail() {
  const { movieId } = useParams<{ movieId: string }>();
  const [data, loading, error] = useTMDB<MovieDetail>(`/movie/${movieId}`);
  const [server, setServer] = useState('one');

  if (loading) return <div>بارکردنی فیلمە ترێند...</div>;

  if (
    error &&
    error.message === 'The resource you requested could not be found.'
  ) {
    return <NotFound />;
  }
  if (error) return <div>هەڵەیەک ڕوویدا: {error.message}</div>;

  if (data?.adult) return <AdultContent />;

  return (
    <div className="flex flex-col w-full gap-4 pb-4">
      <section className="relative z-0 flex flex-col md:flex-row items-center md:items-start gap-4 w-full rounded-2xl">
        <img
          src={`https://image.tmdb.org/t/p/w500${data?.poster_path}`}
          alt={data?.title}
          className="w-full max-w-52 h-auto object-center object-cover rounded-2xl border border-zinc-800"
        />
        <div className="w-full h-full flex flex-col gap-1 items-center md:items-start text-center md:text-start">
          <h1 className="text-2xl font-bold text-white">{data?.title}</h1>
          {data?.original_title && data.original_title !== data.title && (
            <p className="italic text-lg">{data?.original_title}</p>
          )}
          <p className="text-gray-300 max-w-2xl">{data?.overview}</p>

          {data?.status ? (
            <p className="text-zinc-400">
              <span className="text-white">دۆخ:</span> {tToSorani(data.status)}
            </p>
          ) : null}
          {data?.runtime ? (
            <p className="text-zinc-400">
              <span className="text-white">کات:</span> {data.runtime} خولەک
            </p>
          ) : null}
          {data?.release_date ? (
            <p className="text-zinc-400">
              <span className="text-white">بڵاوکرایەوە:</span>{' '}
              {new Date(data.release_date).getFullYear()}
            </p>
          ) : null}
          {data?.belongs_to_collection ? (
            <p className="text-zinc-400">
              <span className="text-white">سەر بە کۆکردنەوەیە:</span>{' '}
              <Link
                to={`/collection/${data.belongs_to_collection.id}`}
                className="hover:underline"
              >
                {data.belongs_to_collection.name}
              </Link>
            </p>
          ) : null}
          {data?.origin_country ? (
            <p className="text-zinc-400">
              <span className="text-white">وڵات:</span>{' '}
              {tToSoraniList(data.origin_country)?.join('، ')}
            </p>
          ) : null}
          {data?.original_language ? (
            <p className="text-zinc-400">
              <span className="text-white">زمان:</span>{' '}
              {tToSorani(data.original_language)}
            </p>
          ) : null}
          {data?.vote_average ? (
            <p className="text-zinc-400">
              <span className="text-white">دەنگەکان:</span>{' '}
              <span className="inline-flex items-center gap-1">
                10/{data.vote_average.toFixed(1)}{' '}
                {data?.vote_count &&
                  `(${data?.vote_count.toLocaleString('ku-IQ')} دەنگ)`}
              </span>
            </p>
          ) : null}
          {data?.vote_average ? (
            <p className="text-zinc-400">
              <span className="text-white">ژانەرەکان:</span>{' '}
              {tToSoraniList(data.genres?.map((g) => g.name) || [])?.join('، ')}
            </p>
          ) : null}
        </div>
      </section>

      <section className="w-full grid md:grid-cols-3 gap-2 my-4">
        <div className="w-full overflow-y-hidden md:overflow-y-scroll overflow-x-scroll md:overflow-x-hidden flex md:flex-col bg-zinc-900 border border-zinc-800 rounded-2xl p-2 gap-2">
          <ServerSelector
            isSelected={server === 'one'}
            onClick={() => setServer('one')}
          >
            سێرڤەری یەک
          </ServerSelector>
          <ServerSelector
            isSelected={server === 'two'}
            onClick={() => setServer('two')}
          >
            سێرڤەری دوو
          </ServerSelector>
          <ServerSelector
            isSelected={server === 'three'}
            onClick={() => setServer('three')}
          >
            سێرڤەری سێ
          </ServerSelector>
          <ServerSelector
            isSelected={server === 'four'}
            onClick={() => setServer('four')}
          >
            سێرڤەری چوار
          </ServerSelector>
          <ServerSelector
            isSelected={server === 'five'}
            onClick={() => setServer('five')}
          >
            سێرڤەری پێنج
          </ServerSelector>
          <ServerSelector
            isSelected={server === 'six'}
            onClick={() => setServer('six')}
          >
            سێرڤەری شەش
          </ServerSelector>
          <ServerSelector
            isSelected={server === 'seven'}
            onClick={() => setServer('seven')}
          >
            سێرڤەری حەوت
          </ServerSelector>
          <ServerSelector
            isSelected={server === 'eight'}
            onClick={() => setServer('eight')}
          >
            سێرڤەری هەشت
          </ServerSelector>
        </div>
        <div className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2">
          <iframe
            id="player-frame"
            allow="encrypted-media; fullscreen *;"
            className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full h-auto aspect-video outline-0 ring-0 overflow-hidden"
            src={`/player.html?video_id=${data?.id}&server=${encodeURIComponent(server)}&type=movie`}
          ></iframe>
        </div>
      </section>
    </div>
  );
}

function ServerSelector({
  isSelected,
  onClick,
  children,
}: {
  isSelected: string | boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-w-max h-fit flex items-center justify-start p-2 px-4 rounded-xl font-bold ${isSelected ? 'bg-gold text-black' : 'bg-zinc-700 text-white'}`}
    >
      {children}
    </button>
  );
}

{
  /* 

          Request movie by IMDB id: https://yourwebsite.com/se_player.php?video_id=tt8385148
          Request movie by TMDB id: https://yourwebsite.com/se_player.php?video_id=522931&tmdb=1
          Request episode by IMDB id: https://yourwebsite.com/se_player.php?video_id=tt2861424&s=5&e=5
          Request episode by TMDB id: https://yourwebsite.com/se_player.php?video_id=60625&tmdb=1&s=5&e=5

          https://multiembed.mov/directstream.php?video_id=tt6791350&sub_url=SUBTITLES_URL&sub_label=SUBTITLES_LABEL


          ---
          
          
          https://vidcore.net/movie/1668364


          ---


          https://player.videasy.net/movie/1668364


          ---


          https://vaplayer.ru/embed/movie/980431
          ?
          sub_url=http://localhost:3000/subtitles/test.vtt
          &
          sub_label=Kurdish
          &
          sub_lang=ku
          &
          sub_default=true


          ---


          https://vsembed.ru/embed/movie
          ?
          tmdb=980431
          &amp;
          sub_url=http://localhost:3000/subtitles/test.vtt


          ---


          https://embedmaster.link/movie/980431
          ?
          sub_url[]=http://localhost:3000/subtitles/test.vtt
          &
          sub_label[]=Kurdish


          ---


          https://vidlink.pro/movie/980431
          ?
          sub_file=http://localhost:3000/subtitles/test.vtt
          
          
          */
}
