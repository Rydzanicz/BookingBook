import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode
} from 'react';
import { authService, User } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser]     = useState<User | null>(null);
  const [token, setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser  = authService.getCurrentUser();
    const savedToken = authService.getToken();
    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    setUser({ id: response.id, username: response.username, email: response.email });
    setToken(response.token);
  };

  const register = async (username: string, email: string, password: string) => {
    await authService.register({ username, email, password });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
      <AuthContext.Provider
          value={{
            user,
            token,
            isAuthenticated: !!user && !!token,
            login,
            register,
            logout,
            loading
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth musi być użyty wewnątrz AuthProvider');
  }
  return context;
};
