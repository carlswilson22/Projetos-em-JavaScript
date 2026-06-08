/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Transaction } from '../types';
import api from '../services/api';

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  isMockData: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMockData, setIsMockData] = useState(false);

  // 1. Usamos useCallback para poder chamar essa função dentro do useEffect e em outros lugares com segurança
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/transactions');
      
      const formattedTransactions = response.data.map((t: any) => ({
        id: t.id,
        description: t.description,
        amount: t.amount,
        date: t.date,
        type: t.type === 1 ? 'income' : 'expense', 
        category: t.category?.name || 'Geral',
        currency: t.currency,
        exchangeRate: t.exchangeRate
      }));

      setTransactions(formattedTransactions);
      setIsMockData(false);
    } catch (error) {
      console.error('Erro ao buscar transações da API:', error);
    } finally {
      setIsLoading(false);
    }
  }, []); // <-- Array de dependências vazio, ela é montada uma vez só

  // 2. useEffect agora não vai mais gerar avisos amarelos no terminal
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (data: Omit<Transaction, 'id'>) => {
    setIsLoading(true);
    try {
      const backendPayload = {
        description: data.description,
        amount: data.amount,
        date: data.date,
        type: data.type === 'income' ? 1 : 0,
        category: data.category,
        currency: data.currency,
        exchangeRate: data.exchangeRate
      };

      await api.post('/transactions', backendPayload);
      
      await fetchTransactions();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setIsLoading(true);
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TransactionContext.Provider value={{ transactions, isLoading, addTransaction, deleteTransaction, isMockData }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};