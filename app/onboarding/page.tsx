import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingClient from './onboarding-client'

export default async function OnboardingPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: account } = await supabase.from('account').select('*').eq('id', user.id).single()
  
  if (account?.household_id) {
    redirect('/')
  }

  // Fetch pending invites for this user
  const { data: invites } = await supabase
    .from('invites')
    .select('*, account!invites_sender_id_fkey(name)')
    .eq('receiver_email', user.email)
    .eq('status', 'pending')

  return (
    <OnboardingClient 
      invites={invites || []} 
      userEmail={user.email || ''} 
    />
  )
}
