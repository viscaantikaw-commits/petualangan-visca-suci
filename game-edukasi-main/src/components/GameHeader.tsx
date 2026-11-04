import DailyMission from './DailyMission'
import Icon from './Icon'
import PlayerProfile from './PlayerProfile'
import ResourceCounter from './ResourceCounter'

function GameHeader() {
  return (
    <header className="game-header">
      <PlayerProfile />
      <div className="game-header__right">
        <div className="game-header__resources" aria-label="Sumber daya">
          <ResourceCounter icon="star" label="bintang" value={120} />
          <ResourceCounter icon="gem" label="berlian" value={45} />
          <span className="game-header__settings" aria-label="Pengaturan">
            <Icon name="settings" />
          </span>
        </div>
        <DailyMission />
      </div>
    </header>
  )
}

export default GameHeader
