"use client";

import { AppBar, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Thyroid from "@/components/Thyroid";
import Link from "next/link";
const theme = createTheme({
  palette: {
    primary: {
      light: "#b6e9df",
      main: "#4fccb6",
      dark: "#008268",
      contrastText: "#000",
    },
    secondary: {
      light: "#e598ae",
      main: "#f44336",
      dark: "#904056",
      contrastText: "#000",
    },
    background: {
      default: "#e7e9f8",
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
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" sx={{ mb: 3 }}>
              <nav style={{ padding: "1rem" }}>
                <div
                  style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <Thyroid />
                    <h1 style={{ margin: 0 }}>Hashimoto&apos;s Bingo</h1>
                  </div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <Link
                      href="/"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      Overview
                    </Link>
                    <Link
                      href="/add"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      Play Bingo
                    </Link>
                    <Link
                      href="/settings"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      Settings
                    </Link>
                  </div>
                </div>
              </nav>
            </AppBar>
            <main
              style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "0 1rem",
              }}
            >
              {children}
            </main>
          </ThemeProvider>
          <SpeedInsights />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
