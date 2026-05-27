import { useEffect } from 'react'

interface EvolutionScreenProps {
  fromSprite: string
  toSprite: string
  active: boolean
  onComplete: () => void
}

const EvolutionScreen = ({
  fromSprite,
  toSprite,
  active,
  onComplete,
}: EvolutionScreenProps) => {
  useEffect(() => {
    if (!active) return
    const timeout = window.setTimeout(() => {
      onComplete()
    }, 4000)
    return () => window.clearTimeout(timeout)
  }, [active, onComplete])

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-black/80">
      <div className="particle-layer absolute inset-0" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-8">
          <img
            src={fromSprite}
            alt=""
            className="sprite evolution-old h-48 w-48"
          />
          <img
            src={toSprite}
            alt=""
            className="sprite evolution-new h-48 w-48"
          />
        </div>
        <div className="font-heading text-3xl text-[color:var(--accent)]">
          Evolucija u toku...
        </div>
      </div>
    </div>
  )
}

export default EvolutionScreen
