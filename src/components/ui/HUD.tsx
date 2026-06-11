import type { PhaseData } from '../../types/game'
import HealthBar from './HealthBar'
import EvolutionTimeline from './EvolutionTimeline'

interface HUDProps {
  phase: PhaseData
  phaseIndex: number
  health: number
  timer: number
  foodCollected: number
  foodTotal: number
  foodTarget: number
  specialMechanic: PhaseData['specialMechanic']
}

const HUD = ({
  phase,
  phaseIndex,
  health,
  timer,
  foodCollected,
  foodTotal,
  specialMechanic,
}: HUDProps) => {
  const minutes = Math.floor(timer / 60)
  const seconds = Math.max(0, Math.ceil(timer % 60))
  const timeLabel = `${minutes}:${seconds.toString().padStart(2, '0')}`
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3 rounded-xl bg-[color:var(--ui-bg)] p-6">
          <span className="font-heading text-2xl text-[color:var(--accent)]">
            {phase.name}
          </span>
          <span className="text-sm uppercase tracking-widest text-slate-300">
            Faza {phaseIndex + 1}/6
          </span>
          <span className="text-lg text-slate-200">{phase.era}</span>
          <HealthBar value={health} max={100} />
        </div>
        <div className="flex flex-col items-end gap-3 rounded-xl bg-[color:var(--ui-bg)] p-6 text-right">
          <div className="text-3xl font-bold">{timeLabel}</div>
          <div className="text-lg text-[color:var(--food-color)]">
            {foodCollected}/{foodTotal} ulovljeno
          </div>
          <div className="text-sm text-slate-300"></div>
          {specialMechanic === 'asteroid' && (
            <span className="text-xs text-slate-300">
              Kiša asteroida — vreme ubrzano
            </span>
          )}
          {specialMechanic === 'current' && (
            <span className="text-xs text-slate-300">
              Struja te vuče ka istoku
            </span>
          )}
          {specialMechanic === 'predator-mode' && (
            <span className="text-xs text-slate-300">
              Plen beži — lovi ga
            </span>
          )}
          {specialMechanic === 'nets' && (
            <span className="text-xs text-slate-300">
              Mreže i zagađenje su svuda
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <EvolutionTimeline currentPhase={phaseIndex} />
      </div>
    </div>
  )
}

export default HUD
