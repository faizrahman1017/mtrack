import { formatRupiah } from '../lib/format'

export default function BalanceHeader({ totalBalance, cashBalance, rekeningBalance, userEmail, onSignOut }) {
  return (
    <div className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto max-w-md px-5 pb-4 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M4 16 L10 8 L14 12 L20 5" stroke="#DE9F4E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-display text-lg text-ink">M-Track</span>
          </div>
          <button
            onClick={onSignOut}
            title={userEmail}
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-surface hover:text-ink"
          >
            Keluar
          </button>
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Saldo keseluruhan</p>
        <p className="font-mono-num font-display mt-0.5 text-[28px] leading-tight text-ink">
          {formatRupiah(totalBalance)}
        </p>
        {(cashBalance !== undefined && rekeningBalance !== undefined) && (
          <div className="mt-2 flex gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="text-muted">Cash</span>
              <span className="font-mono-num font-medium text-ink">{formatRupiah(cashBalance)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-muted">Rekening</span>
              <span className="font-mono-num font-medium text-ink">{formatRupiah(rekeningBalance)}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
