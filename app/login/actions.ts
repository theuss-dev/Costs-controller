'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Erro ao fazer login')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/login?message=Erro ao criar conta')
  }

  // Se o signup for bem sucedido, precisamos inserir na tabela `account`.
  // Como `auth.users` não dispara trigger pra gente ainda, fazemos via Supabase Admin 
  // ou diretamente aqui se a política permitir (mas RLS bloqueia insert direto na account 
  // sem household para simplificar? Vamos ignorar isso na RLS por enquanto e lidar via Dashboard se necessário, 
  // ou criar a account manualmente).
  // O ideal no Postgres é uma trigger no auth.users, mas faremos a trigger mais tarde se precisar.

  revalidatePath('/', 'layout')
  redirect('/')
}
