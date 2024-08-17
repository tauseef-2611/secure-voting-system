import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSession } from '@/app/actions';
import { useRouter } from 'next/navigation';

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
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        alert("You are not logged in");
        router.push('/');
      } else {
        setUser(session.user as User);
      }
    };
    checkSession();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};