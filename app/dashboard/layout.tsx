"use client";
import { Inter } from "next/font/google";
import NavBar from "@/components/nav-bar";
import { getSession } from "@/app/actions";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });
import { JWTPayload } from "jose";
import {  SideNav } from "./sidebar";

type Session = JWTPayload & {
  user: {
    username: string;
    password: string;
  };
  expires: string;
};

export default function RootLayout({
      children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const sessionData = await getSession();
      if (sessionData === null || (sessionData as Session).user.username !== "admin") {
        window.location.href = "/admin";
      } else {
        setSession(sessionData as Session);
      }
    }
    fetchSession();
  }, []);

  return (
<div className="relative min-h-screen w-full">
  <div className="fixed top-0 left-0 h-full w-[220px]  border-r-2 lg:w-[280px]">
    <SideNav />
  </div>
  <div className="ml-[220px] lg:ml-[280px] flex flex-col">
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 max-w-full overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
      {children}
    </main>
  </div>
</div>
  );

  // return (
  //     <div className="flex-col md:flex">
  //     <NavBar />
  //     <div className="flex-1 space-y-4 p-8 pt-6">
  //       {children}
  //     </div>
  //   </div>
  // );
}
