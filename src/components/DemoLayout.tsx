import { Link } from 'react-router-dom';
import styles from './DemoLayout.module.css';

interface DemoLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function DemoLayout({ title, description, children }: DemoLayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.back}>
          ← Back
        </Link>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.desc}>{description}</p>}
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
