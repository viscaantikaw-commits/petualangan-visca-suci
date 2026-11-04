import type { CSSProperties } from 'react'
import Icon from './Icon'

export type LevelStatus = 'aktif' | 'terbuka' | 'terkunci'

type LevelNodeProps = {
  level: number
  status: LevelStatus
  style?: CSSProperties
  onSelect: (level: number) => void
}

function LevelNode({ level, status, style, onSelect }: LevelNodeProps) {
  const isLocked = status === 'terkunci'

  return (
    <button
      aria-current={status === 'aktif' ? 'step' : undefined}
      aria-label={`Level ${level}${isLocked ? ', terkunci' : ''}`}
      className={`level-node level-node--${status}`}
      disabled={isLocked}
      onClick={() => onSelect(level)}
      style={style}
      type="button"
    >
      {isLocked && <Icon className="level-node__lock" name="lock" />}
      <span className="level-node__number">{level}</span>
    </button>
  )
}

export default LevelNode
