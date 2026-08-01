import { useEffect, useMemo, useRef } from 'react'
import { toDateKey } from '../lib/format'

const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export default function DayStrip({ year, month, selectedDate, onSelect, transactions }) {
  const scrollerRef = useRef(null)
  const selectedRef = useRef(null)

  const daysInMonth = new Date(year, month, 0).getDate()

  const netByDay = useMemo(() => {
    const map = {}
    transactions.forEach((t) => {
      const key = toDateKey(t.datetime)
      const [ty, tm] = key.split('-').map(Number)
      if (ty !== year || tm !== month) return
      const signed = t.type === 'income' ? t.amount : -t.amount
      map[key] = (map[key] || 0) + signed
    })
    return map
  }, [transactions, year, month])

  const maxAbs = useMemo(() => {
    const vals = Object.values(netByDay).map((v) => Math.abs(v))
    return vals.length ? Math.max(...vals) : 1
  }, [netByDay])

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [selectedDate])

  const todayKey = toDateKey(new Date())

  return (
    <div
      ref={scrollerRef}
      className="flex gap-2 overflow-x-auto px-5 pb-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1
        const dateObj = new Date(year, month - 1, day)
        const key = toDateKey(dateObj)
        const net = netByDay[key] || 0
        const barHeight = net === 0 ? 2 : Math.max(4, Math.round((Math.abs(net) / maxAbs) * 22))
        const isSelected = key === selectedDate
        const isToday = key === todayKey

        return (
          <button
            key={key}
            ref={isSelected ? selectedRef : null}
            onClick={() => onSelect(key)}
            className={`flex w-11 shrink-0 flex-col items-center gap-1.5 rounded-2xl py-2.5 transition ${
              isSelected ? 'bg-accent text-white' : 'text-ink hover:bg-surface'
            }`}
          >
            <span className={`text-[10px] font-medium uppercase ${isSelected ? 'text-white/70' : 'text-muted'}`}>
              {DAY_LABELS[dateObj.getDay()]}
            </span>
            <span className={`font-mono-num text-sm font-semibold ${isSelected ? 'text-white' : 'text-ink'}`}>
              {day}
              {isToday && !isSelected && <span className="ml-0.5 text-accent">•</span>}
            </span>
            <div className="flex h-6 items-end">
              <div
                className="w-1.5 rounded-full"
                style={{
                  height: `${barHeight}px`,
                  backgroundColor: isSelected
                    ? 'rgba(255,255,255,0.85)'
                    : net === 0
                    ? 'var(--color-border)'
                    : net > 0
                    ? 'var(--color-income)'
                    : 'var(--color-expense)',
                }}
              />
            </div>
          </button>
        )
      })}
    </div>
  )
}
