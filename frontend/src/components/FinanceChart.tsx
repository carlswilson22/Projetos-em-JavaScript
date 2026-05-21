import { useMemo } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export function FinanceChart() {
  const { transactions } = useTransactions();

  const data = useMemo(() => {
    if (transactions.length === 0) return [];
    
    // 1. Ordena de forma cronológica crescente
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // 2. Acumula o saldo
    let currentBalance = 0;
    const history = sorted.map(t => {
      currentBalance += t.type === 'income' ? t.amount : -t.amount;
      return {
        date: format(new Date(t.date), 'dd MMM', { locale: ptBR }),
        balance: currentBalance,
        rawDate: new Date(t.date).getTime()
      };
    });

    // 3. Consolda dias duplicados para evitar poluição visual no eixo X
    const uniqueDays: Record<string, { date: string; balance: number; rawDate: number }> = {};
    history.forEach(item => {
      uniqueDays[item.date] = item;
    });

    return Object.values(uniqueDays).sort((a, b) => a.rawDate - b.rawDate);
  }, [transactions]);

  const stats = useMemo(() => {
    if (data.length === 0) return { current: 0, peak: 0, bottom: 0 };
    const balances = data.map(d => d.balance);
    return {
      current: balances[balances.length - 1] || 0,
      peak: Math.max(...balances, 0),
      bottom: Math.min(...balances, 0)
    };
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (transactions.length === 0) return null;

  return (
    <div className="w-full bg-white border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      {/* Cabeçalho do Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold font-sans tracking-tight text-foreground">Desempenho da Conta</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Evolução histórica do saldo acumulado</p>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:flex items-center">
          {/* Saldo Atual */}
          <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 py-1.5 px-3 rounded-2xl">
            <Wallet className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase leading-none">Saldo Atual</span>
              <span className="text-[11px] font-extrabold text-foreground leading-snug whitespace-nowrap">
                {formatCurrency(stats.current)}
              </span>
            </div>
          </div>

          {/* Pico Máximo */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 py-1.5 px-3 rounded-2xl">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase leading-none">Pico Histórico</span>
              <span className="text-[11px] font-extrabold text-foreground leading-snug whitespace-nowrap">
                {formatCurrency(stats.peak)}
              </span>
            </div>
          </div>

          {/* Menor Saldo */}
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 py-1.5 px-3 rounded-2xl">
            <TrendingDown className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase leading-none">Menor Saldo</span>
              <span className="text-[11px] font-extrabold text-foreground leading-snug whitespace-nowrap">
                {formatCurrency(stats.bottom)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico Recharts */}
      <div className="w-full h-56 sm:h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 500 }} 
              dy={10} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: '1px solid #E5E7EB', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)', 
                fontWeight: 600,
                fontSize: '12px',
                fontFamily: 'Outfit, sans-serif'
              }} 
              formatter={(value: any) => [formatCurrency(Number(value)), 'Saldo']}
              labelStyle={{ color: '#6B7280', fontSize: '10px', marginBottom: '4px' }}
              itemStyle={{ color: '#111827' }}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

