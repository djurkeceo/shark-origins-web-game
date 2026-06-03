import Ocean from '../game/Ocean'
import { phases } from '../../data/phases'

interface IntroScreenProps {
  onStart: () => void
}

const IntroScreen = ({ onStart }: IntroScreenProps) => {
  const introPhase = phases[0]
  return (
    <div className="relative h-full w-full">
      <Ocean
        backgroundImage={introPhase.backgroundImage}
        backgroundColor={introPhase.backgroundColor}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="font-heading text-5xl text-[color:var(--accent)]">
          Evolucija Ajkule
        </h1>
        <p className="max-w-xl text-lg text-slate-200">
          Kreni kroz 450 miliona godina evolucije ajkula. Preživi predatore,
          sakupljaj plen i prilagodi se promenama okeana.
        </p>
        <div className="rounded-xl bg-[color:var(--ui-bg)] px-6 py-4 text-sm text-slate-200">
          Kontrole: WASD ili strelice · Sakupljaj hranu · Izbegavaj opasnosti
        </div>
        <button
          type="button"
          className="rounded-full bg-[color:var(--accent)] px-8 py-3 font-heading text-base text-slate-900 transition hover:brightness-110"
          onClick={onStart}
        >
          Započni evoluciju
        </button>
      </div>
    </div>
  )
}

export default IntroScreen
