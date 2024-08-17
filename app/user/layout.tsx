"use client";
import { Header } from "./header";
import { UserProvider } from './UserContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <Header />
      <div className="p-2">
        {children}
      </div>
    </UserProvider>
  );
}