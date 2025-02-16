import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'CodeForge - Distraction-Free Coding Platform',
  description: 'A problem-solving coding platform with a restrictive environment.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto p-8">{children}</main>
      </body>
    </html>
  );
}