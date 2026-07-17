import { createClient } from '@/utils/supabase/server'
import HomeClient, { type WeekendData } from './home-client'
import { redirect } from 'next/navigation'
import { type TransactionCardProps } from '@/components/TransactionCard'
import { format, isSameWeek, parseISO, startOfMonth, endOfMonth, eachWeekOfInterval, getWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function Home() {
  const supabase = await createClient()

  // 1. Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Fetch User's account to get household_id and monthly_budget
  const { data: account } = await supabase.from('account').select('*').eq('id', user.id).single()
  
  if (!account || !account.household_id) {
    return <div className="text-white p-6">Erro: Conta não vinculada a uma Casa.</div>
  }

  // 3. Fetch Transactions for the household
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, account(name)')
    .eq('household_id', account.household_id)
    .order('created_at', { ascending: false })

  const txs = transactions || []

  // 4. Process Data
  const TOTAL_LIMIT = account.monthly_budget || 600
  const WEEKLY_LIMIT = TOTAL_LIMIT / 4

  const mapTx = (t: any): TransactionCardProps => ({
    id: String(t.id),
    title: t.description,
    date: format(parseISO(t.created_at), "E, d MMM", { locale: ptBR }),
    amount: Number(t.amount),
    type: "expense",
    category: t.category as any,
    payerId: t.paid_by,
    payerName: t.account?.name || "Desconhecido"
  })

  const allRecent = txs.slice(0, 10).map(mapTx)

  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 })

  const weekends: WeekendData[] = weeks.map((weekDate, idx) => {
    const weekTxs = txs.filter(t => isSameWeek(parseISO(t.created_at), weekDate, { weekStartsOn: 1 }))
    const total = weekTxs.reduce((acc, t) => acc + Number(t.amount), 0)
    
    return {
      label: `${idx + 1}º Final de Semana`,
      dates: `Semana ${getWeek(weekDate, { weekStartsOn: 1 })}`,
      total,
      transactions: weekTxs.map(mapTx)
    }
  }).filter(w => w.total > 0 || w.label.startsWith('1º'))

  const currentWeekDate = new Date()
  const currentWeekTxs = txs.filter(t => isSameWeek(parseISO(t.created_at), currentWeekDate, { weekStartsOn: 1 }))
  const currentWeekSpent = currentWeekTxs.reduce((acc, t) => acc + Number(t.amount), 0)

  const userInitial = account.name ? account.name.charAt(0).toUpperCase() : "U"

  return (
    <HomeClient 
      currentWeekSpent={currentWeekSpent}
      weeklyLimit={WEEKLY_LIMIT}
      weekends={weekends}
      allRecent={allRecent}
      userInitial={userInitial}
    />
  )
}
