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
  const dateStr = formData.get('date') as string

  // ── SECURITY FIX: IDOR Prevention ──────────────────────────────────────────
  // Validate that payerId belongs to the same household as the logged-in user.
  // Without this, any authenticated user could forge a payerId and insert
  // transactions attributed to users in other households.
  if (!payerId) return { error: "Pagador não informado." }

  const { data: payerAccount, error: payerErr } = await supabase
    .from('account')
    .select('id')
    .eq('id', payerId)
    .eq('household_id', account.household_id) // Must belong to same household
    .single()

  if (payerErr || !payerAccount) {
    return { error: "Pagador inválido ou não pertence ao seu casal." }
  }
  // ────────────────────────────────────────────────────────────────────────────

  // ── SECURITY FIX: Input Validation ─────────────────────────────────────────
  const validCategories = ['food', 'leisure', 'transport', 'groceries', 'other', 'restaurant', 'shopping']
  const safeCategory = validCategories.includes(category) ? category : 'other'
  // ────────────────────────────────────────────────────────────────────────────

  // Remove dots (thousands separator) and replace comma with dot
  const cleanAmount = amountStr.replace(/\./g, '').replace(',', '.')
  const amount = parseFloat(cleanAmount) || 0

  if (amount <= 0) return { error: "Valor inválido." }

  let description = safeCategory
  if (safeCategory === 'other' && customCategory) {
    // Sanitize: limit length and strip potential injection characters
    description = customCategory.trim().slice(0, 100)
  }

  if (exceedReason || customReason) {
    description += ` (Excedeu: ${(exceedReason || customReason).trim().slice(0, 200)})`
  }

  const payload = {
    amount,
    category: safeCategory,
    description,
    paid_by: payerId,
    household_id: account.household_id
  }

  // Validate date: only allow past or today, prevent future-dated transactions
  if (dateStr) {
    const inputDate = new Date(dateStr)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    if (!isNaN(inputDate.getTime()) && inputDate <= today) {
      Object.assign(payload, { created_at: `${dateStr}T12:00:00Z` })
    }
  }

  const { error } = await supabase.from('transactions').insert(payload)

  if (error) {
    // Log full error only in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      console.error("Error inserting transaction:", error)
    }
    return { error: "Erro ao salvar o gasto" }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
