import { useEffect, useMemo, useState } from 'react'
import type { InputVector } from '../types/game'

const keys = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'w',
  'a',
  's',
  'd',
  'W',
  'A',
  'S',
  'D',
])

const resolveDirection = (pressed: Set<string>): InputVector => {
  const left = pressed.has('ArrowLeft') || pressed.has('a') || pressed.has('A')
  const right =
    pressed.has('ArrowRight') || pressed.has('d') || pressed.has('D')
  const up = pressed.has('ArrowUp') || pressed.has('w') || pressed.has('W')
  const down =
    pressed.has('ArrowDown') || pressed.has('s') || pressed.has('S')
  const x = (right ? 1 : 0) - (left ? 1 : 0)
  const y = (down ? 1 : 0) - (up ? 1 : 0)
  return { x, y }
}

export const useControls = () => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!keys.has(event.key)) return
      event.preventDefault()
      setPressedKeys((current) => {
        if (current.has(event.key)) return current
        const updated = new Set(current)
        updated.add(event.key)
        return updated
      })
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!keys.has(event.key)) return
      event.preventDefault()
      setPressedKeys((current) => {
        if (!current.has(event.key)) return current
        const updated = new Set(current)
        updated.delete(event.key)
        return updated
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const direction = useMemo(() => resolveDirection(pressedKeys), [pressedKeys])

  return direction
}
