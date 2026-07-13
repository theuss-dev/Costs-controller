import { createClient } from '@supabase/supabase-js'

// Lê as variáveis de ambiente com segurança
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Exporta o cliente para o restante da aplicação
export const supabase = createClient(supabaseUrl, supabaseKey)
