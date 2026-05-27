import type { GameEntity } from '../../types/game'
import { PREDATOR_SIZE } from '../../data/entities'

interface PredatorProps {
  predator: GameEntity
}

const Predator = ({ predator }: PredatorProps) => {
  const size = PREDATOR_SIZE
  const scaleX = predator.facing === 'left' ? -1 : 1
  return (
    <div
      className="absolute"
      style={{
        width: size,
        height: size,
        left: predator.x - size / 2,
        top: predator.y - size / 2,
        transform: `scaleX(${scaleX})`,
        transformOrigin: 'center',
      }}
    >
      <img src={predator.sprite} alt="" className="sprite h-full w-full select-none" />
    </div>
  )
}

export default Predator
