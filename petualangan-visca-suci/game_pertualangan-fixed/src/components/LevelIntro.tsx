import ExplorerCharacter from './ExplorerCharacter'
import levelOneBanner from '../assets/level-1-banner.png'

type LevelIntroProps = {
  level: number
  completed: boolean
  onBack: () => void
  onStart: () => void
}

const worlds = [
  { title: 'Pulau Bentuk', goal: 'Kenali persegi, segitiga, persegi panjang, dan lingkaran.' },
  { title: 'Hutan Segi Empat', goal: 'Pelajari sisi, sudut, dan ciri bangun segi empat.' },
  { title: 'Pegunungan Segitiga', goal: 'Temukan jenis, sudut, dan luas segitiga.' },
  { title: 'Danau Lingkaran', goal: 'Gunakan jari-jari, diameter, keliling, dan luas.' },
  { title: 'Kastil Geometri', goal: 'Gabungkan pengetahuan bentuk, sudut, keliling, dan luas.' },
]

function LevelIntro({ level, completed, onBack, onStart }: LevelIntroProps) {
  const world = worlds[Math.floor((level - 1) / 6)]

  return (
    <section className="level-intro" aria-label={`Detail level ${level}`}>
      <header className="level-intro__header">
        <button className="level-intro__back" type="button" onClick={onBack} aria-label="Kembali ke peta">‹</button>
        <div className="level-intro__resources" aria-label="Skor level 0 bintang dan 0 koin">
          <span><b aria-hidden="true">★</b> 0</span>
          <i aria-hidden="true" />
          <span><b aria-hidden="true">🪙</b> 0</span>
        </div>
      </header>

      <div className="level-intro__title" aria-label={`Level ${level}, Gerbang ${world.title}`}>
        {level === 1 ? (
          <img src={levelOneBanner} alt={`Level 1 — Gerbang ${world.title}`} />
        ) : (
          <div className="level-intro__plaque">
            <strong>Level {level}</strong>
            <span>Gerbang {world.title}</span>
          </div>
        )}
      </div>

      <article className="level-intro__card">
        <h1>Tujuan:</h1>
        <p className="level-intro__goal">{world.goal}</p>
      </article>

      <div className="level-intro__stars" aria-label={completed ? 'Level pernah diselesaikan' : 'Tiga bintang tersedia'}>
        {Array.from({ length: 3 }, (_, index) => <span key={index}>★</span>)}
      </div>

      <div className="level-intro__facts">
        <span><b aria-hidden="true">◷</b> 3–5 menit</span>
        <span><b aria-hidden="true">◎</b> 5 tantangan</span>
      </div>

      <div className="level-intro__hero">
        <ExplorerCharacter />
      </div>

      <button className="level-intro__start" type="button" onClick={onStart}>
        Mulai
      </button>
    </section>
  )
}

export default LevelIntro
