'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

import { translateAuthError } from '@/utils/auth-errors'

export async function signup(email: string, pass: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
  })

  if (error) {
    return { error: translateAuthError(error.message) }
  }

  // Se o Supabase exigir confirmação de e-mail, a sessão pode não estar ativa ainda.
  // Precisamos avisar o frontend.
  if (data?.user && data.user.identities && data.user.identities.length === 0) {
     return { error: "Este email já está em uso ou aguardando confirmação." }
  }

  // Verifica se já criou sessão automaticamente (se não exigir confirmação)
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return { 
      success: true, 
      message: "Conta criada! Por favor, verifique seu e-mail para confirmar o cadastro." 
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
