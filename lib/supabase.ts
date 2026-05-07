import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Public Supabase Client
 * Use this for client-side interactions where Row Level Security (RLS) is enforced.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Admin Supabase Client
 * Use ONLY in server-side API routes or Edge Functions.
 * This client bypasses RLS.
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
