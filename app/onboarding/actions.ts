'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createHousehold(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado." }

  const myContrib = parseFloat(formData.get('myContrib') as string) || 0
  const partnerContrib = parseFloat(formData.get('partnerContrib') as string) || 0
  const partnerEmail = formData.get('partnerEmail') as string

  // Call RPC to create household, update account and insert invite safely (bypassing RLS issues)
  const { error: rpcErr } = await supabase.rpc('setup_household', {
    my_contrib: myContrib,
    partner_contrib: partnerContrib,
    partner_email: partnerEmail || null
  })

  if (rpcErr) return { error: "Erro ao criar casal." }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function acceptInvite(inviteId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado." }

  // 1. Fetch invite
  const { data: invite, error: invErr } = await supabase.from('invites').select('*').eq('id', inviteId).single()
  if (invErr || !invite) return { error: "Convite não encontrado." }

  // 2. Update my account
  await supabase.from('account').update({ 
    household_id: invite.household_id,
    contribution: invite.partner_contribution
  }).eq('id', user.id)

  // 3. Update invite status
  await supabase.from('invites').update({ status: 'accepted' }).eq('id', inviteId)

  revalidatePath('/', 'layout')
  redirect('/')
}
