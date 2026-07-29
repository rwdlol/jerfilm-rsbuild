import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import BaseLayout from './layouts/Base';
import NotFound from './components/NotFound';
import LoadingScreen from './components/LoadingScreen';
import PersonDetail from './pages/PersonDetail';
import PersonPage from './pages/PersonPage';

// Lazy loaded page components
const Home = lazy(() => import('./pages/Home'));
const MoviePage = lazy(() => import('./pages/MoviePage'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const TVPage = lazy(() => import('./pages/TVPage'));
const TVDetail = lazy(() => import('./pages/TVDetail'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Home />
            </Suspense>
          }
        />

        <Route
          path="/movie"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <MoviePage />
            </Suspense>
          }
        />

        <Route
          path="/movie/:movieId"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <MovieDetail />
            </Suspense>
          }
        />

        <Route
          path="/tv"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <TVPage />
            </Suspense>
          }
        />

        <Route
          path="/tv/:tvId"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <TVDetail />
            </Suspense>
          }
        />

        <Route
          path="/person"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <PersonPage />
            </Suspense>
          }
        />

        <Route
          path="/person/:personId"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <PersonDetail />
            </Suspense>
          }
        />

        <Route path="/collection" element={<>collections</>} />
        <Route path="/collection/:id" element={<>collection details</>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
