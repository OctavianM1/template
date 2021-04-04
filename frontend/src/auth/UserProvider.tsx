import React, { createContext, ReactNode, useState } from "react";

export interface AppUser {
  id: string;
  email: string;
  token: string;
  name: string;
}

interface UserContextValues {
  user: AppUser | null;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
}

export const UserContext = createContext<UserContextValues>(null!);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
