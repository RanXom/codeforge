'use client';
import Link from 'next/link';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export default function Navbar() {
  const supabase = useSupabaseClient(); // ✅ Using Supabase client from auth-helpers
  const user = useUser(); // ✅ Automatically tracks user session

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert('Logged out successfully!');
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
