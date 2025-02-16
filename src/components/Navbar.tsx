'use client';
import Link from 'next/link';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';

export default function Navbar() {
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error(error);
      else console.log('Session:', data.session);
    };
    getSession();
  }, [supabase]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    else alert('Logged out successfully!');
  };

  return (
    <nav className="bg-background shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-foreground">
          CodeForge
        </Link>
        {/* Navigation Links */}
        <div className="flex space-x-4">
          <Link href="/problems" className="text-foreground hover:text-blue-500">
            Problems
          </Link>
          {user ? (
            <>
              <span>{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-foreground hover:text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-foreground hover:text-blue-500">
                Login
              </Link>
              <Link href="/auth/register" className="text-foreground hover:text-blue-500">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}