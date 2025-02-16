import './globals.css';
import Navbar from '../components/Navbar';
import SupabaseProvider from './providers/SupabaseProvider'; // ✅ Import custom provider

export const metadata = {
  title: 'CodeForge - Distraction-Free Coding Platform',
  description: 'A problem-solving coding platform with a restrictive environment.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <SupabaseProvider>
          <Navbar />
          <main className="container mx-auto p-8">{children}</main>
        </SupabaseProvider>
      </body>
    </html>
  );
}
