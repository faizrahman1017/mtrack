import { formatRupiah, formatTime } from '../lib/format'

export default function TransactionItem({ tx, onEdit, onDelete }) {
  const isIncome = tx.type === 'income'
  return (
    <div className="group flex items-center gap-3 border-b border-border py-3.5 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{tx.text}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <span className="rounded-full bg-surface px-2 py-0.5">{tx.category}</span>
          {tx.payment_method && (
            <span className="rounded-full bg-gold-soft px-2 py-0.5 text-gold">{tx.payment_method}</span>
          )}
          <span>{formatTime(tx.datetime)}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className={`font-mono-num text-sm font-semibold ${isIncome ? 'text-income' : 'text-expense'}`}>
          {isIncome ? '+' : '-'} {formatRupiah(tx.amount)}
        </span>
        <div className="flex gap-1 opacity-0 transition group-hover:opacity-100 group-active:opacity-100 sm:opacity-100">
          <button
            onClick={() => onEdit(tx)}
            className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-muted hover:bg-surface hover:text-accent"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(tx)}
            className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-muted hover:bg-expense-soft hover:text-expense"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
