import { Link } from 'react-router';

function Button({
  type,
  children,
  link,
}: {
  layout: 'icon' | 'text' | 'icon-text' | 'icon-text-icon' | 'text-icon';
  type: 'button' | 'submit' | 'reset' | 'link';
  children: React.ReactNode;
  link?: string;
}) {
  if (type === 'link') {
    return (
      <Link to={link as string} className={styles.link}>
        {children}
      </Link>
    );
  } else {
    return (
      <button
        type={type as 'button' | 'submit' | 'reset'}
        className={styles.button}
      >
        {children}
      </button>
    );
  }
}

const styles = {
  button: 'px-4 py-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600',
  link: 'px-4 py-2 rounded-full text-yellow-500 hover:underline',
};

export { Button };
