import { Link } from 'react-router-dom'
import { DEMOS } from '@/demos'
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Three.js Demos</h1>
        <p className={styles.subtitle}>
          A collection of interactive 3D scenes built with Three.js, React and TypeScript.
        </p>
      </header>

      <main className={styles.grid}>
        {DEMOS.map((demo) => (
          <Link key={demo.id} to={demo.path} className={styles.card}>
            <div className={styles.cardPreview} />
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{demo.title}</h2>
              <p className={styles.cardDesc}>{demo.description}</p>
              <div className={styles.tags}>
                {demo.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  )
}
