import { useState } from 'react'
import ExplorerCharacter from './ExplorerCharacter'
import HeroSprite from './HeroSprite'
import obstacleIslandA from '../assets/obstacle-platform-wide.png'
import obstacleIslandB from '../assets/obstacle-platform-small.png'

type Question = {
  topic: string
  symbol: string
  prompt: string
  options: string[]
  answer: string
  explanation: string
}

type LevelGameProps = {
  level: number
  completed: boolean
  onBack: () => void
  onComplete: (level: number) => void
}

const questions: Question[] = [
  { topic: 'Pulau Bentuk', symbol: '□', prompt: 'Berapa banyak sisi yang dimiliki persegi?', options: ['3 sisi', '4 sisi', '5 sisi', '6 sisi'], answer: '4 sisi', explanation: 'Persegi mempunyai empat sisi yang sama panjang.' },
  { topic: 'Pulau Bentuk', symbol: '△', prompt: 'Bangun datar apa yang mempunyai tiga sisi?', options: ['Lingkaran', 'Persegi', 'Segitiga', 'Persegi panjang'], answer: 'Segitiga', explanation: 'Segitiga selalu mempunyai tiga sisi dan tiga sudut.' },
  { topic: 'Pulau Bentuk', symbol: '○', prompt: 'Apa yang benar tentang lingkaran?', options: ['Memiliki 3 sudut', 'Memiliki 4 sisi', 'Tidak memiliki sudut', 'Memiliki 5 sisi'], answer: 'Tidak memiliki sudut', explanation: 'Lingkaran berbentuk lengkung dan tidak memiliki titik sudut.' },
  { topic: 'Pulau Bentuk', symbol: '▭', prompt: 'Persegi panjang memiliki ... pasang sisi berhadapan yang sama panjang.', options: ['1', '2', '3', '4'], answer: '2', explanation: 'Kedua pasang sisi yang berhadapan pada persegi panjang sama panjang.' },
  { topic: 'Pulau Bentuk', symbol: '◇', prompt: 'Ciri utama persegi adalah ...', options: ['Semua sisinya sama panjang', 'Tidak punya sudut', 'Hanya punya 3 sisi', 'Sisinya melengkung'], answer: 'Semua sisinya sama panjang', explanation: 'Keempat sisi persegi sama panjang dan semua sudutnya siku-siku.' },
  { topic: 'Pulau Bentuk', symbol: '△', prompt: 'Jumlah besar sudut dalam sebuah segitiga adalah ...', options: ['90°', '180°', '270°', '360°'], answer: '180°', explanation: 'Jika dijumlahkan, tiga sudut dalam segitiga selalu 180°.' },
  { topic: 'Hutan Segi Empat', symbol: '▱', prompt: 'Bangun segi empat memiliki berapa sisi?', options: ['3', '4', '5', '6'], answer: '4', explanation: 'Segi empat adalah bangun datar yang mempunyai empat sisi.' },
  { topic: 'Hutan Segi Empat', symbol: '▱', prompt: 'Pada jajar genjang, sisi yang berhadapan selalu ...', options: ['Melengkung', 'Sejajar', 'Tegak lurus', 'Berbeda panjang'], answer: 'Sejajar', explanation: 'Jajar genjang memiliki dua pasang sisi berhadapan yang sejajar.' },
  { topic: 'Hutan Segi Empat', symbol: '◇', prompt: 'Belah ketupat memiliki ...', options: ['Empat sisi sama panjang', 'Tiga sisi sama panjang', 'Satu sisi lengkung', 'Lima sudut'], answer: 'Empat sisi sama panjang', explanation: 'Keempat sisi belah ketupat memiliki panjang yang sama.' },
  { topic: 'Hutan Segi Empat', symbol: '⏢', prompt: 'Trapesium memiliki paling sedikit ... pasang sisi sejajar.', options: ['Tidak ada', 'Satu', 'Dua', 'Tiga'], answer: 'Satu', explanation: 'Trapesium memiliki satu pasang sisi sejajar.' },
  { topic: 'Hutan Segi Empat', symbol: '▭', prompt: 'Persegi panjang berukuran 8 cm × 4 cm. Berapa kelilingnya?', options: ['12 cm', '24 cm', '32 cm', '48 cm'], answer: '24 cm', explanation: 'Keliling = 2 × (8 + 4) = 24 cm.' },
  { topic: 'Hutan Segi Empat', symbol: '□', prompt: 'Persegi memiliki sisi 5 cm. Berapa kelilingnya?', options: ['10 cm', '15 cm', '20 cm', '25 cm'], answer: '20 cm', explanation: 'Keliling persegi = 4 × sisi = 4 × 5 = 20 cm.' },
  { topic: 'Pegunungan Segitiga', symbol: '△', prompt: 'Setiap sudut pada segitiga sama sisi besarnya ...', options: ['30°', '45°', '60°', '90°'], answer: '60°', explanation: 'Tiga sudut sama besar dan jumlahnya 180°, jadi setiap sudut 60°.' },
  { topic: 'Pegunungan Segitiga', symbol: '△', prompt: 'Segitiga sama kaki memiliki ...', options: ['Dua sisi sama panjang', 'Tiga sudut siku-siku', 'Empat sisi', 'Satu sisi lengkung'], answer: 'Dua sisi sama panjang', explanation: 'Segitiga sama kaki memiliki sepasang sisi yang sama panjang.' },
  { topic: 'Pegunungan Segitiga', symbol: '◿', prompt: 'Segitiga siku-siku selalu memiliki satu sudut sebesar ...', options: ['45°', '60°', '90°', '180°'], answer: '90°', explanation: 'Sudut siku-siku besarnya tepat 90°.' },
  { topic: 'Pegunungan Segitiga', symbol: '△', prompt: 'Segitiga memiliki alas 6 cm dan tinggi 4 cm. Berapa luasnya?', options: ['10 cm²', '12 cm²', '20 cm²', '24 cm²'], answer: '12 cm²', explanation: 'Luas segitiga = ½ × alas × tinggi = ½ × 6 × 4 = 12 cm².' },
  { topic: 'Pegunungan Segitiga', symbol: '▭', prompt: 'Berapa luas persegi panjang dengan panjang 8 cm dan lebar 5 cm?', options: ['13 cm²', '26 cm²', '40 cm²', '80 cm²'], answer: '40 cm²', explanation: 'Luas persegi panjang = panjang × lebar = 8 × 5 = 40 cm².' },
  { topic: 'Pegunungan Segitiga', symbol: '□', prompt: 'Sisi persegi 6 cm. Berapa luasnya?', options: ['12 cm²', '24 cm²', '30 cm²', '36 cm²'], answer: '36 cm²', explanation: 'Luas persegi = sisi × sisi = 6 × 6 = 36 cm².' },
  { topic: 'Danau Lingkaran', symbol: '○', prompt: 'Jari-jari lingkaran 7 cm. Berapa diameternya?', options: ['3,5 cm', '7 cm', '14 cm', '21 cm'], answer: '14 cm', explanation: 'Diameter = 2 × jari-jari = 2 × 7 = 14 cm.' },
  { topic: 'Danau Lingkaran', symbol: '◉', prompt: 'Diameter sebuah lingkaran 12 cm. Jari-jarinya adalah ...', options: ['3 cm', '6 cm', '12 cm', '24 cm'], answer: '6 cm', explanation: 'Jari-jari adalah setengah diameter, jadi 12 ÷ 2 = 6 cm.' },
  { topic: 'Danau Lingkaran', symbol: '○', prompt: 'Rumus luas lingkaran adalah ...', options: ['π × r', '2 × π × r', 'π × r × r', '4 × sisi'], answer: 'π × r × r', explanation: 'Luas lingkaran dihitung dengan rumus π × jari-jari × jari-jari.' },
  { topic: 'Danau Lingkaran', symbol: '◉', prompt: 'Keliling lingkaran dengan jari-jari 7 cm adalah ... (π = 22/7)', options: ['22 cm', '44 cm', '77 cm', '154 cm'], answer: '44 cm', explanation: 'Keliling = 2 × π × r = 2 × 22/7 × 7 = 44 cm.' },
  { topic: 'Danau Lingkaran', symbol: '⬡', prompt: 'Bangun beraturan memiliki ...', options: ['Sisi dan sudut yang sama besar', 'Hanya sisi lengkung', 'Tiga sisi saja', 'Tidak memiliki sudut'], answer: 'Sisi dan sudut yang sama besar', explanation: 'Pada bangun beraturan, semua sisi dan semua sudutnya sama.' },
  { topic: 'Danau Lingkaran', symbol: '▱', prompt: 'Cara mencari keliling bangun datar adalah ...', options: ['Menjumlahkan panjang semua sisi', 'Mengalikan semua sudut', 'Membagi luas dengan sisi', 'Menghitung jumlah warna'], answer: 'Menjumlahkan panjang semua sisi', explanation: 'Keliling adalah total panjang seluruh sisi di sekeliling bangun.' },
  { topic: 'Kastil Geometri', symbol: '⬠', prompt: 'Bangun datar yang memiliki lima sisi disebut ...', options: ['Segitiga', 'Segi empat', 'Segi lima', 'Segi enam'], answer: 'Segi lima', explanation: 'Awalan penta berarti lima; segi lima memiliki lima sisi.' },
  { topic: 'Kastil Geometri', symbol: '◇', prompt: 'Jumlah sudut dalam segi empat adalah ...', options: ['180°', '270°', '360°', '540°'], answer: '360°', explanation: 'Jumlah keempat sudut dalam semua segi empat adalah 360°.' },
  { topic: 'Kastil Geometri', symbol: '⬡', prompt: 'Berapa banyak sisi yang dimiliki segi enam?', options: ['5 sisi', '6 sisi', '7 sisi', '8 sisi'], answer: '6 sisi', explanation: 'Segi enam memiliki enam sisi dan enam titik sudut.' },
  { topic: 'Kastil Geometri', symbol: '∠', prompt: 'Sudut lancip besarnya ...', options: ['Kurang dari 90°', 'Tepat 90°', 'Lebih dari 90°', 'Tepat 180°'], answer: 'Kurang dari 90°', explanation: 'Sudut lancip lebih kecil dari sudut siku-siku (90°).' },
  { topic: 'Kastil Geometri', symbol: '▭', prompt: 'Persegi panjang panjangnya 12 cm dan lebarnya 7 cm. Kelilingnya ...', options: ['19 cm', '26 cm', '38 cm', '84 cm'], answer: '38 cm', explanation: 'Keliling = 2 × (12 + 7) = 38 cm.' },
  { topic: 'Kastil Geometri', symbol: '△', prompt: 'Sebuah segitiga memiliki sisi 5 cm, 6 cm, dan 7 cm. Kelilingnya ...', options: ['11 cm', '18 cm', '30 cm', '42 cm'], answer: '18 cm', explanation: 'Keliling segitiga = 5 + 6 + 7 = 18 cm.' },
]

const WALK_DURATION = 720
const JUMP_DURATION = 760
const obstacleIslandAssets = [obstacleIslandA, obstacleIslandB]

function LevelGame({ level, completed, onBack, onComplete }: LevelGameProps) {
  const firstQuestion = level - 1
  const topicStart = Math.floor(firstQuestion / 6) * 6
  const offset = firstQuestion - topicStart
  const challenges = Array.from({ length: 5 }, (_, index) => questions[topicStart + ((offset + index) % 6)])
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [heroStep, setHeroStep] = useState(0)
  const [atObstacle, setAtObstacle] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | ''>('')
  const [mistakes, setMistakes] = useState(0)
  const [score, setScore] = useState(0)
  const [jumping, setJumping] = useState(false)
  const [walking, setWalking] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [paused, setPaused] = useState(false)
  const [finished, setFinished] = useState(false)
  const question = challenges[challengeIndex]
  const progressCount = atObstacle ? challengeIndex + 1 : challengeIndex
  const questionProgress = Math.round((progressCount / challenges.length) * 100)
  const obstaclePositions = [[18, 18], [36, 44], [55, 24], [73, 51], [84, 33]]
  const heroPositions = [8, 18, 36, 55, 73, 84]
  const heroHeights = [12, 18, 44, 24, 51, 33]
  const earnedStars = Math.min(3, Math.ceil(score / 200))

  function moveRight() {
    if (paused || finished || feedback === 'correct' || atObstacle || walking) return
    const nextStep = Math.min(challengeIndex + 1, heroStep + 1)
    if (nextStep === heroStep) return
    const reachesObstacle = nextStep === challengeIndex + 1
    setDirection('right')
    setWalking(true)
    setHeroStep(nextStep)
    setAtObstacle(false)
    setSelected(null)
    setFeedback('')
    window.setTimeout(() => {
      setWalking(false)
      if (reachesObstacle) setAtObstacle(true)
    }, WALK_DURATION)
  }

  function moveLeft() {
    if (paused || finished || feedback === 'correct' || walking) return
    const nextStep = atObstacle ? challengeIndex : Math.max(0, heroStep - 1)
    setDirection('left')
    setWalking(true)
    setHeroStep(nextStep)
    setAtObstacle(false)
    setSelected(null)
    setFeedback('')
    window.setTimeout(() => setWalking(false), WALK_DURATION)
  }

  function jump() {
    if (paused || finished || jumping || walking || feedback === 'correct') return
    setJumping(true)
    window.setTimeout(() => setJumping(false), JUMP_DURATION)
    if (!atObstacle) moveRight()
  }

  function answer(option: string) {
    if (!atObstacle || feedback === 'correct') return
    setSelected(option)
    if (option !== question.answer) {
      setMistakes((count) => count + 1)
      setFeedback('wrong')
      return
    }

    setScore((current) => current + 100)
    setFeedback('correct')
    window.setTimeout(() => {
      if (challengeIndex === challenges.length - 1) {
        setFinished(true)
        return
      }
      const nextIndex = challengeIndex + 1
      setChallengeIndex(nextIndex)
      setHeroStep(nextIndex)
      setAtObstacle(false)
      setSelected(null)
      setFeedback('')
    }, 700)
  }

  function restart() {
    setChallengeIndex(0)
    setHeroStep(0)
    setAtObstacle(false)
    setSelected(null)
    setFeedback('')
    setMistakes(0)
    setScore(0)
    setWalking(false)
    setJumping(false)
    setDirection('right')
    setFinished(false)
    setPaused(false)
  }

  if (finished) {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1
    return (
      <section className="level-game level-game--result" aria-label={`Hasil level ${level}`}>
        <div className="level-game__result-card">
          <div className="level-game__result-stars" aria-label={`${stars} bintang`}>{Array.from({ length: 3 }, (_, index) => <span key={index}>{index < stars ? '★' : '☆'}</span>)}</div>
          <div className="level-game__result-banner">Level Selesai!</div>
          <ExplorerCharacter />
          <div className="level-game__result-stats">
            <p><span>⭐ Skor</span><strong>{score}</strong></p>
            <p><span>🪙 Koin</span><strong>{score + 60}</strong></p>
            <p><span>✨ XP</span><strong>+100</strong></p>
            <p><span>✅ Jawaban</span><strong>5 benar / 5</strong></p>
          </div>
          <button className="level-game__continue" onClick={() => onComplete(level)} type="button">
            {completed ? 'Kembali ke Peta' : 'Lanjutkan'} <span>→</span>
          </button>
          <button className="level-game__retry-level" onClick={restart} type="button">↻ &nbsp;Ulangi level</button>
        </div>
      </section>
    )
  }

  return (
    <section className="level-game level-game--adventure" aria-label={`Petualangan level ${level}`}>
      <header className="level-game__hud">
        <button className="level-game__pause" onClick={() => setPaused(true)} type="button" aria-label="Jeda permainan">Ⅱ</button>
        <div className="level-game__hud-center"><span>⭐ {Math.floor(score / 100)}</span><strong>Level {level}</strong></div>
        <div className="level-game__hud-right">
          <span className="level-game__coins">🪙 {12 + Math.floor(score / 100)}</span>
          <div className="level-game__stars" aria-label={`${earnedStars} dari 3 bintang`}>
            {Array.from({ length: 3 }, (_, index) => <span className={index < earnedStars ? 'is-earned' : ''} key={index}>★</span>)}
          </div>
        </div>
      </header>
      <div className="level-game__progress-row" aria-label={`Progres tantangan ${progressCount} dari ${challenges.length}`}>
        <div className="level-game__progress"><i style={{ width: `${questionProgress}%` }} /></div>
        <strong>{progressCount}/{challenges.length}</strong>
      </div>

      <div className="level-game__scene">
        <div className="level-game__scene-sky" aria-hidden="true" />
        <div className="level-game__route" aria-hidden="true">
          <svg className="level-game__route-path" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 18 82 Q 27 70 36 56 Q 46 58 55 76 Q 64 63 73 49 Q 79 48 84 67" />
          </svg>
          <div className="level-game__course-coins" aria-hidden="true">
            {[[27, 31], [31, 40], [39, 48], [47, 45], [63, 39], [78, 57]].map(([left, bottom], index) => (
              <i key={index} style={{ left: `${left}%`, bottom: `${bottom}%` }}>🪙</i>
            ))}
          </div>
          <span className="level-game__course-flag" style={{ left: '88%', bottom: '43%' }} aria-hidden="true"><i /><b /></span>
          <div className="level-game__course-obstacles">
          {challenges.map((challenge, index) => (
            <div
              className={`level-game__obstacle is-platform-${index + 1}${index < challengeIndex ? ' is-cleared' : ''}${index === challengeIndex && atObstacle ? ' is-active' : ''}`}
              key={`${challenge.prompt}-${index}`}
              style={{ left: `${obstaclePositions[index][0]}%`, bottom: `${obstaclePositions[index][1]}%` }}
            >
              <img className="level-game__obstacle-island" src={obstacleIslandAssets[index % obstacleIslandAssets.length]} alt="" aria-hidden="true" />
              <span className="level-game__obstacle-shape">{index < challengeIndex ? '✓' : challenge.symbol}</span>
              {[1, 3].includes(index) && <b className="level-game__obstacle-coin" aria-hidden="true">🪙</b>}
              <small>{index + 1}</small>
            </div>
          ))}
          </div>
        </div>
        <div
          className={`level-game__hero${jumping ? ' is-jumping' : ''}${walking ? ' is-walking' : ''}`}
          style={{ left: `${heroPositions[Math.min(heroStep, 5)]}%`, bottom: `${heroHeights[Math.min(heroStep, 5)]}%` }}
        >
          <HeroSprite direction={direction} walking={walking} jumping={jumping} />
        </div>

        {!atObstacle ? (
          <div className="level-game__collection-card" role="status">
            <strong>Kumpulkan semua bentuk!</strong>
            <div className="level-game__collection-progress">
              <span className="is-triangle">△</span><span className="is-square">□</span><span className="is-circle">●</span>
              <b>{challengeIndex}/{challenges.length}</b>
            </div>
            <small>Tekan → untuk maju atau ↑ untuk melompat</small>
          </div>
        ) : (
          <article className="level-game__question-card">
            <div className="level-game__question-meta"><span>Rintangan {challengeIndex + 1} / 5</span><span>{question.topic}</span></div>
            <h1>{question.prompt}</h1>
            <div className="level-game__question-art" aria-hidden="true">
              <span>{question.symbol}</span>
            </div>
            <div className="level-game__answers">
              {question.options.map((option, optionIndex) => {
                const chosen = selected === option
                const right = feedback === 'correct' && option === question.answer
                return (
                  <button
                    className={`level-game__answer is-choice-${optionIndex}${chosen && feedback === 'wrong' ? ' is-wrong' : ''}${right ? ' is-correct' : ''}`}
                    disabled={feedback === 'correct' || feedback === 'wrong'}
                    key={option}
                    onClick={() => answer(option)}
                    type="button"
                  >
                    <span className="level-game__answer-dot">{right ? '✓' : chosen && feedback === 'wrong' ? '×' : ''}</span>{option}
                  </button>
                )
              })}
            </div>
            {feedback === 'correct' && <div className="level-game__feedback is-correct" role="status"><strong>Benar! Jalan ke rintangan berikutnya terbuka.</strong><span>{question.explanation}</span></div>}
            {feedback === 'wrong' && <div className="level-game__feedback is-wrong" role="status"><strong>Belum tepat. Coba lagi di rintangan ini.</strong><button onClick={() => { setSelected(null); setFeedback('') }} type="button">Coba lagi</button></div>}
          </article>
        )}
      </div>

      <nav className="level-game__controls" aria-label="Kontrol hero">
        <button onClick={moveLeft} type="button" aria-label="Mundur ke titik aman">←</button>
        <button onClick={moveRight} type="button" aria-label={atObstacle ? 'Hero berada di rintangan' : 'Maju ke rintangan berikutnya'} disabled={atObstacle || walking}>→</button>
        <button onClick={jump} type="button" aria-label="Lompat ke rintangan" disabled={jumping || walking}>↑</button>
      </nav>

      {paused && <div className="level-game__pause-overlay"><div><span>Ⅱ</span><h2>Permainan dijeda</h2><button onClick={() => setPaused(false)} type="button">Lanjut bermain</button><button className="level-game__pause-exit" onClick={onBack} type="button">Kembali ke detail level</button></div></div>}
    </section>
  )
}

export default LevelGame

