import type { GameEntity } from '../../types/game'
import { FOOD_SIZE } from '../../data/entities'

interface FoodProps {
  food: GameEntity
}

const Food = ({ food }: FoodProps) => {
  const size = FOOD_SIZE
  return (
    <div
      className="absolute"
      style={{
        width: size,
        height: size,
        left: food.x - size / 2,
        top: food.y - size / 2,
      }}
    >
      <img src={food.sprite} alt="" className="sprite h-full w-full" />
    </div>
  )
}

export default Food