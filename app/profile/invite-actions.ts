'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function cancelInvite(inviteId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autorizado" }

  // ── SECURITY FIX: Validate inviteId is a valid UUID format ─────────────────
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(inviteId)) {
    return { error: "ID de convite inválido." }
  }
  // ────────────────────────────────────────────────────────────────────────────

  const { error } = await supabase
    .from('invites')
    .delete()
    .eq('id', inviteId)
    .eq('sender_id', user.id) // Ensures only the sender can cancel their own invite

  if (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("Error canceling invite:", error)
    }
    return { error: "Erro ao cancelar o convite" }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function sendNewInvite(partnerEmail: string, partnerContributionStr: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autorizado" }

  // ── SECURITY FIX: Input Validation ─────────────────────────────────────────
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const sanitizedEmail = partnerEmail.toLowerCase().trim()

  if (!emailRegex.test(sanitizedEmail)) {
    return { error: "E-mail do parceiro inválido." }
  }

  // Prevent self-invitation
  if (sanitizedEmail === user.email?.toLowerCase()) {
    return { error: "Você não pode convidar a si mesmo." }
  }
  // ────────────────────────────────────────────────────────────────────────────

  const { data: account } = await supabase.from('account').select('household_id').eq('id', user.id).single()
  if (!account?.household_id) return { error: "Você não possui um casal configurado." }

  const partnerContribution = parseFloat(partnerContributionStr.replace(/\./g, '').replace(',', '.')) || 0

  if (partnerContribution < 0) {
    return { error: "Contribuição não pode ser negativa." }
  }

  const { error } = await supabase.from('invites').insert({
    sender_id: user.id,
    receiver_email: sanitizedEmail,
    household_id: account.household_id,
    status: 'pending',
    partner_contribution: partnerContribution
  })

  if (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("Error sending invite:", error)
    }
    return { error: "Erro ao enviar o convite. Verifique se o e-mail já não foi convidado." }
  }

  revalidatePath('/profile')
  return { success: true }
}
