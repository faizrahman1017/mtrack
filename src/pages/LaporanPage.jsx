import Modal from '../components/Modal'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  getWeekRange, filterByRange, summarize, categoryBreakdown,
  weeklyDailySeries, monthlyDailySeries, yearlyMonthlySeries,
} from '../lib/reportUtils'
import { formatCompactRupiah, formatMonthYear, formatRupiah, formatTime, toDateKey } from '../lib/format'
import { useTheme } from '../hooks/useTheme'
import { useState, useMemo } from 'react'

const MODES = [
  { key: 'week', label: 'Mingguan' },
  { key: 'month', label: 'Bulanan' },
  { key: 'year', label: 'Tahunan' },
]

const CHART_PALETTE = {
  light: {
    grid: '#E6E4DD',
    tick: '#6E756B',
    cursor: '#F0EFEA',
    income: '#1F8A5F',
    expense: '#AE4630',
    pie: ['#AE4630', '#DE9F4E', '#0F6E5E', '#8AA69C', '#C9A26B', '#6E756B'],
  },
  dark: {
    grid: '#2E3437',
    tick: '#939A93',
    cursor: '#262B2E',
    income: '#3BBB84',
    expense: '#E3806A',
    pie: ['#E3806A', '#EFB56C', '#22A187', '#6F8079', '#C9A26B', '#939A93'],
  },
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-bg px-3 py-2 text-xs shadow-sm">
      <p className="mb-1 font-medium text-ink">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {formatRupiah(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function LaporanPage({ transactions }) {
  const { theme } = useTheme()
  const colors = CHART_PALETTE[theme]
  const [mode, setMode] = useState('week')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [anchor, setAnchor] = useState(new Date())

  const periodLabel = useMemo(() => {
    if (mode === 'week') {
      const { start, end } = getWeekRange(anchor)
      const fmt = (d) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      return `${fmt(start)} – ${fmt(end)} ${end.getFullYear()}`
    }
    if (mode === 'month') return formatMonthYear(anchor.getFullYear(), anchor.getMonth() + 1)
    return String(anchor.getFullYear())
  }, [mode, anchor])

  const { periodTx, series } = useMemo(() => {
    if (mode === 'week') {
      const { start, end } = getWeekRange(anchor)
      const tx = filterByRange(transactions, start, end)
      return { periodTx: tx, series: weeklyDailySeries(transactions, start) }
    }
    if (mode === 'month') {
      const y = anchor.getFullYear()
      const m = anchor.getMonth() + 1
      const start = new Date(y, m - 1, 1, 0, 0, 0)
      const end = new Date(y, m, 0, 23, 59, 59)
      const tx = filterByRange(transactions, start, end)
      return { periodTx: tx, series: monthlyDailySeries(transactions, y, m) }
    }
    const y = anchor.getFullYear()
    const start = new Date(y, 0, 1, 0, 0, 0)
    const end = new Date(y, 11, 31, 23, 59, 59)
    const tx = filterByRange(transactions, start, end)
    return { periodTx: tx, series: yearlyMonthlySeries(transactions, y).map((s) => ({ ...s, label: s.label })) }
  }, [mode, anchor, transactions])

  const totals = useMemo(() => summarize(periodTx), [periodTx])
  const expenseBreakdown = useMemo(() => categoryBreakdown(periodTx, 'expense'), [periodTx])
  const totalExpense = totals.expense || 1

  const shiftPeriod = (delta) => {
    const d = new Date(anchor)
    if (mode === 'week') d.setDate(d.getDate() + delta * 7)
    else if (mode === 'month') d.setMonth(d.getMonth() + delta)
    else d.setFullYear(d.getFullYear() + delta)
    setAnchor(d)
  }

  const chartMargin = mode === 'month'
    ? { left: -20, right: 8, top: 8, bottom: 0 }
    : { left: -10, right: 8, top: 8, bottom: 0 }

  return (
    <div className="mx-auto max-w-md px-5 pb-28 pt-5">
      <h1 className="font-display mb-5 text-2xl text-ink">Laporan</h1>

      <div className="mb-5 flex rounded-xl border border-border p-1">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              mode === m.key ? 'bg-accent text-white' : 'text-muted'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mb-5 flex items-center justify-between">
        <button onClick={() => shiftPeriod(-1)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className="text-sm font-medium capitalize text-ink">{periodLabel}</span>
        <button onClick={() => shiftPeriod(1)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-surface p-3">
          <p className="text-[10px] font-medium uppercase text-muted">Masuk</p>
          <p className="font-mono-num mt-1 text-sm font-semibold text-income">{formatCompactRupiah(totals.income)}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3">
          <p className="text-[10px] font-medium uppercase text-muted">Keluar</p>
          <p className="font-mono-num mt-1 text-sm font-semibold text-expense">{formatCompactRupiah(totals.expense)}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3">
          <p className="text-[10px] font-medium uppercase text-muted">Bersih</p>
          <p className={`font-mono-num mt-1 text-sm font-semibold ${totals.net >= 0 ? 'text-income' : 'text-expense'}`}>
            {formatCompactRupiah(totals.net)}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border p-4">
        <p className="mb-3 text-sm font-semibold text-ink">Arus kas per {mode === 'week' ? 'hari' : mode === 'month' ? 'tanggal' : 'bulan'}</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={series} margin={chartMargin} barGap={2}>
            <CartesianGrid vertical={false} stroke={colors.grid} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: colors.tick }}
              axisLine={{ stroke: colors.grid }}
              tickLine={false}
              interval={mode === 'month' ? 4 : 0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: colors.tick }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCompactRupiah}
              width={44}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: colors.cursor }} />
            <Bar dataKey="income" name="Pemasukan" fill={colors.income} radius={[3, 3, 0, 0]} maxBarSize={mode === 'month' ? 6 : 14} />
            <Bar dataKey="expense" name="Pengeluaran" fill={colors.expense} radius={[3, 3, 0, 0]} maxBarSize={mode === 'month' ? 6 : 14} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6 rounded-2xl border border-border p-4">
        <p className="mb-3 text-sm font-semibold text-ink">Pengeluaran per kategori</p>
        {expenseBreakdown.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">Belum ada pengeluaran periode ini.</p>
        ) : (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={32}
                  outerRadius={58}
                  paddingAngle={2}
                  stroke="none"
                >
                  {expenseBreakdown.map((_, i) => (
                    <Cell key={i} fill={colors.pie[i % colors.pie.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {expenseBreakdown.slice(0, 6).map((c, i) => (
                <div key={c.category} className="flex items-center justify-between gap-2 text-xs cursor-pointer hover:bg-surface" onClick={() => setSelectedCategory(c.category)}>
                  <span className="flex min-w-0 items-center gap-1.5 text-ink">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: colors.pie[i % colors.pie.length] }} />
                    <span className="truncate">{c.category}</span>
                  </span>
                  <span className="font-mono-num shrink-0 text-muted">
                    {((c.amount / totalExpense) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border p-4">
        <p className="mb-3 text-sm font-semibold text-ink">Rincian kategori</p>
        <div className="divide-y divide-border">
          {expenseBreakdown.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted">Tidak ada data.</p>
          ) : (
            expenseBreakdown.map((c) => (
              <div key={c.category} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-ink">{c.category}</span>
                <span className="font-mono-num font-medium text-expense">{formatRupiah(c.amount)}</span>
              </div>
            ))
          )}
        {selectedCategory && (
          <Modal title={selectedCategory} onClose={() => setSelectedCategory(null)}>
            <div className="max-h-[70vh] overflow-y-auto">
              {periodTx.filter((tx) => tx.category === selectedCategory).length === 0 ? (
                <p className="py-4 text-center text-sm text-muted">Tidak ada transaksi untuk kategori ini.</p>
              ) : (
                periodTx
                  .filter((tx) => tx.category === selectedCategory)
                  .map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex flex-col">
                        <span className="font-medium text-ink">{tx.text}</span>
                        <span className="text-xs text-muted">
                          {formatTime(tx.datetime)}{tx.payment_method ? ` • ${tx.payment_method}` : ''}
                        </span>
                      </div>
                      <span className={`font-mono-num ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {tx.type === 'income' ? '+' : '-'} {formatRupiah(tx.amount)}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}

