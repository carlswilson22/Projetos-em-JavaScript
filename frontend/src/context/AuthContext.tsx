/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextData } from '../types/auth';
import api from '../services/api'; // <-- Nosso "Carteiro" conectado!

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('@FinanceApp:user');
    const storedToken = localStorage.getItem('token'); // <- Ajustado para o nome que o interceptor do api.ts usa

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Faz a chamada real para a rota de login do backend
      const response = await api.post('/auth/login', { email, password });
      
      // Assumindo que o seu backend retorna { token, user: { id, name, email... } }
      const { token, user: userData } = response.data;

      localStorage.setItem('@FinanceApp:user', JSON.stringify(userData));
      localStorage.setItem('token', token); // Salva para o Axios usar nas próximas requisições
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.';
      throw new Error(message);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      // Chamada real para criar usuário
      await api.post('/auth/register', { name, email, password });
      
      // Se criou com sucesso, já fazemos o login automático!
      await login(email, password);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao criar conta.';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('@FinanceApp:user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return;
    try {
      // Chamada real para a API no backend
      const response = await api.put('/auth/profile', data);
      
      const updatedUser = { ...user, ...response.data.user };
      localStorage.setItem('@FinanceApp:user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao atualizar perfil.';
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, isLoading, login, register, logout, updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};