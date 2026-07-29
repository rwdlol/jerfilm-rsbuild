import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Reset menu state during render if location changed
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setIsMenuOpen(false);
  }

  return (
    <header className="relative z-50 w-full bg-zinc-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4">
        {/* Logo and Desktop Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-2xl text-white tracking-tight select-none"
          >
            JerFilm.<span className="text-gold">VIP</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/">ماڵەوە</NavLink>
            <NavLink to="/movie">فیلمەکان</NavLink>
            <NavLink to="/tv">زنجیرە</NavLink>
            <NavLink to="/person">ئەکتەرەکان</NavLink>
            <NavLink to="/about">دەربارەی ئێمە</NavLink>

            {/* <NavLink to="/collection">کۆکراوەکان</NavLink> */}
          </nav>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="md:hidden flex items-center justify-center p-2.5 text-zinc-300 hover:text-white rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'مێنۆ دابخە' : 'مێنۆ بکەرەوە'}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Smooth Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 w-full bg-zinc-950/90 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-1 p-4" dir="rtl">
            <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
              ماڵەوە
            </MobileNavLink>
            <MobileNavLink to="/movie" onClick={() => setIsMenuOpen(false)}>
              فیلمەکان
            </MobileNavLink>
            <MobileNavLink to="/tv" onClick={() => setIsMenuOpen(false)}>
              زنجیرەکان
            </MobileNavLink>
            <MobileNavLink to="/person" onClick={() => setIsMenuOpen(false)}>
              ئەکتەرەکان
            </MobileNavLink>
            <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)}>
              دەربارەی ئێمە
            </MobileNavLink>
            {/* <MobileNavLink to="/collection" onClick={() => setIsMenuOpen(false)}>کۆکراوەکان</MobileNavLink> */}
          </nav>
        </div>
      )}
    </header>
  );
}

// NavLink for Desktop Header
function NavLink({ children, to }: { children: React.ReactNode; to: string }) {
  return (
    <Link
      to={to}
      className="text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-zinc-900/40"
    >
      {children}
    </Link>
  );
}

// MobileNavLink
function MobileNavLink({
  children,
  to,
  onClick,
}: {
  children: React.ReactNode;
  to: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center text-start text-zinc-300 hover:text-white text-base w-full px-4 py-3 rounded-xl hover:bg-zinc-900/60 transition-colors duration-150"
    >
      {children}
    </Link>
  );
}
