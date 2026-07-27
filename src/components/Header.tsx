import { Button } from './ui/Button';

export default function Header() {
  return (
    <header className="flex items-center justify-between w-full h-fit py-2">
      <h2 className="text-lg font-bold text-white">
        jerfilm<span className="text-gold">.vip</span>
      </h2>

      <nav className="hidden md:flex items-center w-fit h-fit">
        <Button layout="text" type="link" link="#">
          Home
        </Button>
        <Button layout="text" type="link" link="#">
          Movies
        </Button>
        <Button layout="text" type="link" link="#">
          Series
        </Button>
        <Button layout="text" type="link" link="#">
          About
        </Button>
      </nav>

      <Button layout="icon-text" type="button">
        Search
      </Button>
    </header>
  );
}
