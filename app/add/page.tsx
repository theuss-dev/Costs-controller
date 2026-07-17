import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AddClient from './add-client'
import { isSameWeek, parseISO } from 'date-fns'

export default async function AddTransactionPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: currentAccount } = await supabase.from('account').select('*').eq('id', user.id).single()
  if (!currentAccount || !currentAccount.household_id) {
    return <div className="p-6 text-white">Erro: Sem casa configurada.</div>
  }

  const TOTAL_LIMIT = currentAccount.monthly_budget || 600
  const WEEKLY_LIMIT = TOTAL_LIMIT / 4

  const { data: allAccounts } = await supabase.from('account').select('*').eq('household_id', currentAccount.household_id).order('created_at', { ascending: true })
  
  const colors = ["bg-orange-500", "bg-purple-500", "bg-emerald-500", "bg-blue-500"]
  const accountsData = (allAccounts || []).map((acc, idx) => ({
    id: acc.id,
    name: acc.name,
    initial: acc.name ? acc.name.charAt(0).toUpperCase() : "U",
    color: colors[idx % colors.length]
  }))

  const { data: recentTxs } = await supabase.from('transactions').select('*').eq('household_id', currentAccount.household_id).order('created_at', { ascending: false }).limit(100)
  
  const now = new Date()
  const monthTxs = (recentTxs || []).filter(t => new Date(t.created_at).getMonth() === now.getMonth())
  const monthSpent = monthTxs.reduce((acc, t) => acc + Number(t.amount), 0)
  const REMAINING = TOTAL_LIMIT - monthSpent

  return (
    <AddClient 
      accounts={accountsData} 
      weeklyLimit={WEEKLY_LIMIT} 
      remainingLimit={REMAINING} 
    />
  )
}
