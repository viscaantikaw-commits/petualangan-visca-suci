import { useState } from 'react'
import './App.css'
import AdventureScene from './components/AdventureScene'
import BottomNavigation, {
  type NavigationItem,
} from './components/BottomNavigation'
import GameHeader from './components/GameHeader'
import MapScreen from './components/MapScreen'

function App() {
  const [activeTab, setActiveTab] = useState<NavigationItem>('Beranda')
  const isMap = activeTab === 'Peta'

  return (
    <main className={`game-home${isMap ? ' game-home--peta' : ''}`}>
      {!isMap && <div className="game-home__landscape" aria-hidden="true" />}
      <GameHeader />
      {isMap ? (
        <MapScreen onBack={() => setActiveTab('Beranda')} />
      ) : (
        <AdventureScene onStartAdventure={() => setActiveTab('Peta')} />
      )}
      <BottomNavigation activeItem={activeTab} onSelect={setActiveTab} />
    </main>
  )
}

export default App
