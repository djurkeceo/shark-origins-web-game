import type { GameEntity } from '../../types/game'
interface ObstacleProps {
  obstacle: GameEntity
}

const Obstacle = ({ obstacle }: ObstacleProps) => {
  const size = obstacle.radius * 2
  return (
    <div
      className="absolute opacity-90"
      style={{
        width: size,
        height: size,
        left: obstacle.x - size / 2,
        top: obstacle.y - size / 2,
      }}
    >
      <img src={obstacle.sprite} alt="" className="sprite h-full w-full" />
    </div>
  )
}

export default Obstacle
