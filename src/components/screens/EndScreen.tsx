import { phases } from '../../data/phases'

interface EndScreenProps {
  success: boolean
  adaptations: string[]
  onRetryPhase: () => void
  onRestart: () => void
}

const EndScreen = ({
  success,
  adaptations,
  onRetryPhase,
  onRestart,
}: EndScreenProps) => {
  if (!success) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black/80 px-6 text-center">
        <div className="max-w-xl rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur">
          <h2 className="font-heading text-3xl text-[color:var(--accent)]">
            Nisi preživeo
          </h2>
          <p className="mt-4 text-slate-200">
            Predatori i prepreke su bili jači. Probaj ponovo i prilagodi se.
          </p>
          <button
            type="button"
            className="mt-6 rounded-full bg-[color:var(--accent)] px-8 py-3 font-heading text-slate-900 transition hover:brightness-110"
            onClick={onRetryPhase}
          >
            Ponovi fazu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-black/85 px-6 text-center">
      <div className="max-w-4xl rounded-2xl border border-white/20 bg-white/10 p-10 backdrop-blur">
        <h2 className="font-heading text-4xl text-[color:var(--accent)]">
          Evolucija Kompletna
        </h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {phases.map((phase) => (
            <img
              key={phase.id}
              src={phase.sharkSprite}
              alt=""
              className="sprite h-24 w-24"
            />
          ))}
        </div>
        <div className="mt-6 text-left text-base text-slate-200">
          <div className="mb-2 font-heading text-[color:var(--accent)]">
            Adaptacije:
          </div>
          <ul className="list-disc pl-6">
            {adaptations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-slate-200">
          Ajkule postoje 450 miliona godina — preživele su 5 masovnih
          izumiranja. One nisu 'savršene' — samo dovoljno prilagodljive.
        </p>
        <button
          type="button"
          className="mt-6 rounded-full bg-[color:var(--accent)] px-8 py-3 font-heading text-slate-900 transition hover:brightness-110"
          onClick={onRestart}
        >
          Igraj ponovo
        </button>
      </div>
    </div>
  )
}

export default EndScreen
