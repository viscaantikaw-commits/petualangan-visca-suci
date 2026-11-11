import walkA from '../assets/hero-walk-a.png'
import walkB from '../assets/hero-walk-b.png'
import jumpPose from '../assets/hero-jump.png'

type HeroSpriteProps = {
  direction: 'left' | 'right'
  walking: boolean
  jumping: boolean
}

function HeroSprite({ direction, walking, jumping }: HeroSpriteProps) {
  return (
    <span
      className={`hero-sprite${walking ? ' is-walking' : ''}${jumping ? ' is-jumping' : ''}`}
      style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}
      role="img"
      aria-label={jumping ? 'Maskot sedang melompat' : walking ? 'Maskot sedang berjalan' : 'Maskot siap menjelajah'}
    >
      {jumping ? (
        <img src={jumpPose} alt="" />
      ) : (
        <>
          <img className="hero-sprite__frame hero-sprite__frame--a" src={walkA} alt="" />
          <img className="hero-sprite__frame hero-sprite__frame--b" src={walkB} alt="" />
        </>
      )}
    </span>
  )
}

export default HeroSprite
