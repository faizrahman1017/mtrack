const TABS = [
  {
    key: 'catat',
    label: 'Catat',
    icon: (active) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke={active ? '#0F6E5E' : '#6E756B'} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'riwayat',
    label: 'Riwayat',
    icon: (active) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" stroke={active ? '#0F6E5E' : '#6E756B'} strokeWidth="2" />
        <path d="M3.5 9.5h17M8 3v3M16 3v3" stroke={active ? '#0F6E5E' : '#6E756B'} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'laporan',
    label: 'Laporan',
    icon: (active) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <path d="M4 20V12M11 20V4M18 20v-7" stroke={active ? '#0F6E5E' : '#6E756B'} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 transition"
            >
              {tab.icon(isActive)}
              <span className={`text-[11px] font-medium ${isActive ? 'text-accent' : 'text-muted'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
