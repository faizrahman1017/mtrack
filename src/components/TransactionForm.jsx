import { useEffect, useState } from 'react'
import { CATEGORIES, PAYMENT_METHODS } from '../lib/categories'

const toLocalInputValue = (date) => {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

const emptyState = (type, presetDate) => ({
  type,
  datetime: presetDate ? toLocalInputValue(presetDate) : toLocalInputValue(new Date()),
  category: CATEGORIES[type][0],
  customCategory: '',
  text: '',
  amount: '',
  paymentMethod: PAYMENT_METHODS[0],
})

export default function TransactionForm({ initial, presetDate, onSubmit, onCancel, submitLabel }) {
  const [type, setType] = useState(initial?.type || 'expense')
  const [form, setForm] = useState(() => {
    if (initial) {
      const isCustom = !CATEGORIES[initial.type].includes(initial.category) || initial.category === 'Custom'
      return {
        type: initial.type,
        datetime: toLocalInputValue(initial.datetime),
        category: isCustom ? 'Custom' : initial.category,
        customCategory: isCustom ? initial.category : '',
        text: initial.text,
        amount: String(initial.amount),
        paymentMethod: initial.payment_method || PAYMENT_METHODS[0],
      }
    }
    return emptyState(type, presetDate)
  })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!initial) {
      setForm((f) => ({ ...emptyState(type, presetDate), text: f.text }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!form.text.trim() || !form.amount || !form.datetime) {
      setError('Lengkapi seluruh formulir.')
      return
    }
    if (form.category === 'Custom' && !form.customCategory.trim()) {
      setError('Isi nama kategori custom-nya.')
      return
    }
    const amountNum = Number(form.amount)
    if (!(amountNum > 0)) {
      setError('Jumlah harus lebih dari 0.')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({
        type,
        datetime: new Date(form.datetime).toISOString(),
        category: form.category === 'Custom' ? form.customCategory.trim() : form.category,
        text: form.text.trim(),
        amount: amountNum,
        payment_method: type === 'expense' ? form.paymentMethod : null,
      })
      if (!initial) {
        setForm(emptyState(type, presetDate))
      }
    } catch (err) {
      setError(err.message || 'Gagal menyimpan transaksi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex rounded-xl border border-border p-1">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
            type === 'expense' ? 'bg-expense text-white' : 'text-muted'
          }`}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
            type === 'income' ? 'bg-income text-white' : 'text-muted'
          }`}
        >
          Pemasukan
        </button>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Waktu</label>
        <input
          type="datetime-local"
          required
          value={form.datetime}
          onChange={handleChange('datetime')}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Kategori</label>
        <select
          value={form.category}
          onChange={handleChange('category')}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
        >
          {CATEGORIES[type].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {form.category === 'Custom' && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Nama kategori custom</label>
          <input
            type="text"
            value={form.customCategory}
            onChange={handleChange('customCategory')}
            placeholder="Cth: Donasi, Servis Motor…"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
          />
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Keterangan</label>
        <input
          type="text"
          required
          value={form.text}
          onChange={handleChange('text')}
          placeholder={type === 'expense' ? 'Cth: Beli kopi, tiket kereta…' : 'Cth: Gaji bulanan…'}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Jumlah (Rp)</label>
        <input
          type="number"
          required
          min="1"
          inputMode="numeric"
          value={form.amount}
          onChange={handleChange('amount')}
          placeholder="50000"
          className="font-mono-num w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
      </div>

      {type === 'expense' && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Metode pembayaran</label>
          <select
            value={form.paymentMethod}
            onChange={handleChange('paymentMethod')}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="rounded-lg bg-expense-soft px-3 py-2 text-sm text-expense">{error}</p>}

      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-ink transition hover:bg-surface"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className={`flex-1 rounded-xl py-3 text-sm font-semibold text-white transition disabled:opacity-60 ${
            type === 'expense' ? 'bg-expense hover:opacity-90' : 'bg-income hover:opacity-90'
          }`}
        >
          {submitting ? 'Menyimpan…' : submitLabel || (type === 'expense' ? 'Simpan Pengeluaran' : 'Simpan Pemasukan')}
        </button>
      </div>
    </form>
  )
}
