import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'; // Import ToastContainer from Sonner


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Intekhaab",
  description: "Simple and Secure Voting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <Toaster position="top-right" richColors /> 
      <body className={inter.className}>{children}</body>
    </html>
  );
}
