import { Outlet } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function BaseLayout() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header />
      <main className="relative z-0 flex-1 flex flex-col w-full max-w-7xl mx-auto px-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
