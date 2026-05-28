export type GameState = 'INTRO' | 'GAMEPLAY' | 'EVOLUTION' | 'FACTCARD' | 'END'

export type Phase = 1 | 2 | 3 | 4 | 5 | 6

export type EntityType = 'food' | 'predator' | 'obstacle'

export interface PlayerState {
  x: number
  y: number
  health: number
  speed: number
  collectionRadius: number
  phase: Phase
}

export interface Entity {
  id: string
  x: number
  y: number
  type: EntityType
  speed?: number
}

export type SpecialMechanic = 'current' | 'asteroid' | 'predator-mode' | 'nets' | null

export interface FactCardData {
  title: string
  definition: string
  creatureFact: string
  adaptationGained: string | null
}

export interface PhaseData {
  id: Phase
  name: string
  era: string
  duration: number
  sharkSprite: string
  backgroundImage: string
  backgroundColor: string
  predatorSprites: string[]
  asteroidSprite?: string
  foodSprite: string
  foodFleeSpeed?: number
  predatorCount: number
  foodCount: number
  predatorSpeed: number
  playerSpeed: number
  fact: FactCardData
  specialMechanic: SpecialMechanic
}

export interface PlayerRuntimeState extends PlayerState {
  facing: 'left' | 'right'
}

export interface GameEntity extends Entity {
  sprite: string
  radius: number
  vx?: number
  vy?: number
  hazard?: boolean
  facing?: 'left' | 'right'
}

export interface GameBounds {
  width: number
  height: number
}

export type EndReason = 'SUCCESS' | 'FAIL'

export interface GameSnapshot {
  gameState: GameState
  phaseIndex: number
  phase: PhaseData
  player: PlayerRuntimeState
  entities: GameEntity[]
  timer: number
  foodCollected: number
  foodTarget: number
  endReason: EndReason | null
  damageCooldown: number
  asteroidSpawnTimer: number
  adaptations: string[]
  bounds: GameBounds
  pendingFactIndex?: number | null
}

export interface InputVector {
  x: number
  y: number
}
