import type { GameBounds, GameEntity, PhaseData } from '../types/game'

import netSprite from '../assets/tiny_plankton_cluster.png'
import asteroidSprite from '../assets/small_school_fish.png'

export const PLAYER_SIZE = 120
export const PREDATOR_SIZE = 110
export const FOOD_SIZE = 56
export const OBSTACLE_SIZE = 100
export const ASTEROID_SIZE = 64
export const NET_SIZE = 120

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
  Math.min(15, phase.foodCount)

const randomPosition = (bounds: GameBounds, size: number) => ({
  x: randomBetween(size, bounds.width - size),
  y: randomBetween(size, bounds.height - size),
})

const isSafePosition = (
  x: number,
  y: number,
  avoid: GameEntity[],
  minDistance: number,
) =>
  avoid.every(
    (entity) =>
      Math.hypot(x - entity.x, y - entity.y) >=
      entity.radius + minDistance,
  )

export const createFoodEntity = (
  id: string,
  phase: PhaseData,
  bounds: GameBounds,
  avoid: GameEntity[] = [],
  margin = 120,
): GameEntity => {
  // Try many times to find a safe, reachable position (avoid UI edges via margin)
  let position = randomPosition(bounds, FOOD_SIZE)
  const attempts = 200
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    // enforce margin from edges
    const x = Math.max(margin, Math.min(bounds.width - margin, position.x))
    const y = Math.max(margin, Math.min(bounds.height - margin, position.y))
    if (isSafePosition(x, y, avoid, FOOD_SIZE + 6)) {
      position = { x, y }
      break
    }
    position = randomPosition(bounds, FOOD_SIZE)
  }
  // fallback clamp
  position.x = Math.max(FOOD_SIZE, Math.min(bounds.width - FOOD_SIZE, position.x))
  position.y = Math.max(FOOD_SIZE, Math.min(bounds.height - FOOD_SIZE, position.y))
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
    facing: 'right',
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
  sprite?: string,
): GameEntity => {
  const x = randomBetween(ASTEROID_SIZE, bounds.width - ASTEROID_SIZE)
  return {
    id,
    type: 'obstacle',
    x,
    y: -ASTEROID_SIZE,
    sprite: sprite ?? asteroidSprite,
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
  // spawn predators first so foods avoid them
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
  // spawn nets/obstacles
  if (phase.specialMechanic === 'nets') {
    for (let i = 0; i < 3; i += 1) {
      entities.push(createNetEntity(`net-${phase.id}-${i}`, bounds))
    }
  }
  // spawn foods and avoid predators/nets
  for (let i = 0; i < phase.foodCount; i += 1) {
    entities.push(
      createFoodEntity(`food-${phase.id}-${i}`, phase, bounds, entities, 120),
    )
  }
  return entities
}
