import { Crown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="relative z-50 w-full h-fit flex">
      <div className="relative z-10 bg-zinc-950 flex items-center gap-4 w-full h-16">
        <h2 className="text-xl font-bold text-white">
          JerFilm<span className="text-gold">.VIP</span>
        </h2>
        <nav className="hidden md:flex items-center w-fit h-fit">
          <NavLink to="/">ماڵەوە</NavLink>
          <NavLink to="/movie">فیلمەکان</NavLink>
          <NavLink to="/tv">زنجیرە</NavLink>
          <NavLink to="/person">ئەکتەرەکان</NavLink>
          <NavLink to="/collection">کۆکراوەکان</NavLink>
        </nav>
        <button
          type="button"
          aria-label="پلانی شاهانە"
          className="hidden ms-auto md:flex items-center justify-center gap-1 bg-gold text-transparent font-bold text-sm p-2 py-1 ring-1 outline-0 border-0 ring-offset-2 ring-offset-zinc-950 ring-gold rounded-full"
        >
          <Crown size={16} />
          <span>پلانی شاهانە</span>
        </button>
        <button
          type="button"
          className="ms-auto md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'مێنۆ دابخە' : 'مێنۆ بکەرەوە'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute z-0 left-0 right-0 top-16 w-full h-fit bg-white/10 backdrop-blur-2xl">
          <nav className="grid grid-cols-2 gap-4 items-center w-full h-fit p-2 py-4">
            <NavLink to="/" onClick={closeMenu}>
              ماڵەوە
            </NavLink>
            <NavLink to="/movie" onClick={closeMenu}>
              فیلمەکان
            </NavLink>
            <NavLink to="/tv" onClick={closeMenu}>
              زنجیرە
            </NavLink>
            <NavLink to="/person" onClick={closeMenu}>
              ئەکتەرەکان
            </NavLink>
            <NavLink to="/collection" onClick={closeMenu}>
              کۆکراوەکان
            </NavLink>
            <button
              type="button"
              aria-label="پلانی شاهانە"
              className="flex items-center justify-center gap-1 bg-gold text-zinc-900 font-bold p-2 py-1 ring-1 outline-0 border-0 ring-offset-2 ring-offset-zinc-950 ring-gold rounded-full"
            >
              <Crown size={18} />
              <span>پلانی شاهانە</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({
  children,
  to,
  onClick,
}: {
  children: React.ReactNode;
  to: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex text-center items-center justify-center w-full md:w-fit px-3 py-1.5 rounded-full hover:bg-white/05 backdrop-blur-2xl"
    >
      {children}
    </Link>
  );
}
