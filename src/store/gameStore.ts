import { useReducer } from 'react'
import type {
  EndReason,
  GameBounds,
  GameEntity,
  GameSnapshot,
  GameState,
  InputVector,
} from '../types/game'
import { phases } from '../data/phases'
import {
  ASTEROID_SPAWN_INTERVAL,
  CURRENT_FORCE,
  FOOD_FLEE_SPEED,
  PLAYER_SIZE,
  SPEED_UNIT,
  clamp,
  createAsteroidEntity,
  getFoodTarget,
  spawnPhaseEntities,
} from '../data/entities'

const DEFAULT_BOUNDS: GameBounds = { width: 1200, height: 720 }

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'RETRY_PHASE' }
  | { type: 'ADVANCE_PHASE' }
  | { type: 'SHOW_FACTCARD' }
  | { type: 'SET_PHASE'; phaseIndex: number }
  | { type: 'SET_GAME_STATE'; state: GameState; endReason?: EndReason | null }
  | { type: 'SET_BOUNDS'; bounds: GameBounds }
  | { type: 'TICK'; delta: number; input: InputVector }

const normalizeInput = (input: InputVector): InputVector => {
  const length = Math.hypot(input.x, input.y)
  if (length === 0) return input
  return { x: input.x / length, y: input.y / length }
}

const createPhaseSnapshot = (
  phaseIndex: number,
  bounds: GameBounds,
  adaptations: string[],
): GameSnapshot => {
  const phase = phases[phaseIndex]
  const player = {
    x: bounds.width / 2,
    y: bounds.height / 2,
    health: 100,
    speed: phase.playerSpeed * SPEED_UNIT,
    collectionRadius: PLAYER_SIZE / 2 + 6,
    phase: phase.id,
    facing: 'right' as const,
  }
  return {
    gameState: 'GAMEPLAY',
    phaseIndex,
    phase,
    player,
    entities: spawnPhaseEntities(phase, bounds),
    timer: phase.duration,
    foodCollected: 0,
    foodTarget: getFoodTarget(phase),
    endReason: null,
    damageCooldown: 0,
    asteroidSpawnTimer: ASTEROID_SPAWN_INTERVAL,
    adaptations,
    bounds,
  }
}

const createInitialState = (): GameSnapshot => {
  const base = createPhaseSnapshot(0, DEFAULT_BOUNDS, [])
  return {
    ...base,
    gameState: 'INTRO',
  }
}

const clampPlayer = (player: GameSnapshot['player'], bounds: GameBounds) => {
  const radius = PLAYER_SIZE / 2
  return {
    ...player,
    x: clamp(player.x, radius, bounds.width - radius),
    y: clamp(player.y, radius, bounds.height - radius),
  }
}

const shouldEndPhase = (state: GameSnapshot, timer: number, food: number) =>
  timer <= 0 || food >= state.foodTarget

const finalizePhase = (state: GameSnapshot, reason: EndReason): GameSnapshot => {
  if (reason === 'FAIL') {
    return { ...state, gameState: 'END', endReason: 'FAIL' }
  }
  if (state.phaseIndex >= phases.length - 1) {
    return { ...state, gameState: 'END', endReason: 'SUCCESS' }
  }
  return { ...state, gameState: 'EVOLUTION', endReason: null }
}

const withAdaptation = (state: GameSnapshot): string[] => {
  const adaptation = state.phase.fact.adaptationGained
  if (!adaptation) return state.adaptations
  if (state.adaptations.includes(adaptation)) return state.adaptations
  return [...state.adaptations, adaptation]
}

const updateEntities = (
  entities: GameEntity[],
  player: GameSnapshot['player'],
  bounds: GameBounds,
  delta: number,
  phase: GameSnapshot['phase'],
): GameEntity[] => {
  return entities.map((entity) => {
    if (entity.type === 'predator') {
      const dx = player.x - entity.x
      const dy = player.y - entity.y
      const distance = Math.hypot(dx, dy) || 1
      const speed = entity.speed ?? phase.predatorSpeed * SPEED_UNIT
      const stepX = (dx / distance) * speed * delta
      const stepY = (dy / distance) * speed * delta
      const nextX = clamp(entity.x + stepX, 0, bounds.width)
      const nextY = clamp(entity.y + stepY, 0, bounds.height)
      const facing = stepX < 0 ? 'left' : stepX > 0 ? 'right' : (entity.facing ?? 'right')
      return {
        ...entity,
        x: nextX,
        y: nextY,
        facing,
      }
    }
    if (entity.type === 'food' && phase.specialMechanic === 'predator-mode') {
      const dx = entity.x - player.x
      const dy = entity.y - player.y
      const distance = Math.hypot(dx, dy) || 1
      const fleeSpeed = phase.foodFleeSpeed ?? FOOD_FLEE_SPEED
      const stepX = (dx / distance) * fleeSpeed * delta
      const stepY = (dy / distance) * fleeSpeed * delta
      return {
        ...entity,
        x: clamp(entity.x + stepX, 0, bounds.width),
        y: clamp(entity.y + stepY, 0, bounds.height),
      }
    }
    if (entity.vy !== undefined) {
      return { ...entity, y: entity.y + entity.vy * delta }
    }
    return entity
  })
}

const processCollisions = (
  state: GameSnapshot,
  player: GameSnapshot['player'],
  entities: GameEntity[],
) => {
  const remaining: GameEntity[] = []
  let foodCollected = state.foodCollected
  let predatorHit = false
  let hazardHit = false
  const playerRadius = PLAYER_SIZE / 2

  for (const entity of entities) {
    if (entity.vy !== undefined && entity.y - entity.radius > state.bounds.height) {
      continue
    }
    const dx = player.x - entity.x
    const dy = player.y - entity.y
    const distance = Math.hypot(dx, dy)
    const overlap = distance <= playerRadius + entity.radius

    if (entity.type === 'food') {
      if (distance <= player.collectionRadius + entity.radius) {
        foodCollected += 1
        continue
      }
      remaining.push(entity)
      continue
    }

    if (entity.type === 'predator' && overlap) {
      predatorHit = true
    }
    if (entity.type === 'obstacle' && overlap) {
      hazardHit = true
    }
    remaining.push(entity)
  }

  return { remaining, foodCollected, predatorHit, hazardHit }
}

const reducer = (state: GameSnapshot, action: GameAction): GameSnapshot => {
  switch (action.type) {
    case 'START_GAME': {
      const snap = createPhaseSnapshot(0, state.bounds, [])
      return { ...snap, gameState: 'FACTCARD', pendingFactIndex: 0 }
    }
    case 'RETRY_PHASE': {
      return createPhaseSnapshot(state.phaseIndex, state.bounds, state.adaptations)
    }
    case 'ADVANCE_PHASE': {
      const nextIndex = typeof state.pendingFactIndex === 'number'
        ? state.pendingFactIndex
        : Math.min(state.phaseIndex + 1, phases.length - 1)
      const snap = createPhaseSnapshot(nextIndex, state.bounds, state.adaptations)
      // clear pendingFactIndex when starting next gameplay
      return { ...snap, pendingFactIndex: null }
    }
    case 'SET_PHASE': {
      if (action.phaseIndex < 0 || action.phaseIndex >= phases.length) return state
      const snap = createPhaseSnapshot(action.phaseIndex, state.bounds, state.adaptations)
      return { ...snap, pendingFactIndex: null }
    }
    case 'SHOW_FACTCARD': {
      // show fact for next phase index (if exists), otherwise current
      const nextIdx = Math.min(state.phaseIndex + 1, phases.length - 1)
      return { ...state, gameState: 'FACTCARD', pendingFactIndex: nextIdx }
    }
    case 'SET_GAME_STATE': {
      return {
        ...state,
        gameState: action.state,
        endReason: action.endReason ?? state.endReason,
      }
    }
    case 'SET_BOUNDS': {
      const updated = clampPlayer(state.player, action.bounds)
      // If gameplay already running, respawn entities to new bounds so tokens are reachable
      if (state.gameState === 'GAMEPLAY') {
        const newEntities = spawnPhaseEntities(state.phase, action.bounds)
        const centeredPlayer = clampPlayer(
          { ...state.player, x: action.bounds.width / 2, y: action.bounds.height / 2 },
          action.bounds,
        )
        return { ...state, bounds: action.bounds, player: centeredPlayer, entities: newEntities }
      }
      return { ...state, bounds: action.bounds, player: updated }
    }
    case 'TICK': {
      if (state.gameState !== 'GAMEPLAY') return state
      const delta = Math.min(action.delta, 0.05)
      const timeScale = state.phase.specialMechanic === 'asteroid' ? 1.35 : 1
      const nextTimer = Math.max(0, state.timer - delta * timeScale)
      const normalizedInput = normalizeInput(action.input)
      const facing =
        normalizedInput.x < 0
          ? 'left'
          : normalizedInput.x > 0
            ? 'right'
            : state.player.facing

      const currentForce =
        state.phase.specialMechanic === 'current' ? CURRENT_FORCE : 0
      const nextPlayer = clampPlayer(
        {
          ...state.player,
          x: state.player.x + normalizedInput.x * state.player.speed * delta + currentForce * delta,
          y: state.player.y + normalizedInput.y * state.player.speed * delta,
          facing,
        },
        state.bounds,
      )

      const updatedEntities = updateEntities(
        state.entities,
        nextPlayer,
        state.bounds,
        delta,
        state.phase,
      )

      let asteroidSpawnTimer = state.asteroidSpawnTimer
      let entitiesWithAsteroids = updatedEntities

      if (state.phase.specialMechanic === 'asteroid') {
        asteroidSpawnTimer -= delta
        if (asteroidSpawnTimer <= 0) {
          const asteroid = createAsteroidEntity(
            `asteroid-${state.phase.id}-${Math.random().toString(16).slice(2)}`,
            state.bounds,
            state.phase.asteroidSprite ?? state.phase.predatorSprites[0],
          )
          entitiesWithAsteroids = [...updatedEntities, asteroid]
          asteroidSpawnTimer = ASTEROID_SPAWN_INTERVAL
        }
      }

      const collisionResult = processCollisions(
        state,
        nextPlayer,
        entitiesWithAsteroids,
      )

      let damageCooldown = Math.max(0, state.damageCooldown - delta)
      let health = nextPlayer.health
      if (damageCooldown <= 0) {
        if (collisionResult.predatorHit) {
          health = Math.max(0, health - 25)
          damageCooldown = 0.7
        } else if (collisionResult.hazardHit) {
          health = Math.max(0, health - 15)
          damageCooldown = 0.6
        }
      }

      const updatedPlayer = { ...nextPlayer, health }
      if (health <= 0) {
        return finalizePhase(
          { ...state, player: updatedPlayer, entities: collisionResult.remaining },
          'FAIL',
        )
      }

      const updatedState: GameSnapshot = {
        ...state,
        player: updatedPlayer,
        entities: collisionResult.remaining,
        timer: nextTimer,
        foodCollected: collisionResult.foodCollected,
        damageCooldown,
        asteroidSpawnTimer,
      }

      if (shouldEndPhase(updatedState, nextTimer, collisionResult.foodCollected)) {
        const withNewAdaptations = {
          ...updatedState,
          adaptations: withAdaptation(updatedState),
        }
        return finalizePhase(withNewAdaptations, 'SUCCESS')
      }

      return updatedState
    }
    default:
      return state
  }
}

export const useGameStore = () => useReducer(reducer, undefined, createInitialState)
