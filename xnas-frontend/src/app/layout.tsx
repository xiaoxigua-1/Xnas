"use client";

import { ThemeProvider, createTheme } from '@mui/material';
import './globals.css';

const theme = createTheme({
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          background: '#ffffff'
        }
      }
    }
  }
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
