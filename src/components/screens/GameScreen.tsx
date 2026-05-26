import type { Dispatch } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import type { GameSnapshot } from '../../types/game'
import type { GameAction } from '../../store/gameStore'
import { useControls } from '../../hooks/useControls'
import { useGameLoop } from '../../hooks/useGameLoop'
import Ocean from '../game/Ocean'
import Player from '../game/Player'
import Predator from '../game/Predator'
import Food from '../game/Food'
import Obstacle from '../game/Obstacle'
import HUD from '../ui/HUD'

interface GameScreenProps {
  state: GameSnapshot
  dispatch: Dispatch<GameAction>
}

const GameScreen = ({ state, dispatch }: GameScreenProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const input = useControls()

  useGameLoop(state.gameState === 'GAMEPLAY', (delta) => {
    dispatch({ type: 'TICK', delta, input })
  })

  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    const updateBounds = () => {
      dispatch({
        type: 'SET_BOUNDS',
        bounds: { width: element.clientWidth, height: element.clientHeight },
      })
    }
    updateBounds()
    const observer = new ResizeObserver(updateBounds)
    observer.observe(element)
    return () => observer.disconnect()
  }, [dispatch])

  const foods = useMemo(
    () => state.entities.filter((entity) => entity.type === 'food'),
    [state.entities],
  )
  const predators = useMemo(
    () => state.entities.filter((entity) => entity.type === 'predator'),
    [state.entities],
  )
  const obstacles = useMemo(
    () => state.entities.filter((entity) => entity.type === 'obstacle'),
    [state.entities],
  )

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <Ocean
        backgroundImage={state.phase.backgroundImage}
        backgroundColor={state.phase.backgroundColor}
      />
      <HUD
        phase={state.phase}
        phaseIndex={state.phaseIndex}
        health={state.player.health}
        timer={state.timer}
        foodCollected={state.foodCollected}
        foodTotal={state.phase.foodCount}
        specialMechanic={state.phase.specialMechanic}
      />
      <div className="absolute inset-0 z-10">
        {foods.map((food) => (
          <Food key={food.id} food={food} />
        ))}
        {predators.map((predator) => (
          <Predator key={predator.id} predator={predator} />
        ))}
        {obstacles.map((obstacle) => (
          <Obstacle key={obstacle.id} obstacle={obstacle} />
        ))}
        <Player player={state.player} sprite={state.phase.sharkSprite} />
      </div>
    </div>
  )
}

export default GameScreen
