import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server-side Supabase client using the anon key.
 * 
 * SECURITY NOTE: All data operations in this application go through Server Actions
 * (files ending in actions.ts with 'use server' directive). This means the Supabase
 * client is NEVER instantiated on the browser side for data operations.
 * 
 * The NEXT_PUBLIC_* env vars are required by Supabase SSR for session management,
 * but the anon key is a "publishable" key by design — security relies on:
 *   1. Row Level Security (RLS) policies on ALL tables in Supabase
 *   2. Server-side auth validation (auth.getUser()) before every data operation
 *   3. IDOR protections in every action (ownership checks)
 * 
 * NEVER expose SUPABASE_SERVICE_ROLE_KEY via NEXT_PUBLIC_* or in any client code.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component called setAll - ignore since middleware handles refreshing sessions.
          }
        },
      },
    }
  )
}
