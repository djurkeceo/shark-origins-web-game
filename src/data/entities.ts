import type { GameBounds, GameEntity, PhaseData } from '../types/game'

import netSprite from '../assets/tiny_plankton_cluster.png'
import asteroidSprite from '../assets/small_school_fish.png'

export const PLAYER_SIZE = 56
export const PREDATOR_SIZE = 64
export const FOOD_SIZE = 28
export const OBSTACLE_SIZE = 52
export const ASTEROID_SIZE = 36
export const NET_SIZE = 72

export const SPEED_UNIT = 60
export const PREDATOR_SPEED_UNIT = 50
export const FOOD_FLEE_SPEED = 55
export const CURRENT_FORCE = 35
export const ASTEROID_FALL_SPEED = 170
export const ASTEROID_SPAWN_INTERVAL = 1.1

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min

export const getFoodTarget = (phase: PhaseData) =>
  Math.min(10, phase.foodCount)

const randomPosition = (bounds: GameBounds, size: number) => ({
  x: randomBetween(size, bounds.width - size),
  y: randomBetween(size, bounds.height - size),
})

export const createFoodEntity = (
  id: string,
  phase: PhaseData,
  bounds: GameBounds,
): GameEntity => {
  const position = randomPosition(bounds, FOOD_SIZE)
  return {
    id,
    type: 'food',
    x: position.x,
    y: position.y,
    sprite: phase.foodSprite,
    radius: FOOD_SIZE / 2,
  }
}

export const createPredatorEntity = (
  id: string,
  sprite: string,
  speed: number,
  bounds: GameBounds,
): GameEntity => {
  const position = randomPosition(bounds, PREDATOR_SIZE)
  return {
    id,
    type: 'predator',
    x: position.x,
    y: position.y,
    sprite,
    radius: PREDATOR_SIZE / 2,
    speed,
  }
}

export const createNetEntity = (
  id: string,
  bounds: GameBounds,
): GameEntity => {
  const position = randomPosition(bounds, NET_SIZE)
  return {
    id,
    type: 'obstacle',
    x: position.x,
    y: position.y,
    sprite: netSprite,
    radius: NET_SIZE / 2,
    hazard: true,
  }
}

export const createAsteroidEntity = (
  id: string,
  bounds: GameBounds,
): GameEntity => {
  const x = randomBetween(ASTEROID_SIZE, bounds.width - ASTEROID_SIZE)
  return {
    id,
    type: 'obstacle',
    x,
    y: -ASTEROID_SIZE,
    sprite: asteroidSprite,
    radius: ASTEROID_SIZE / 2,
    vy: ASTEROID_FALL_SPEED,
    hazard: true,
  }
}

export const spawnPhaseEntities = (
  phase: PhaseData,
  bounds: GameBounds,
): GameEntity[] => {
  const entities: GameEntity[] = []
  for (let i = 0; i < phase.foodCount; i += 1) {
    entities.push(createFoodEntity(`food-${phase.id}-${i}`, phase, bounds))
  }
  for (let i = 0; i < phase.predatorCount; i += 1) {
    const sprite =
      phase.predatorSprites[i % phase.predatorSprites.length] ??
      phase.predatorSprites[0]
    entities.push(
      createPredatorEntity(
        `predator-${phase.id}-${i}`,
        sprite,
        phase.predatorSpeed * PREDATOR_SPEED_UNIT,
        bounds,
      ),
    )
  }
  if (phase.specialMechanic === 'nets') {
    for (let i = 0; i < 3; i += 1) {
      entities.push(createNetEntity(`net-${phase.id}-${i}`, bounds))
    }
  }
  return entities
}
