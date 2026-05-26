import type { ReactNode } from 'react'
import { phases } from './data/phases'
import IntroScreen from './components/screens/IntroScreen'
import GameScreen from './components/screens/GameScreen'
import EvolutionScreen from './components/screens/EvolutionScreen'
import FactCard from './components/screens/FactCard'
import EndScreen from './components/screens/EndScreen'
import { useGameStore } from './store/gameStore'

const Screen = ({ active, children }: { active: boolean; children: ReactNode }) => {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        active ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className={active ? 'h-full w-full screen-fade' : 'h-full w-full'}>
        {children}
      </div>
    </div>
  )
}

function App() {
  const [state, dispatch] = useGameStore()
  const nextPhase = phases[state.phaseIndex + 1] ?? state.phase
  const isSuccess = state.endReason === 'SUCCESS'

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-body text-slate-100">
      <Screen active={state.gameState === 'INTRO'}>
        <IntroScreen onStart={() => dispatch({ type: 'START_GAME' })} />
      </Screen>
      <Screen active={state.gameState === 'GAMEPLAY'}>
        <GameScreen state={state} dispatch={dispatch} />
      </Screen>
      <Screen active={state.gameState === 'EVOLUTION'}>
        <EvolutionScreen
          fromSprite={state.phase.sharkSprite}
          toSprite={nextPhase.sharkSprite}
          active={state.gameState === 'EVOLUTION'}
          onComplete={() => dispatch({ type: 'SHOW_FACTCARD' })}
        />
      </Screen>
      <Screen active={state.gameState === 'FACTCARD'}>
        <FactCard
          fact={state.phase.fact}
          active={state.gameState === 'FACTCARD'}
          onContinue={() => dispatch({ type: 'ADVANCE_PHASE' })}
        />
      </Screen>
      <Screen active={state.gameState === 'END'}>
        <EndScreen
          success={isSuccess}
          adaptations={state.adaptations}
          onRetryPhase={() => dispatch({ type: 'RETRY_PHASE' })}
          onRestart={() => dispatch({ type: 'START_GAME' })}
        />
      </Screen>
    </div>
  )
}

export default App
