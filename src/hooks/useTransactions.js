import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('datetime', { ascending: false })
    if (error) {
      setError(error.message)
    } else {
      setTransactions(data)
      setError(null)
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const addTransaction = async (tx) => {
    // Insert main transaction (expense or income)
    const { data: mainData, error: mainError } = await supabase
      .from('transactions')
      .insert([{ ...tx, user_id: userId }])
      .select()
      .single()
    if (mainError) throw mainError

    // Prepare list of transactions to add to state (main transaction first)
    let newTransactions = [mainData]

    // Auto-create income entry for specific transfer categories
    if (
      tx.type === 'expense' &&
      (tx.category === 'Transfer ke Cash' || tx.category === 'Transfer ke e-Money')
    ) {
      const targetGroup = tx.category === 'Transfer ke Cash' ? 'cash' : 'emoney'
      const targetPaymentMethod = targetGroup === 'cash' ? 'Cash' : 'E-Money'
      const incomeTx = {
        type: 'income',
        datetime: tx.datetime,
        // Use a clear category for the auto-generated income
        category: `Transfer masuk ${targetGroup === 'cash' ? 'Cash' : 'e-Money'}`,
        text: tx.text,
        amount: tx.amount,
        payment_method: targetPaymentMethod,
      }
      const { data: incomeData, error: incomeError } = await supabase
        .from('transactions')
        .insert([{ ...incomeTx, user_id: userId }])
        .select()
        .single()
      if (incomeError) throw incomeError
      newTransactions.push(incomeData)
    }

    // Update state with any new transactions, keeping newest first
    setTransactions((prev) =>
      [...newTransactions, ...prev]
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
    )
    return mainData
  }

  const updateTransaction = async (id, updates) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? data : t)).sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
    )
    return data
  }

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) throw error
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction, refetch: fetchAll }
}
