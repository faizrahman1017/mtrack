import { toDateKey } from './format'

const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
]

export function getWeekRange(anchor) {
  const d = new Date(anchor)
  const day = d.getDay() // 0 = Sunday
  const diffToMonday = day === 0 ? -6 : 1 - day
  const start = new Date(d)
  start.setDate(d.getDate() + diffToMonday)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export function filterByRange(transactions, start, end) {
  return transactions.filter((t) => {
    const d = new Date(t.datetime)
    return d >= start && d <= end
  })
}

export function summarize(transactions) {
  const income = transactions.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const expense = transactions.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  return { income, expense, net: income - expense }
}

export function categoryBreakdown(transactions, type) {
  const map = {}
  transactions
    .filter((t) => t.type === type)
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export function weeklyDailySeries(transactions, start) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const key = toDateKey(d)
    const dayTx = transactions.filter((t) => toDateKey(t.datetime) === key)
    const income = dayTx.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0)
    const expense = dayTx.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    return { label: DAY_LABELS[d.getDay()], key, income, expense }
  })
}

export function monthlyDailySeries(transactions, year, month) {
  const daysInMonth = new Date(year, month, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const key = toDateKey(new Date(year, month - 1, day))
    const dayTx = transactions.filter((t) => toDateKey(t.datetime) === key)
    const income = dayTx.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0)
    const expense = dayTx.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    return { label: String(day), key, income, expense }
  })
}

export function yearlyMonthlySeries(transactions, year) {
  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1
    const monthTx = transactions.filter((t) => {
      const d = new Date(t.datetime)
      return d.getFullYear() === year && d.getMonth() + 1 === m
    })
    const income = monthTx.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0)
    const expense = monthTx.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    return { label: MONTH_LABELS[i], month: m, income, expense }
  })
}
