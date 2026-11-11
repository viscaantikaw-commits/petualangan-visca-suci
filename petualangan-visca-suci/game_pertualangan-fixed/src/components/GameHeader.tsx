import DailyMission from './DailyMission'
import Icon from './Icon'
import PlayerProfile from './PlayerProfile'
import ResourceCounter from './ResourceCounter'

function GameHeader({ starCount = 120, missionProgress = 1, playerLevel = 3, showMission = true, layout = 'default' }: { starCount?: number; missionProgress?: number; playerLevel?: number; showMission?: boolean; layout?: 'default' | 'home' }) {
  return (
    <header className={`game-header${layout === 'home' ? ' game-header--home' : ''}`}>
      <PlayerProfile level={playerLevel} />
      <div className="game-header__right">
        <div className="game-header__resources" aria-label="Sumber daya">
          <ResourceCounter icon="star" label="bintang" value={starCount} />
          <ResourceCounter icon="gem" label="berlian" value={45} />
          <span className="game-header__settings" aria-label="Pengaturan">
            <Icon name="settings" />
          </span>
        </div>
        {showMission && <DailyMission progress={missionProgress} />}
      </div>
    </header>
  )
}

export default GameHeader



