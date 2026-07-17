import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileClient from './profile-client'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: currentAccount } = await supabase.from('account').select('*').eq('id', user.id).single()
  if (!currentAccount || !currentAccount.household_id) {
    return <div className="p-6 text-white">Erro: Sem casa configurada.</div>
  }

  const TOTAL_LIMIT = currentAccount.monthly_budget || 600
  const WEEKLY_LIMIT = TOTAL_LIMIT / 4
  const LIMIT_PER_PERSON = TOTAL_LIMIT / 2 // Simple hardcoded split for now

  // Fetch all accounts in household
  const { data: allAccounts } = await supabase.from('account').select('*').eq('household_id', currentAccount.household_id).order('created_at', { ascending: true })
  
  // Fetch transactions for the month
  const now = new Date()
  const currentMonth = now.getMonth()
  const { data: recentTxs } = await supabase.from('transactions').select('*').eq('household_id', currentAccount.household_id)
  
  const monthTxs = (recentTxs || []).filter(t => new Date(t.created_at).getMonth() === currentMonth)

  const colors = ["bg-orange-500", "bg-purple-500", "bg-emerald-500", "bg-blue-500"]

  const members = (allAccounts || []).map((acc, idx) => {
    const spent = monthTxs.filter(t => t.paid_by === acc.id).reduce((sum, t) => sum + Number(t.amount), 0)
    
    return {
      name: acc.name || 'Desconhecido',
      initial: acc.name ? acc.name.charAt(0).toUpperCase() : 'U',
      color: colors[idx % colors.length],
      spent,
      limit: LIMIT_PER_PERSON
    }
  })

  return (
    <ProfileClient 
      members={members}
      totalLimit={TOTAL_LIMIT}
      weeklyLimit={WEEKLY_LIMIT}
      userName={currentAccount.name || ''}
      userEmail={currentAccount.email || ''}
      userInitial={currentAccount.name ? currentAccount.name.charAt(0).toUpperCase() : 'U'}
    />
  )
}
