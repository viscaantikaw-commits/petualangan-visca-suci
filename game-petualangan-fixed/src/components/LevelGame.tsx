import { useState } from 'react'
import * as sound from '../components/sound'
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

// Soal khusus level 1–3 (sesuai PPT "Rancangan Pulau Bentuk"). Level lain memakai kumpulan soal di atas.
const levelQuestions: Record<number, Question[]> = {
  1: [
    { topic: 'Pulau Bentuk', symbol: '?', prompt: 'Manakah gambar yang berbentuk segitiga?', options: ['■', '▲', '●', '▬'], answer: '▲', explanation: 'Segitiga berbentuk seperti gunung dengan tiga sisi dan tiga sudut.' },
    { topic: 'Pulau Bentuk', symbol: '?', prompt: 'Bangun datar manakah yang berbentuk bulat?', options: ['Segitiga', 'Persegi', 'Lingkaran', 'Persegi panjang'], answer: 'Lingkaran', explanation: 'Lingkaran berbentuk bulat dan tidak memiliki sudut.' },
    { topic: 'Pulau Bentuk', symbol: '?', prompt: 'Pilih gambar yang merupakan persegi.', options: ['▲', '●', '■', '▬'], answer: '■', explanation: 'Persegi memiliki empat sisi yang sama panjang.' },
    { topic: 'Pulau Bentuk', symbol: '?', prompt: 'Bentuk apa yang memiliki tiga sisi?', options: ['Segitiga', 'Persegi', 'Lingkaran', 'Persegi panjang'], answer: 'Segitiga', explanation: 'Segitiga mempunyai tiga sisi dan tiga titik sudut.' },
    { topic: 'Pulau Bentuk', symbol: '?', prompt: 'Bangun datar apa yang memiliki empat sisi sama panjang?', options: ['Segitiga', 'Persegi', 'Lingkaran', 'Persegi panjang'], answer: 'Persegi', explanation: 'Keempat sisi persegi sama panjang.' },
  ],
  2: [
    { topic: 'Lembah Bentuk', symbol: '△', prompt: 'Berapa jumlah sisi pada segitiga?', options: ['2 sisi', '3 sisi', '4 sisi', '5 sisi'], answer: '3 sisi', explanation: 'Segitiga memiliki tiga sisi.' },
    { topic: 'Lembah Bentuk', symbol: '□', prompt: 'Berapa jumlah titik sudut pada persegi?', options: ['3 titik sudut', '4 titik sudut', '5 titik sudut', 'Tidak ada'], answer: '4 titik sudut', explanation: 'Persegi memiliki empat titik sudut.' },
    { topic: 'Lembah Bentuk', symbol: '○', prompt: 'Berapa jumlah titik sudut pada lingkaran?', options: ['1 titik sudut', '2 titik sudut', '4 titik sudut', 'Tidak ada'], answer: 'Tidak ada', explanation: 'Lingkaran berbentuk lengkung sehingga tidak memiliki titik sudut.' },
    { topic: 'Lembah Bentuk', symbol: '?', prompt: 'Bangun datar apa yang memiliki empat sisi?', options: ['Segitiga', 'Persegi', 'Lingkaran', 'Segi lima'], answer: 'Persegi', explanation: 'Persegi memiliki empat sisi dan empat titik sudut.' },
    { topic: 'Lembah Bentuk', symbol: '?', prompt: 'Bangun datar apa yang tidak memiliki titik sudut?', options: ['Segitiga', 'Persegi', 'Lingkaran', 'Persegi panjang'], answer: 'Lingkaran', explanation: 'Lingkaran tidak memiliki titik sudut karena sisinya melengkung.' },
  ],
  3: [
    { topic: 'Hutan Bentuk', symbol: '🕒', prompt: 'Jam dinding berbentuk bulat menyerupai bangun datar apa?', options: ['Segitiga', 'Persegi', 'Lingkaran', 'Persegi panjang'], answer: 'Lingkaran', explanation: 'Jam dinding yang bulat menyerupai lingkaran.' },
    { topic: 'Hutan Bentuk', symbol: '🏠', prompt: 'Atap rumah pada gambar menyerupai bentuk apa?', options: ['Segitiga', 'Persegi', 'Lingkaran', 'Persegi panjang'], answer: 'Segitiga', explanation: 'Atap rumah yang runcing menyerupai segitiga.' },
    { topic: 'Hutan Bentuk', symbol: '▦', prompt: 'Ubin dengan empat sisi sama panjang menyerupai apa?', options: ['Segitiga', 'Persegi', 'Lingkaran', 'Persegi panjang'], answer: 'Persegi', explanation: 'Ubin berbentuk persegi karena keempat sisinya sama panjang.' },
    { topic: 'Hutan Bentuk', symbol: '🚪', prompt: 'Pintu berbentuk persegi panjang memiliki berapa sisi?', options: ['2 sisi', '3 sisi', '4 sisi', '5 sisi'], answer: '4 sisi', explanation: 'Persegi panjang memiliki empat sisi.' },
    { topic: 'Hutan Bentuk', symbol: '🚲', prompt: 'Roda sepeda jika dilihat dari samping berbentuk apa?', options: ['Segitiga', 'Persegi', 'Lingkaran', 'Persegi panjang'], answer: 'Lingkaran', explanation: 'Roda sepeda dilihat dari samping berbentuk lingkaran.' },
  ],
}

const WALK_DURATION = 720
const JUMP_DURATION = 760
const obstacleIslandAssets = [obstacleIslandA, obstacleIslandB]

// Tahap 1: kumpulkan 3 bentuk target, lalu sampai ke bendera di atas. Tahap 2: jawab 5 soal.
const TARGETS = [
  { kind: 'triangle', label: 'Segitiga', left: 26, bottom: 26 },
  { kind: 'square', label: 'Persegi', left: 46, bottom: 44 },
  { kind: 'circle', label: 'Lingkaran', left: 63, bottom: 30 },
] as const
const GOAL = { left: 80, bottom: 62 }
// langkah 0 = titik awal, 1–3 = target, 4 = bendera
const heroPositions = [9, ...TARGETS.map((target) => target.left), 74]
const heroHeights = [12, ...TARGETS.map((target) => target.bottom), GOAL.bottom]

function LevelGame({ level, completed, onBack, onComplete }: LevelGameProps) {
  // Level 1–3 (Pulau Bentuk) punya soal sendiri; mulai level 4 memakai kumpulan soal per pulau (6 soal per pulau).
  const firstQuestion = Math.max(0, level - 4)
  const topicStart = Math.floor(firstQuestion / 6) * 6
  const offset = firstQuestion - topicStart
  const challenges = levelQuestions[level] ?? Array.from({ length: 5 }, (_, index) => questions[topicStart + ((offset + index) % 6)])
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [heroStep, setHeroStep] = useState(0)
  const [collected, setCollected] = useState(0)
  const [atFlag, setAtFlag] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | ''>('')
  const [mistakes, setMistakes] = useState(0)
  const [score, setScore] = useState(0)
  const [jumping, setJumping] = useState(false)
  const [walking, setWalking] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [paused, setPaused] = useState(false)
  const [finished, setFinished] = useState(false)
  const [volume, setVolumeState] = useState(() => Math.round(sound.getVolume() * 100))
  const [muted, setMutedState] = useState(() => sound.isMuted())
  const [volumeOpen, setVolumeOpen] = useState(false)
  const question = challenges[challengeIndex]
  const targetCount = TARGETS.length
  const progressDone = atFlag ? challengeIndex : collected
  const progressTotal = atFlag ? challenges.length : targetCount
  const questionProgress = Math.round((progressDone / progressTotal) * 100)
  const earnedStars = Math.min(3, Math.ceil(score / 200))

  function changeVolume(value: number) {
    setVolumeState(value)
    setMutedState(false)
    sound.setVolume(value / 100)
  }

  function toggleMute() {
    const next = !muted
    setMutedState(next)
    sound.setMuted(next)
    if (!next) sound.playPreview()
  }

  const volumeIcon = muted || volume === 0 ? '🔇' : volume < 40 ? '🔈' : volume < 75 ? '🔉' : '🔊'

  function moveRight() {
    if (paused || finished || atFlag || walking) return
    const nextStep = Math.min(targetCount + 1, heroStep + 1)
    if (nextStep === heroStep) return
    setDirection('right')
    setWalking(true)
    setHeroStep(nextStep)
    sound.playWalk()
    window.setTimeout(() => {
      setWalking(false)
      if (nextStep <= targetCount) {
        setCollected((count) => Math.max(count, nextStep))
        sound.playCollect()
      } else {
        setAtFlag(true)
        sound.playFlag()
      }
    }, WALK_DURATION)
  }

  function moveLeft() {
    if (paused || finished || atFlag || walking || heroStep === 0) return
    setDirection('left')
    setWalking(true)
    setHeroStep(heroStep - 1)
    sound.playWalk()
    window.setTimeout(() => setWalking(false), WALK_DURATION)
  }

  function jump() {
    if (paused || finished || jumping || walking || atFlag) return
    setJumping(true)
    window.setTimeout(() => setJumping(false), JUMP_DURATION)
    sound.playJump()
    moveRight()
  }

  function answer(option: string) {
    if (!atFlag || feedback === 'correct') return
    setSelected(option)
    if (option !== question.answer) {
      setMistakes((count) => count + 1)
      setFeedback('wrong')
      sound.playWrong()
      return
    }

    setScore((current) => current + 100)
    setFeedback('correct')
    sound.playCorrect()
    window.setTimeout(() => {
      if (challengeIndex === challenges.length - 1) {
        setFinished(true)
        sound.playComplete()
        return
      }
      setChallengeIndex(challengeIndex + 1)
      setSelected(null)
      setFeedback('')
    }, 700)
  }

  function restart() {
    setChallengeIndex(0)
    setHeroStep(0)
    setCollected(0)
    setAtFlag(false)
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
        <div className="level-game__hud-left">
          <button className="level-game__pause" onClick={() => setPaused(true)} type="button" aria-label="Jeda permainan">Ⅱ</button>
          <button className="level-game__sound" onClick={() => setVolumeOpen((open) => !open)} type="button" aria-label="Atur suara" aria-expanded={volumeOpen}>{volumeIcon}</button>
        </div>
        <div className="level-game__hud-center"><span>⭐ {Math.floor(score / 100)}</span><strong>Level {level}</strong></div>
        <div className="level-game__hud-right">
          <span className="level-game__coins">🪙 {12 + Math.floor(score / 100)}</span>
          <div className="level-game__stars" aria-label={`${earnedStars} dari 3 bintang`}>
            {Array.from({ length: 3 }, (_, index) => <span className={index < earnedStars ? 'is-earned' : ''} key={index}>★</span>)}
          </div>
        </div>
      </header>
      <div className="level-game__progress-row" aria-label={atFlag ? `Progres soal ${progressDone} dari ${progressTotal}` : `Bentuk terkumpul ${progressDone} dari ${progressTotal}`}>
        <div className="level-game__progress"><i style={{ width: `${questionProgress}%` }} /></div>
        <strong>{progressDone}/{progressTotal}</strong>
      </div>

      {volumeOpen && (
        <div className="level-game__volume-panel" role="group" aria-label="Pengaturan suara">
          <button className="level-game__volume-mute" onClick={toggleMute} type="button" aria-label={muted ? 'Nyalakan suara' : 'Bisukan suara'}>{volumeIcon}</button>
          <input
            aria-label="Volume"
            max={100}
            min={0}
            onChange={(event) => changeVolume(Number(event.target.value))}
            onKeyUp={sound.playPreview}
            onPointerUp={sound.playPreview}
            step={5}
            type="range"
            value={muted ? 0 : volume}
          />
          <b>{muted ? 0 : volume}%</b>
        </div>
      )}

      <div className="level-game__scene">
        <div className="level-game__scene-sky" aria-hidden="true" />
        <div className="level-game__route" aria-hidden="true">
          <svg className="level-game__route-path" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 9 88 Q 17 82 26 74 Q 36 68 46 56 Q 55 64 63 70 Q 73 62 80 38" />
          </svg>
          <div className="level-game__course-coins" aria-hidden="true">
            {[[17, 20], [36, 36], [55, 41], [70, 46], [76, 55]].map(([left, bottom], index) => (
              <i key={index} style={{ left: `${left}%`, bottom: `${bottom}%` }}>🪙</i>
            ))}
          </div>
          <div className="level-game__course-obstacles">
            {TARGETS.map((target, index) => (
              <div
                className={`level-game__obstacle is-platform-${index + 1}${collected > index ? ' is-cleared' : ''}${heroStep === index + 1 ? ' is-active' : ''}`}
                key={target.kind}
                style={{ left: `${target.left}%`, bottom: `${target.bottom}%` }}
              >
                <img className="level-game__obstacle-island" src={obstacleIslandAssets[index % obstacleIslandAssets.length]} alt="" aria-hidden="true" />
                <span className={`level-game__target is-${target.kind}${collected > index ? ' is-collected' : ''}`} role="img" aria-label={`${target.label}${collected > index ? ' sudah terkumpul' : ''}`}><i /></span>
                <small>{index + 1}</small>
              </div>
            ))}
            <div className={`level-game__obstacle level-game__goal is-platform-5${collected === targetCount ? ' is-open' : ''}`} style={{ left: `${GOAL.left}%`, bottom: `${GOAL.bottom}%` }}>
              <img className="level-game__obstacle-island" src={obstacleIslandA} alt="" aria-hidden="true" />
            </div>
          </div>
          <span className={`level-game__course-flag${collected === targetCount ? ' is-open' : ' is-locked'}`} style={{ left: '88%', bottom: `${GOAL.bottom + 7}%` }} role="img" aria-label="Bendera tujuan"><i /><b /></span>
        </div>
        <div
          className={`level-game__hero${jumping ? ' is-jumping' : ''}${walking ? ' is-walking' : ''}`}
          style={{ left: `${heroPositions[heroStep]}%`, bottom: `${heroHeights[heroStep]}%` }}
        >
          <HeroSprite direction={direction} walking={walking} jumping={jumping} />
        </div>

        {!atFlag ? (
          <div className="level-game__collection-card" role="status">
            <strong>Kumpulkan bentuk &amp; capai bendera!</strong>
            <div className="level-game__collection-progress">
              {TARGETS.map((target, index) => (
                <span className={`is-${target.kind}${collected > index ? ' is-got' : ''}`} key={target.kind} aria-label={target.label}>{target.kind === 'triangle' ? '△' : target.kind === 'square' ? '□' : '●'}</span>
              ))}
              <b>{collected}/{targetCount}</b>
            </div>
          </div>
        ) : (
          <article className="level-game__question-card">
            <div className="level-game__question-meta"><span>Soal {challengeIndex + 1} / {challenges.length}</span><span>{question.topic}</span></div>
            <div className="level-game__question-main">
              <div className="level-game__question-art" aria-hidden="true">
                <span>{question.symbol}</span>
              </div>
              <h1>{question.prompt}</h1>
            </div>
            <div className="level-game__answers">
              {question.options.map((option, optionIndex) => {
                const chosen = selected === option
                const right = feedback === 'correct' && option === question.answer
                return (
                  <button
                    className={`level-game__answer is-choice-${optionIndex}${option.length <= 2 ? ' is-glyph' : ''}${chosen && feedback === 'wrong' ? ' is-wrong' : ''}${right ? ' is-correct' : ''}`}
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
            <div className="level-game__feedback-slot">
              {feedback === 'correct' && <div className="level-game__feedback is-correct" role="status"><strong>Benar! Lanjut ke soal berikutnya.</strong><span>{question.explanation}</span></div>}
              {feedback === 'wrong' && <div className="level-game__feedback is-wrong" role="status"><strong>Belum tepat. Ayo coba lagi!</strong><button onClick={() => { setSelected(null); setFeedback('') }} type="button">Coba lagi</button></div>}
            </div>
          </article>
        )}
      </div>

      {/* Tombol panah hanya dipakai saat menuju target; saat mengerjakan soal disembunyikan agar rapi. */}
      {!atFlag && (
        <nav className="level-game__controls" aria-label="Kontrol hero">
          <button onClick={moveLeft} type="button" aria-label="Mundur ke titik sebelumnya" disabled={atFlag || walking || heroStep === 0}>←</button>
          <button onClick={moveRight} type="button" aria-label={atFlag ? 'Hero sudah di bendera' : 'Maju ke target berikutnya'} disabled={atFlag || walking}>→</button>
          <button onClick={jump} type="button" aria-label="Lompat ke target berikutnya" disabled={jumping || walking || atFlag}>↑</button>
        </nav>
      )}

      {paused && <div className="level-game__pause-overlay"><div><span>Ⅱ</span><h2>Permainan dijeda</h2><button onClick={() => setPaused(false)} type="button">Lanjut bermain</button><button className="level-game__pause-exit" onClick={onBack} type="button">Kembali ke detail level</button></div></div>}
    </section>
  )
}

export default LevelGame