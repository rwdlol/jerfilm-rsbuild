import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="relative z-40 h-fit min-h-16 w-full max-w-7xl mx-auto bg-zinc-950 flex items-center gap-4 px-4">
      <h2 className="relative z-10 text-xl font-bold text-white">
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
        className="relative z-10  ms-auto md:hidden text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? 'مێنۆ دابخە' : 'مێنۆ بکەرەوە'}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isMenuOpen && (
        <div className="md:hidden absolute z-0 right-0 top-0 left-0 pt-10 w-full h-fit bg-zinc-950/25 backdrop-blur-2xl">
          <nav className="grid grid-cols-2 gap-4 items-center w-full min-w-60 h-full p-2 py-4">
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
      className="flex text-start items-center justify-star w-full md:w-fit md:text-base text-xl md:p-1 md:px-2 px-4 py-2 rounded-xl hover:bg-white/15"
    >
      {children}
    </Link>
  );
}
