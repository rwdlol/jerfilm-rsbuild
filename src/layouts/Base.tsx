import { Outlet } from 'react-router';
import Header from '../components/Header';

export default function BaseLayout() {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto h-full px-4">
      <Header />
      <main className="flex-1 flex flex-col w-full h-full">
        <Outlet />
      </main>
    </div>
  );
}
