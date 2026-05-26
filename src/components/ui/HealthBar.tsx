interface HealthBarProps {
  value: number
  max: number
}

const HealthBar = ({ value, max }: HealthBarProps) => {
  const percent = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="w-48 rounded-full bg-black/40 p-1">
      <div
        className="h-3 rounded-full transition-all"
        style={{ width: `${percent}%`, backgroundColor: 'var(--health-color)' }}
      />
    </div>
  )
}

export default HealthBar
