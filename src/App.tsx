import { useState } from 'react'
import './App.css'
import AdventureMap from './components/AdventureMap'
import AdventureScene from './components/AdventureScene'
import BottomNavigation, { type NavigationItem } from './components/BottomNavigation'
import GameHeader from './components/GameHeader'
import LevelGame from './components/LevelGame'
import LevelIntro from './components/LevelIntro'
import OtherScreens from './components/OtherScreens'

type SavedProgress = { unlockedLevel: number; completedLevels: number[]; stars: number }
const progressKey = 'petualangan-bangun-datar-progress'

function readProgress(): SavedProgress {
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey) ?? 'null') as Partial<SavedProgress> | null
    if (saved && Array.isArray(saved.completedLevels)) {
      const completedLevels = [...new Set(saved.completedLevels.filter((level) => Number.isInteger(level) && level >= 1 && level <= 30))]
      return {
        unlockedLevel: Math.min(30, Math.max(1, Number(saved.unlockedLevel) || 1)),
        completedLevels,
        stars: Math.max(0, Number(saved.stars) || completedLevels.length),
      }
    }
  } catch {
    // Mulai dari progres baru jika data tersimpan tidak dapat dibaca.
  }
  return { unlockedLevel: 1, completedLevels: [], stars: 0 }
}

function App() {
  const [activeTab, setActiveTab] = useState<NavigationItem>('Beranda')
  const [progress, setProgress] = useState<SavedProgress>(readProgress)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [notice, setNotice] = useState('')

  function chooseLevel(level: number) {
    if (level > progress.unlockedLevel) {
      setNotice(`Selesaikan level ${progress.unlockedLevel} terlebih dahulu untuk membuka level ${level}.`)
      return
    }
    setNotice('')
    setGameStarted(false)
    setSelectedLevel(level)
  }

  function finishLevel(level: number) {
    const alreadyCompleted = progress.completedLevels.includes(level)
    setProgress((current) => {
      if (current.completedLevels.includes(level)) return current
      const next: SavedProgress = {
        completedLevels: [...current.completedLevels, level].sort((a, b) => a - b),
        unlockedLevel: Math.min(30, Math.max(current.unlockedLevel, level + 1)),
        stars: current.stars + 1,
      }
      try { localStorage.setItem(progressKey, JSON.stringify(next)) } catch { /* Progres tetap aktif selama aplikasi terbuka. */ }
      return next
    })
    setSelectedLevel(null)
    setGameStarted(false)
    setActiveTab('Peta')
    setNotice(alreadyCompleted ? `Level ${level} selesai!` : `Hebat! Level ${level} selesai dan 1 bintang didapat.`)
  }

  const isPlaying = selectedLevel !== null
  const isOnMap = activeTab === 'Peta'
  const missionProgress = Math.min(progress.completedLevels.length, 3)

  return (
    <main className={`game-home${isOnMap ? ' game-home--map' : ''}${isPlaying ? ' game-home--playing' : ''}`}>
      {isPlaying ? (
        <>
          <div className="game-home__landscape" aria-hidden="true" />
          {gameStarted ? (
            <LevelGame
              level={selectedLevel}
              completed={progress.completedLevels.includes(selectedLevel)}
              onBack={() => setGameStarted(false)}
              onComplete={finishLevel}
            />
          ) : (
            <LevelIntro
              level={selectedLevel}
              completed={progress.completedLevels.includes(selectedLevel)}
              onBack={() => setSelectedLevel(null)}
              onStart={() => setGameStarted(true)}
            />
          )}
        </>
      ) : isOnMap ? (
        <>
          <GameHeader starCount={120 + progress.stars} missionProgress={missionProgress} playerLevel={progress.unlockedLevel} showMission={false} />
          <AdventureMap
            notice={notice}
            unlockedLevel={progress.unlockedLevel}
            completedLevels={progress.completedLevels}
            onBack={() => { setNotice(''); setActiveTab('Beranda') }}
            onSelectLevel={chooseLevel}
            onShowMission={() => setNotice(`Misi harian: selesaikan 3 level dengan nilai sempurna. Progres ${missionProgress}/3.`)}
            onShowCollection={() => setNotice(`Koleksi bintang: ${progress.stars} bintang terkumpul.`)}
            onDismissNotice={() => setNotice('')}
          />
        </>
      ) : (
        <>
          <div className="game-home__landscape" aria-hidden="true" />
          <GameHeader starCount={120 + progress.stars} missionProgress={missionProgress} playerLevel={progress.unlockedLevel} layout={activeTab === 'Beranda' ? 'home' : 'default'} />
          {activeTab === 'Beranda' ? (
            <AdventureScene onStartAdventure={() => { setNotice(''); setActiveTab('Peta') }} />
          ) : (
            <OtherScreens
              tab={activeTab}
              stars={120 + progress.stars}
              unlockedLevel={progress.unlockedLevel}
              completedLevels={progress.completedLevels}
            />
          )}
        </>
      )}
      {!isPlaying && <BottomNavigation activeItem={activeTab} onSelect={(item) => { setNotice(''); setActiveTab(item) }} />}
    </main>
  )
}

export default App

