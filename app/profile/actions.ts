'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function deleteAccount() {
  const supabase = await createClient()
  
  const { error } = await supabase.rpc('delete_user')
  if (error) {
    return { error: 'Falha ao excluir a conta. Tente novamente mais tarde.' }
  }

  await supabase.auth.signOut()
  redirect('/login')
}
