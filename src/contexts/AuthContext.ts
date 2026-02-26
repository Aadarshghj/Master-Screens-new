import { createContext } from "react";
import type { ReactNode } from "react";

export interface AuthContextType {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export interface AuthProviderProps {
  children: ReactNode;
}
