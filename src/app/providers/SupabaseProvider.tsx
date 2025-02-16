'use client';

import { createContext, useContext, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const SupabaseContext = createContext(null);

export default function SupabaseProvider({ children }) {
  const [supabase] = useState(() => createClientComponentClient());

  return (
    <SupabaseContext.Provider value={supabase}>
      <SessionContextProvider supabaseClient={supabase}>
        {children}
      </SessionContextProvider>
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => useContext(SupabaseContext);
