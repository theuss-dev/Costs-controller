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

  // ── SECURITY FIX: Input Validation ─────────────────────────────────────────
  if (myContrib < 0 || partnerContrib < 0) {
    return { error: "Contribuição não pode ser negativa." }
  }

  // Sanitize partner email: must be a valid email format if provided
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (partnerEmail && !emailRegex.test(partnerEmail)) {
    return { error: "E-mail do parceiro inválido." }
  }

  // Prevent user from inviting themselves
  if (partnerEmail && partnerEmail.toLowerCase() === user.email?.toLowerCase()) {
    return { error: "Você não pode convidar a si mesmo." }
  }
  // ────────────────────────────────────────────────────────────────────────────

  // Call RPC to create household, update account and insert invite safely (bypassing RLS issues)
  const { error: rpcErr } = await supabase.rpc('setup_household', {
    my_contrib: myContrib,
    partner_contrib: partnerContrib,
    partner_email: partnerEmail ? partnerEmail.toLowerCase().trim() : null
  })

  if (rpcErr) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("setup_household RPC error:", rpcErr)
    }
    return { error: "Erro ao criar casal." }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function acceptInvite(inviteId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado." }

  // 1. Fetch invite
  const { data: invite, error: invErr } = await supabase
    .from('invites')
    .select('*')
    .eq('id', inviteId)
    .single()

  if (invErr || !invite) return { error: "Convite não encontrado." }

  // ── SECURITY FIX: IDOR Prevention ──────────────────────────────────────────
  // Validate that this invite was actually sent TO the logged-in user.
  // Without this, any authenticated user who guesses an inviteId could join
  // another couple's household by calling this action directly.
  if (invite.receiver_email?.toLowerCase() !== user.email?.toLowerCase()) {
    return { error: "Este convite não é destinado a você." }
  }

  // Also ensure the invite is still pending (not already accepted/cancelled)
  if (invite.status !== 'pending') {
    return { error: "Este convite já foi utilizado ou cancelado." }
  }
  // ────────────────────────────────────────────────────────────────────────────

  // 2. Update my account
  const { error: accErr } = await supabase
    .from('account')
    .update({
      household_id: invite.household_id,
      contribution: invite.partner_contribution
    })
    .eq('id', user.id)

  if (accErr) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("Account update error:", accErr)
    }
    return { error: "Erro ao atualizar a conta." }
  }

  // 3. Update invite status
  const { error: statusErr } = await supabase
    .from('invites')
    .update({ status: 'accepted' })
    .eq('id', inviteId)

  if (statusErr) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("Invite update error:", statusErr)
    }
    return { error: "Erro ao aceitar o convite." }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
