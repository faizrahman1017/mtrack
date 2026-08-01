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
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...tx, user_id: userId }])
      .select()
      .single()
    if (error) throw error
    setTransactions((prev) => [data, ...prev].sort((a, b) => new Date(b.datetime) - new Date(a.datetime)))
    return data
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
