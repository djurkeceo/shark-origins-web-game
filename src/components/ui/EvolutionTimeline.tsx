import { phases } from '../../data/phases'

interface EvolutionTimelineProps {
  currentPhase: number
}

const EvolutionTimeline = ({ currentPhase }: EvolutionTimelineProps) => {
  return (
    <div className="flex items-center justify-center gap-4 rounded-full bg-[color:var(--ui-bg)] px-8 py-4">
      {phases.map((phase, index) => {
        const active = index === currentPhase
        const completed = index < currentPhase
        return (
          <div
            key={phase.id}
            className={`h-4 w-16 rounded-full transition ${
              active
                ? 'bg-[color:var(--accent)]'
                : completed
                  ? 'bg-white/60'
                  : 'bg-white/20'
            }`}
          />
        )
      })}
    </div>
  )
}

export default EvolutionTimeline
