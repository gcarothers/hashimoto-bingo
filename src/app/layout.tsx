'use client';

import { AppBar, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Link from 'next/link';
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // blue-600
    },
    background: {
      default: '#f3f4f6', // gray-100
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="static" sx={{ mb: 3 }}>
            <nav style={{ padding: '1rem' }}>
              <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h1 style={{ margin: 0 }}>Hashimoto&apos;s Bingo</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>Overview</Link>
                  <Link href="/add" style={{ color: 'white', textDecoration: 'none' }}>Play Bingo</Link>
                  <Link href="/settings" style={{ color: 'white', textDecoration: 'none' }}>Settings</Link>
                </div>
              </div>
            </nav>
          </AppBar>
          <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            {children}
          </main>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
