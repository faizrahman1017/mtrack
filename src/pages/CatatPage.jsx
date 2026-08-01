import { useMemo } from 'react'
import TransactionForm from '../components/TransactionForm'
import TransactionItem from '../components/TransactionItem'
import { toDateKey } from '../lib/format'

export default function CatatPage({ transactions, onAdd, onEdit, onDelete }) {
  const todayKey = toDateKey(new Date())
  const todayTx = useMemo(
    () => transactions.filter((t) => toDateKey(t.datetime) === todayKey),
    [transactions, todayKey]
  )

  return (
    <div className="mx-auto max-w-md px-5 pb-28 pt-5">
      <h1 className="font-display mb-5 text-2xl text-ink">Catat transaksi</h1>
      <TransactionForm onSubmit={onAdd} />

      {todayTx.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-2 text-sm font-semibold text-ink">Tercatat hari ini</h2>
          <div className="rounded-2xl border border-border bg-bg px-4">
            {todayTx.map((tx) => (
              <TransactionItem key={tx.id} tx={tx} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
