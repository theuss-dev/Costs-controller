'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function cancelInvite(inviteId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autorizado" }

  const { error } = await supabase
    .from('invites')
    .delete()
    .eq('id', inviteId)
    .eq('sender_id', user.id)

  if (error) {
    console.error("Error canceling invite:", error)
    return { error: "Erro ao cancelar o convite" }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function sendNewInvite(partnerEmail: string, partnerContributionStr: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autorizado" }

  const { data: account } = await supabase.from('account').select('household_id').eq('id', user.id).single()
  if (!account?.household_id) return { error: "Você não possui um casal configurado." }

  const partnerContribution = parseFloat(partnerContributionStr.replace(/\./g, '').replace(',', '.')) || 0

  const { error } = await supabase.from('invites').insert({
    sender_id: user.id,
    receiver_email: partnerEmail.toLowerCase().trim(),
    household_id: account.household_id,
    status: 'pending',
    partner_contribution: partnerContribution
  })

  if (error) {
    console.error("Error sending invite:", error)
    return { error: "Erro ao enviar o convite. Verifique se o e-mail já não foi convidado." }
  }

  revalidatePath('/profile')
  return { success: true }
}
