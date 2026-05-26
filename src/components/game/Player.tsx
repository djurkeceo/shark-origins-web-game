import type { PlayerRuntimeState } from '../../types/game'
import { PLAYER_SIZE } from '../../data/entities'

interface PlayerProps {
  player: PlayerRuntimeState
  sprite: string
}

const Player = ({ player, sprite }: PlayerProps) => {
  const size = PLAYER_SIZE
  const left = player.x - size / 2
  const top = player.y - size / 2
  const scaleX = player.facing === 'left' ? -1 : 1

  return (
    <div
      className="absolute"
      style={{
        width: size,
        height: size,
        left,
        top,
        transform: `scaleX(${scaleX})`,
      }}
    >
      <img src={sprite} alt="" className="sprite h-full w-full select-none" />
    </div>
  )
}

export default Player
