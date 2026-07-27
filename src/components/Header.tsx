import { Button } from './ui/Button';

export default function Header() {
  return (
    <header className="flex items-center gap-4 w-full h-fit py-2">
      <h2 className="text-lg font-bold text-white">
        jerfilm<span className="text-gold">.vip</span>
      </h2>
      <nav className="hidden md:flex items-center w-fit h-fit">
        <Button layout="text" type="link" link="/">
          Home
        </Button>
        <Button layout="text" type="link" link="/movie">
          Movies
        </Button>
        <Button layout="text" type="link" link="/tv">
          Series
        </Button>
        <Button layout="text" type="link" link="/person">
          People
        </Button>
        <Button layout="text" type="link" link="/collection">
          Collections
        </Button>
      </nav>
    </header>
  );
}
