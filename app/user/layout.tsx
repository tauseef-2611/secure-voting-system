"use client";
import { Header } from "./header";
import { useEffect, useState } from "react";
import { getSession } from "@/app/actions";
import { useRouter } from "next/navigation";
// import { User } from "@/utils/Types/user";
type User = {
  voter_id: string;
  name: string;
  phone: string;
  year_of_membership: number;
  date_of_birth: string;
  unit: string;
  area: string;
  is_verified: boolean;
  is_Present: boolean;
  vote_Casted: boolean;
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    document.title = "Vote | Intekhaab";
    console.log("Checking session");
    const checkSession = async () => {
      console.log("Checking session1");
      const session = await getSession();
      console.log("Got session");
      if (!session) {
        alert("You are not logged in");
        router.push('/');
      } else {
        console.log("Session: ");
        console.log(session);
        console.log(session.user);
        setUser(session.user as User);  
        console.log("User: ");
        console.log(user);
      }
    };
    checkSession();
    console.log(user);
  }, []);


  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <Header user={user}/>
      <div className="p-2">
        {children}
      </div>
      </>
  );
}