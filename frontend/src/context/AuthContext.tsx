import { createContext, useContext, useState, type ReactNode } from 'react';
import client from '../api/client';

interface AuthState {
  token: string;
  username: string;
}

interface AuthContextType {
  user: AuthState | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthState | null>(() => {
    const token = localStorage.getItem('admin_token');
    const username = localStorage.getItem('admin_username');
    return token && username ? { token, username } : null;
  });

  const login = async (username: string, password: string) => {
    try {
      const res = await client.post('/admin/auth/login', { username, password });
      const { token } = res.data;
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_username', username);
      setUser({ token, username });
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
