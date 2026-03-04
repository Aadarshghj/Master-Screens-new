import { AuthContext, type AuthProviderProps } from "./AuthContext";
import { useAuth } from "@/hooks/useAuth";

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
