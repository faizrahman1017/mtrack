import { formatRupiah } from '../lib/format'
import { useTheme } from '../hooks/useTheme'

function BalanceItem({ dot, label, value }) {
  return (
    <div className="flex shrink-0 items-start gap-1.5">
      <span className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
      <div className="leading-tight">
        <p className="whitespace-nowrap text-[11px] text-muted">{label}</p>
        <p className="font-mono-num whitespace-nowrap text-[13px] font-medium text-ink">
          {formatRupiah(value)}
        </p>
      </div>
    </div>
  )
}

export default function BalanceHeader({ totalBalance, cashBalance, rekeningBalance, emoneyBalance, userEmail, onSignOut }) {
  const { theme, toggleTheme } = useTheme()

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
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-ink"
            >
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <button
              onClick={onSignOut}
              title={userEmail}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-surface hover:text-ink"
            >
              Keluar
            </button>
          </div>
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Saldo keseluruhan</p>
        <p className="font-mono-num font-display mt-0.5 text-[28px] leading-tight text-ink">
          {formatRupiah(totalBalance)}
        </p>
        {(cashBalance !== undefined && rekeningBalance !== undefined && emoneyBalance !== undefined) && (
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2.5">
            <BalanceItem dot="bg-gold" label="Cash" value={cashBalance} />
            <BalanceItem dot="bg-accent" label="Rekening" value={rekeningBalance} />
            <BalanceItem dot="bg-sky-400" label="e-Money" value={emoneyBalance} />
          </div>
        )}
      </div>
    </div>
  )
}