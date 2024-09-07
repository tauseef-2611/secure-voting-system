import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'; // Import ToastContainer from Sonner


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Intekhaab",
  description: "Simple & Secure Voting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const prefersDarkScheme = typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = prefersDarkScheme ? 'dark' : 'light';

  return (
    <html lang="en" className={initialTheme}>
      <Toaster position="top-right" richColors /> 
      <body className={inter.className}>{children}</body>
    </html>
  );
}
