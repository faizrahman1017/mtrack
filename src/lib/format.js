export const formatRupiah = (amount, { withSign = false } = {}) => {
  const value = Math.abs(amount || 0)
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
  if (!withSign) return formatted
  return amount < 0 ? `-${formatted}` : `+${formatted}`
}

export const formatCompactRupiah = (amount) => {
  const value = Math.abs(amount || 0)
  if (value >= 1_000_000_000) return `Rp${(value / 1_000_000_000).toFixed(1)}M`
  if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)}jt`
  if (value >= 1_000) return `Rp${(value / 1_000).toFixed(0)}rb`
  return `Rp${value}`
}

export const toDateKey = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatDateLong = (dateKey) => {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const formatDateShort = (dateKey) => {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}

export const formatTime = (datetime) => {
  return new Date(datetime).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatMonthYear = (year, month) => {
  return new Date(year, month - 1, 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })
}

export const getISOWeek = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
}
