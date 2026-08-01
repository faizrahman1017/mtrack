import { useMemo, useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useTransactions } from './hooks/useTransactions'
import Login from './pages/Login'
import CatatPage from './pages/CatatPage'
import RiwayatPage from './pages/RiwayatPage'
import LaporanPage from './pages/LaporanPage'
import BalanceHeader from './components/BalanceHeader'
import BottomNav from './components/BottomNav'
import Modal from './components/Modal'
import TransactionForm from './components/TransactionForm'

function AppShell({ user, signOut }) {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions(user.id)
  const [tab, setTab] = useState('catat')
  const [editingTx, setEditingTx] = useState(null)

  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0)
  }, [transactions])

  const handleDelete = async (id) => {
    await deleteTransaction(id)
  }

  return (
    <div className="min-h-dvh bg-bg">
      <BalanceHeader totalBalance={totalBalance} userEmail={user.email} onSignOut={signOut} />

      {loading ? (
        <div className="flex items-center justify-center py-24 text-sm text-muted">Memuat data…</div>
      ) : (
        <>
          {tab === 'catat' && (
            <CatatPage
              transactions={transactions}
              onAdd={addTransaction}
              onEdit={setEditingTx}
              onDelete={(tx) => { if (confirm(`Hapus "${tx.text}"?`)) handleDelete(tx.id) }}
            />
          )}
          {tab === 'riwayat' && (
            <RiwayatPage
              transactions={transactions}
              onUpdate={updateTransaction}
              onDelete={handleDelete}
            />
          )}
          {tab === 'laporan' && <LaporanPage transactions={transactions} />}
        </>
      )}

      <BottomNav active={tab} onChange={setTab} />

      {editingTx && (
        <Modal title="Edit transaksi" onClose={() => setEditingTx(null)}>
          <TransactionForm
            initial={editingTx}
            onSubmit={async (updates) => {
              await updateTransaction(editingTx.id, updates)
              setEditingTx(null)
            }}
            onCancel={() => setEditingTx(null)}
            submitLabel="Simpan Perubahan"
          />
        </Modal>
      )}
    </div>
  )
}

export default function App() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg">
        <p className="text-sm text-muted">Memuat…</p>
      </div>
    )
  }

  if (!user) return <Login />

  return <AppShell user={user} signOut={signOut} />
}
