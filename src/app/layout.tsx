import './globals.css'
import Providers from './providers';
import { Navbar } from '@/components/Navbar';
import { CustomCursor } from '@/components/CustomCursor';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'DevPulse — Your dev brain, out loud.',
  description: 'Share thoughts, discoveries, rants, and code wins. DevPulse is where developers come to be real.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <CustomCursor />
          <ScrollReveal />
          <Navbar />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#111111',
                color: '#F0F0F0',
                border: '1px solid #C6F135',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
              },
            }}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
