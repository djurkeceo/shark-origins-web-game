import { useEffect, useRef, type ReactNode } from "react";
import { phases } from "./data/phases";
import IntroScreen from "./components/screens/IntroScreen";
import GameScreen from "./components/screens/GameScreen";
import EvolutionScreen from "./components/screens/EvolutionScreen";
import FactCard from "./components/screens/FactCard";
import EndScreen from "./components/screens/EndScreen";
import { useGameStore } from "./store/gameStore";

const Screen = ({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) => {
  useEffect(() => {
    if (!active && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [active]);

  return (
    <div
      aria-hidden={!active}
      className={`absolute inset-0 transition-opacity duration-300 ${
        active
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div className={active ? "h-full w-full screen-fade" : "h-full w-full"}>
        {children}
      </div>
    </div>
  );
};

function App() {
  const [state, dispatch] = useGameStore();
  const nextPhase = phases[state.phaseIndex + 1] ?? state.phase;
  const isSuccess = state.endReason === "SUCCESS";
  const cheatBuffer = useRef("");
  const factPhase = phases[state.pendingFactIndex ?? state.phaseIndex];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length !== 1) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const next = `${cheatBuffer.current}${event.key.toLowerCase()}`.slice(
        -12,
      );
      cheatBuffer.current = next;
      for (let idx = 0; idx < phases.length; idx += 1) {
        const code = `nivo${idx + 1}`;
        if (next.endsWith(code)) {
          cheatBuffer.current = "";
          dispatch({ type: "SET_PHASE", phaseIndex: idx });
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-body text-slate-100">
      <Screen active={state.gameState === "INTRO"}>
        <IntroScreen onStart={() => dispatch({ type: "START_GAME" })} />
      </Screen>
      <Screen active={state.gameState === "GAMEPLAY"}>
        <GameScreen key={state.phaseIndex} state={state} dispatch={dispatch} />
      </Screen>
      <Screen active={state.gameState === "EVOLUTION"}>
        <EvolutionScreen
          fromSprite={state.phase.sharkSprite}
          toSprite={nextPhase.sharkSprite}
          active={state.gameState === "EVOLUTION"}
          onComplete={() => dispatch({ type: "SHOW_FACTCARD" })}
        />
      </Screen>
      <Screen active={state.gameState === "FACTCARD"}>
        <FactCard
          fact={factPhase.fact}
          creatureSprite={factPhase.sharkSprite}
          creatureName={factPhase.name}
          active={state.gameState === "FACTCARD"}
          onContinue={() => dispatch({ type: "ADVANCE_PHASE" })}
        />
      </Screen>
      <Screen active={state.gameState === "END"}>
        <EndScreen
          success={isSuccess}
          adaptations={state.adaptations}
          onRetryPhase={() => dispatch({ type: "RETRY_PHASE" })}
          onRestart={() => dispatch({ type: "START_GAME" })}
        />
      </Screen>
    </div>
  );
}

export default App;
