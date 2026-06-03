import { useEffect } from 'react'
import type { FactCardData } from '../../types/game'

interface FactCardProps {
  fact: FactCardData
  active: boolean
  onContinue: () => void
  creatureSprite: string
  creatureName: string
}

const FactCard = ({
  fact,
  active,
  onContinue,
  creatureSprite,
  creatureName,
}: FactCardProps) => {
  useEffect(() => {
    if (!active) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return
      onContinue()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [active, onContinue])

  return (
    <div className="flex h-full w-full items-center justify-center bg-black/70 px-6">
      <div className="flex flex-col items-center gap-6">
        <div className="max-w-3xl rounded-2xl border border-white/20 bg-white/10 p-10 text-center text-slate-100 backdrop-blur-md">
          <h2 className="font-heading text-5xl text-[color:var(--accent)]">
            {fact.title}
          </h2>
          <p className="mt-4 text-2xl">{fact.definition}</p>
          <p className="mt-4 text-xl text-slate-200">{fact.creatureFact}</p>
          {fact.adaptationGained && (
            <p className="mt-4 text-xl text-[color:var(--accent)]">
              Dobijena adaptacija: {fact.adaptationGained}
            </p>
          )}
          <p className="mt-6 text-base uppercase tracking-widest text-slate-300">
            Pritisni ENTER da nastaviš
          </p>
        </div>
        <img
          src={creatureSprite}
          alt={creatureName}
          className="sprite h-32 w-32"
        />
      </div>
    </div>
  )
}

export default FactCard
