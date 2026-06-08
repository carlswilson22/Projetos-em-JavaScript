import { useMemo } from 'react';
import { formatCurrency } from '../lib/format';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { Skeleton } from './ui/skeleton';

interface DashboardSummaryProps {
  overrideTransactions?: any[];
  overrideCurrency?: string;
}

export function DashboardSummary({ overrideTransactions, overrideCurrency }: DashboardSummaryProps) {
  const { transactions, isLoading } = useTransactions();
  const activeTransactions = overrideTransactions || transactions;

  const { balance, income, expense } = useMemo(() => {
    return activeTransactions.reduce(
      (acc, transaction) => {
        const defaultCurrency = localStorage.getItem('@FinanceApp:currency') || 'BRL';
        const hasDifferentCurrency = transaction.currency && transaction.currency !== defaultCurrency;
        
        // Se a aba for uma moeda específica e a transação for em moeda estrangeira, usamos o valor original.
        const value = (overrideCurrency && overrideCurrency !== 'all' && hasDifferentCurrency && transaction.exchangeRate)
          ? transaction.amount / transaction.exchangeRate
          : transaction.amount;

        if (transaction.type === 'income') {
          acc.income += value;
          acc.balance += value;
        } else {
          acc.expense += value;
          acc.balance -= value;
        }
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [activeTransactions, overrideCurrency]);

  const displayCurrency = !overrideCurrency || overrideCurrency === 'all' 
    ? (localStorage.getItem('@FinanceApp:currency') || 'BRL') 
    : overrideCurrency;

  return (
    <section className="flex flex-col gap-8 w-full">
      {/* Massive Typography Hero Balanço */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          {!overrideCurrency || overrideCurrency === 'all' ? 'Patrimônio Consolidado' : `Saldo Atual (${displayCurrency})`}
        </span>
        {isLoading ? (
          <Skeleton className="h-16 w-64 rounded-xl" />
        ) : (
          <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter text-foreground tabular-nums">
            {formatCurrency(balance, displayCurrency)}
          </h1>
        )}
      </div>

      {/* Cards Minimalistas Asimétricos (Break the Bento Grid slightly) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:max-w-xl">
        <div className="flex flex-col gap-3 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-2 bg-success/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <span className="text-sm font-medium">Receitas</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-32 rounded-lg" />
          ) : (
            <span className="text-2xl font-bold font-sans tracking-tight text-foreground tabular-nums">
              {formatCurrency(income, displayCurrency)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <TrendingDown className="w-4 h-4 text-destructive" />
            </div>
            <span className="text-sm font-medium">Despesas</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-32 rounded-lg" />
          ) : (
            <span className="text-2xl font-bold font-sans tracking-tight text-foreground tabular-nums">
              {formatCurrency(expense, displayCurrency)}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
