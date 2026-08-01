import { useMemo, useState } from 'react'
import DayStrip from '../components/DayStrip'
import TransactionItem from '../components/TransactionItem'
import Modal from '../components/Modal'
import TransactionForm from '../components/TransactionForm'
import { formatDateLong, formatMonthYear, formatRupiah, toDateKey } from '../lib/format'

export default function RiwayatPage({ transactions, onUpdate, onDelete }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState(toDateKey(today))
  const [editingTx, setEditingTx] = useState(null)
  const [filter, setFilter] = useState('all')

  const shiftMonth = (delta) => {
    let m = month + delta
    let y = year
    if (m > 12) { m = 1; y += 1 }
    if (m < 1) { m = 12; y -= 1 }
    setYear(y)
    setMonth(m)
    setSelectedDate(toDateKey(new Date(y, m - 1, 1)))
  }

  const dayTx = useMemo(() => {
    const filtered = transactions.filter((t) => toDateKey(t.datetime) === selectedDate)
    const sorted = filtered.sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
    return filter === 'all' ? sorted : sorted.filter((t) => t.type === filter)
  }, [transactions, selectedDate, filter])

  const dayTotals = useMemo(() => {
    const list = transactions.filter((t) => toDateKey(t.datetime) === selectedDate)
    const income = list.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0)
    const expense = list.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    return { income, expense, net: income - expense }
  }, [transactions, selectedDate])

  const handleUpdate = async (updates) => {
    await onUpdate(editingTx.id, updates)
    setEditingTx(null)
  }

  const handleDelete = (tx) => {
    if (confirm(`Hapus "${tx.text}"?`)) onDelete(tx.id)
  }

  return (
    <div className="pb-28 pt-5">
      <div className="mx-auto max-w-md px-5">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-2xl text-ink">Riwayat</h1>
          <div className="flex items-center gap-1">
            <button onClick={() => shiftMonth(-1)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span className="w-32 text-center text-sm font-medium capitalize text-ink">{formatMonthYear(year, month)}</span>
            <button onClick={() => shiftMonth(1)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>

      <DayStrip
        year={year}
        month={month}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        transactions={transactions}
      />

      <div className="mx-auto max-w-md px-5">
        <div className="mt-5 mb-4 rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs font-medium capitalize text-muted">{formatDateLong(selectedDate)}</p>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted">Masuk </span>
              <span className="font-mono-num text-xs font-semibold text-income">{formatRupiah(dayTotals.income)}</span>
              <span className="mx-1.5 text-border">·</span>
              <span className="text-[11px] text-muted">Keluar </span>
              <span className="font-mono-num text-xs font-semibold text-expense">{formatRupiah(dayTotals.expense)}</span>
            </div>
            <span className={`font-mono-num text-sm font-bold ${dayTotals.net >= 0 ? 'text-income' : 'text-expense'}`}>
              {formatRupiah(dayTotals.net, { withSign: true })}
            </span>
          </div>
        </div>

        <div className="mb-3 flex gap-2">
          {[
            { key: 'all', label: 'Semua' },
            { key: 'income', label: 'Pemasukan' },
            { key: 'expense', label: 'Pengeluaran' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === f.key ? 'bg-accent text-white' : 'bg-surface text-muted'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {dayTx.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-10 text-center">
            <p className="text-sm text-muted">Belum ada transaksi di hari ini.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-bg px-4">
            {dayTx.map((tx) => (
              <TransactionItem key={tx.id} tx={tx} onEdit={setEditingTx} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {editingTx && (
        <Modal title="Edit transaksi" onClose={() => setEditingTx(null)}>
          <TransactionForm
            initial={editingTx}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTx(null)}
            submitLabel="Simpan Perubahan"
          />
        </Modal>
      )}
    </div>
  )
}
