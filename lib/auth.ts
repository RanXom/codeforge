import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { type Database } from "@/lib/database.types"

export async function signOut() {
  const supabase = createClientComponentClient<Database>()
  await supabase.auth.signOut()
} 