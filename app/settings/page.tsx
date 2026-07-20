import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SettingsClient from './settings-client'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: account } = await supabase.from('account').select('name').eq('id', user.id).single()
  
  const fullName = account?.name || ''
  const nameParts = fullName.split(' ')
  const initialFirstName = nameParts[0] || ''
  const initialLastName = nameParts.slice(1).join(' ') || ''

  return (
    <SettingsClient 
      initialFirstName={initialFirstName}
      initialLastName={initialLastName}
      email={user.email || ''}
    />
  )
}
