import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-50 w-full h-fit flex">
      <div className="relative z-10 bg-zinc-950 flex items-center gap-4 w-full h-16">
        <h2 className="text-xl font-bold text-white">
          jerfilm<span className="text-gold">.vip</span>
        </h2>
        <nav className="hidden md:flex items-center w-fit h-fit">
          <NavLink to="/">ماڵەوە</NavLink>
          <NavLink to="/movie">فیلمەکان</NavLink>
          <NavLink to="/tv">زنجیرە</NavLink>
          <NavLink to="/person">ئەکتەرەکان</NavLink>
          <NavLink to="/collection">کۆکراوەکان</NavLink>
        </nav>
        <button
          className="ms-auto md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute z-0 left-0 right-0 top-16 w-full h-fit bg-zinc-950/70 backdrop-blur-2xl">
          <nav className="flex flex-col items-center w-full h-fit p-2">
            <NavLink to="/">ماڵەوە</NavLink>
            <NavLink to="/movie">فیلمەکان</NavLink>
            <NavLink to="/tv">زنجیرە</NavLink>
            <NavLink to="/person">ئەکتەرەکان</NavLink>
            <NavLink to="/collection">کۆکراوەکان</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ children, to }: { children: React.ReactNode; to: string }) {
  return (
    <Link
      to={to}
      className="w-full md:w-fit px-3 py-1.5 rounded-full hover:bg-zinc-800"
    >
      {children}
    </Link>
  );
}
