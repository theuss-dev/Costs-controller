'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function addTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: account } = await supabase.from('account').select('household_id').eq('id', user.id).single()
  if (!account?.household_id) return { error: "Sem casa configurada" }

  const amountStr = formData.get('amount') as string
  const category = formData.get('categoryId') as string
  const customCategory = formData.get('customCategory') as string
  const payerId = formData.get('payerId') as string
  const exceedReason = formData.get('exceedReason') as string
  const customReason = formData.get('customReason') as string

  const amount = parseFloat(amountStr.replace(",", ".")) || 0

  let description = category
  if (category === 'other' && customCategory) {
    description = customCategory
  }
  
  if (exceedReason || customReason) {
    description += ` (Excedeu: ${exceedReason || customReason})`
  }

  const { error } = await supabase.from('transactions').insert({
    amount,
    category,
    description,
    paid_by: payerId,
    household_id: account.household_id
  })

  if (error) {
    console.error("Error inserting transaction", error)
    return { error: "Erro ao salvar o gasto" }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
