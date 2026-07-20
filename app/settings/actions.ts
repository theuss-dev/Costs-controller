'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfileName(firstName: string, lastName: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autorizado" }

  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()

  const { error } = await supabase
    .from('account')
    .update({ name: fullName })
    .eq('id', user.id)

  if (error) {
    console.error("Error updating name:", error)
    return { error: "Erro ao atualizar os dados." }
  }

  // Also try to update auth metadata for consistency
  await supabase.auth.updateUser({
    data: { full_name: fullName }
  })

  revalidatePath('/profile')
  revalidatePath('/settings')
  
  return { success: true }
}
