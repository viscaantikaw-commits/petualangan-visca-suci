import { MAP_HEIGHT, MAP_WIDTH, worlds } from '../data/peta'
import Icon from './Icon'
import LevelNode, { type LevelStatus } from './LevelNode'

type MapScreenProps = {
  currentLevel?: number
  unlockedLevel?: number
  onBack: () => void
  onSelectLevel?: (level: number) => void
}

const toPercent = (value: number, total: number) => `${(value / total) * 100}%`

function getLevelStatus(level: number, currentLevel: number, unlockedLevel: number): LevelStatus {
  if (level === currentLevel) return 'aktif'
  if (level <= unlockedLevel) return 'terbuka'
  return 'terkunci'
}

function MapScreen({
  currentLevel = 1,
  unlockedLevel = 2,
  onBack,
  onSelectLevel = () => {},
}: MapScreenProps) {
  return (
    <section className="map-screen" aria-label="Peta Petualangan">
      <div className="map-screen__top">
        <button
          aria-label="Kembali ke beranda"
          className="map-screen__back"
          onClick={onBack}
          type="button"
        >
          <Icon name="chevron" />
        </button>
        <div className="map-title">
          <h1 className="map-title__plank">Peta Petualangan</h1>
          <p className="map-title__ribbon">Jelajahi Dunia, Temukan Bentuknya!</p>
        </div>
      </div>

      <div
        className="world-map"
        style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}
      >
        {worlds.map((world) => (
          <div
            aria-label={`Dunia ${world.id}: ${world.name}. ${world.description}`}
            className="world-island"
            key={world.id}
            role="group"
            style={{
              left: toPercent(world.x, MAP_WIDTH),
              top: toPercent(world.y, MAP_HEIGHT),
              width: toPercent(world.width, MAP_WIDTH),
            }}
          >
            <img alt="" className="world-island__art" draggable={false} src={world.image} />
          </div>
        ))}

        {worlds.flatMap((world) =>
          world.levels.map(({ level, x, y }) => (
            <LevelNode
              key={level}
              level={level}
              onSelect={onSelectLevel}
              status={getLevelStatus(level, currentLevel, unlockedLevel)}
              style={{
                left: toPercent(world.x + x, MAP_WIDTH),
                top: toPercent(world.y + y, MAP_HEIGHT),
              }}
            />
          )),
        )}

        <article className="shape-collection">
          <Icon className="shape-collection__icon" name="chest" />
          <div className="shape-collection__content">
            <h2>Koleksi Bentuk</h2>
            <div
              className="shape-collection__progress"
              role="progressbar"
              aria-label="Bentuk yang sudah dikoleksi"
              aria-valuenow={8}
              aria-valuemin={0}
              aria-valuemax={24}
            >
              <span>8/24</span>
            </div>
          </div>
          <Icon className="shape-collection__chevron" name="chevron" />
        </article>
      </div>
    </section>
  )
}

export default MapScreen
