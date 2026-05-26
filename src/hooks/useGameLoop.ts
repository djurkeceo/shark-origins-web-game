import { useEffect, useRef } from 'react'

type LoopCallback = (deltaSeconds: number) => void

export const useGameLoop = (isRunning: boolean, onTick: LoopCallback) => {
  const frameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const callbackRef = useRef(onTick)

  useEffect(() => {
    callbackRef.current = onTick
  }, [onTick])

  useEffect(() => {
    if (!isRunning) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
      lastTimeRef.current = null
      return
    }

    const loop = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time
      }
      const delta = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time
      callbackRef.current(delta)
      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
      frameRef.current = null
      lastTimeRef.current = null
    }
  }, [isRunning])
}
