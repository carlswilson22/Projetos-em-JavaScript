import { useMemo } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../lib/format';

interface FinanceChartProps {
  overrideTransactions?: any[];
  overrideCurrency?: string;
}

export function FinanceChart({ overrideTransactions, overrideCurrency }: FinanceChartProps) {
  const { transactions } = useTransactions();
  const activeTransactions = overrideTransactions || transactions;

  const displayCurrency = !overrideCurrency || overrideCurrency === 'all' 
    ? (localStorage.getItem('@FinanceApp:currency') || 'BRL') 
    : overrideCurrency;

  const data = useMemo(() => {
    if (activeTransactions.length === 0) return [];
    
    // 1. Ordena de forma cronológica crescente
    const sorted = [...activeTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // 2. Acumula o saldo
    let currentBalance = 0;
    const history = sorted.map(t => {
      const defaultCurrency = localStorage.getItem('@FinanceApp:currency') || 'BRL';
      const hasDifferentCurrency = t.currency && t.currency !== defaultCurrency;
      
      const value = (overrideCurrency && overrideCurrency !== 'all' && hasDifferentCurrency && t.exchangeRate)
        ? t.amount / t.exchangeRate
        : t.amount;

      currentBalance += t.type === 'income' ? value : -value;
      return {
        date: format(new Date(t.date), 'dd MMM', { locale: ptBR }),
        balance: currentBalance,
        rawDate: new Date(t.date).getTime()
      };
    });
    
    // 3. Consolida dias duplicados para evitar poluição visual no eixo X
    const uniqueDays: Record<string, { date: string; balance: number; rawDate: number }> = {};
    history.forEach(item => {
      uniqueDays[item.date] = item;
    });

    return Object.values(uniqueDays).sort((a, b) => a.rawDate - b.rawDate);
  }, [activeTransactions, overrideCurrency]);

  const stats = useMemo(() => {
    if (data.length === 0) return { current: 0, peak: 0, bottom: 0 };
    const balances = data.map(d => d.balance);
    return {
      current: balances[balances.length - 1] || 0,
      peak: Math.max(...balances, 0),
      bottom: Math.min(...balances, 0)
    };
  }, [data]);

  if (activeTransactions.length === 0) return null;

  return (
    <div className="w-full bg-card border border-border rounded-[2.5rem] p-6 shadow-premium dark:shadow-premium-dark flex flex-col gap-6 transition-all duration-300">
      {/* Cabeçalho do Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">Desempenho Financeiro</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Evolução histórica do saldo acumulado</p>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          {/* Saldo Atual */}
          <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 py-2.5 px-4 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase leading-none">Saldo Atual</span>
              <span className="text-sm font-bold text-foreground mt-1 whitespace-nowrap">
                {formatCurrency(stats.current, displayCurrency)}
              </span>
            </div>
          </div>

          {/* Pico Máximo */}
          <div className="flex items-center gap-3 bg-success/10 border border-success/20 py-2.5 px-4 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-success flex items-center justify-center text-success-foreground shrink-0">
              <TrendingUp className="w-4 h-4 text-white dark:text-card" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase leading-none">Pico Histórico</span>
              <span className="text-sm font-bold text-foreground mt-1 whitespace-nowrap">
                {formatCurrency(stats.peak, displayCurrency)}
              </span>
            </div>
          </div>

          {/* Menor Saldo */}
          <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 py-2.5 px-4 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-destructive flex items-center justify-center text-destructive-foreground shrink-0">
              <TrendingDown className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase leading-none">Menor Saldo</span>
              <span className="text-sm font-bold text-foreground mt-1 whitespace-nowrap">
                {formatCurrency(stats.bottom, displayCurrency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico Recharts */}
      <div className="w-full h-64 sm:h-72 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="4 4" 
              vertical={false} 
              stroke="var(--border)" 
              opacity={0.4} 
            />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }} 
              dy={10} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '20px', 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.15)',
                fontWeight: 600,
                fontSize: '12px',
                fontFamily: 'Outfit, sans-serif',
                color: 'var(--foreground)'
              }}
              labelStyle={{ color: 'var(--muted-foreground)', fontSize: '10px', marginBottom: '4px' }}
              itemStyle={{ color: 'var(--foreground)' }}
              formatter={(value: any) => [formatCurrency(Number(value), displayCurrency), 'Saldo']}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="var(--primary)" 
              strokeWidth={3.5}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
