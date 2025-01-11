'use client';

import { AppBar, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

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
                <h1 style={{ margin: 0 }}>Hashimoto's Bingo</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
                  <a href="/add" style={{ color: 'white', textDecoration: 'none' }}>Play Bingo</a>
                  <a href="/settings" style={{ color: 'white', textDecoration: 'none' }}>Settings</a>
                </div>
              </div>
            </nav>
          </AppBar>
          <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
