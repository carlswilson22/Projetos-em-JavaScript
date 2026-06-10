import { useMemo, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../lib/format';
import { TrendingUp, TrendingDown, Percent, Sparkles, Calendar, ArrowLeftRight } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Reports() {
  const { transactions } = useTransactions();
  const [selectedPeriod, setSelectedPeriod] = useState<'6months' | 'thisyear' | 'all'>('6months');

  // 1. Resumo Geral de Dados
  const stats = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const incomes = transactions.filter(t => t.type === 'income');

    const totalIncome = incomes.reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);
    const netSavings = totalIncome - totalExpense;
    
    // Taxa de Poupança: (Receita - Despesa) / Receita
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // Maior gasto
    const maxExpense = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;

    // Média diária de gastos (considerando a diferença em dias entre a primeira e última transação ou 30 dias)
    let dailyExpenseAverage = 0;
    if (expenses.length > 0) {
      const dates = expenses.map(e => new Date(e.date).getTime());
      const minDate = Math.min(...dates);
      const maxDate = Math.max(...dates);
      const diffTime = Math.abs(maxDate - minDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      dailyExpenseAverage = totalExpense / Math.min(diffDays, 30);
    }

    return {
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
      maxExpense,
      dailyExpenseAverage
    };
  }, [transactions]);

  // 2. Gráfico Mensal: Receitas vs Despesas (últimos 6 meses ou Ano Atual)
  const monthlyData = useMemo(() => {
    const data: Record<string, { monthName: string; rawDate: Date; Receitas: number; Despesas: number }> = {};
    const now = new Date();
    
    let monthsToGenerate = 6;
    if (selectedPeriod === 'thisyear') {
      monthsToGenerate = now.getMonth() + 1;
    } else if (selectedPeriod === 'all') {
      monthsToGenerate = 12; // limite de 12 meses para evitar saturação
    }

    // Inicializa meses com zero para não sumir dados
    for (let i = 0; i < monthsToGenerate; i++) {
      const date = subMonths(now, i);
      const key = format(date, 'yyyy-MM');
      data[key] = {
        monthName: format(date, 'MMM/yy', { locale: ptBR }),
        rawDate: date,
        Receitas: 0,
        Despesas: 0
      };
    }

    // Soma as transações
    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const key = format(tDate, 'yyyy-MM');
      
      if (data[key]) {
        if (t.type === 'income') {
          data[key].Receitas += t.amount;
        } else {
          data[key].Despesas += t.amount;
        }
      }
    });

    return Object.values(data).sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
  }, [transactions, selectedPeriod]);

  // 3. Distribuição das Top Categorias de Gastos (últimos 30 dias)
  const topCategories = useMemo(() => {
    const categoriesSum: Record<string, number> = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= thirtyDaysAgo)
      .forEach(t => {
        categoriesSum[t.category] = (categoriesSum[t.category] || 0) + t.amount;
      });

    return Object.entries(categoriesSum)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // top 5
  }, [transactions]);

  // Cores dinâmicas para o ranking de categorias
  const COLORS = [
    'var(--primary)',
    'var(--accent)',
    '#3b82f6',
    '#06b6d4',
    '#10b981'
  ];

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Relatórios Analíticos</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral do seu fluxo de caixa e hábitos de consumo.</p>
        </div>

        <div className="relative flex items-center shrink-0">
          <Calendar className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="flex h-11 w-full md:w-48 rounded-xl border border-border bg-card px-10 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary appearance-none font-medium text-foreground"
          >
            <option value="6months">Últimos 6 meses</option>
            <option value="thisyear">Ano Atual</option>
            <option value="all">Último Ano</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </header>

      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Taxa de Poupança */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-premium dark:shadow-premium-dark flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Taxa de Poupança</span>
            <h3 className="text-lg font-extrabold text-foreground mt-0.5">
              {stats.savingsRate.toFixed(1)}%
            </h3>
            <span className="text-[10px] text-muted-foreground">do total recebido</span>
          </div>
        </div>

        {/* Total Receitas */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-premium dark:shadow-premium-dark flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-success" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Total de Receitas</span>
            <h3 className="text-lg font-extrabold text-success mt-0.5">
              {formatCurrency(stats.totalIncome)}
            </h3>
            <span className="text-[10px] text-muted-foreground">entradas acumuladas</span>
          </div>
        </div>

        {/* Total Despesas */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-premium dark:shadow-premium-dark flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <TrendingDown className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Total de Despesas</span>
            <h3 className="text-lg font-extrabold text-foreground mt-0.5">
              {formatCurrency(stats.totalExpense)}
            </h3>
            <span className="text-[10px] text-muted-foreground">saídas acumuladas</span>
          </div>
        </div>

        {/* Saldo Líquido */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-premium dark:shadow-premium-dark flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Saldo Líquido</span>
            <h3 className={`text-lg font-extrabold mt-0.5 ${stats.netSavings >= 0 ? 'text-foreground' : 'text-destructive'}`}>
              {formatCurrency(stats.netSavings)}
            </h3>
            <span className="text-[10px] text-muted-foreground">sobra líquida</span>
          </div>
        </div>
      </div>

      {/* Grid de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfico de barras Receitas vs Despesas (2/3 da tela) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-[2.5rem] p-6 shadow-premium dark:shadow-premium-dark flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">Fluxo de Caixa Mensal</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Comparativo direto de ganhos e gastos mensais</p>
          </div>
          
          <div className="w-full h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="monthName" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    fontFamily: 'Outfit, sans-serif',
                    color: 'var(--foreground)',
                    fontSize: '12px'
                  }} 
                  labelStyle={{ color: 'var(--muted-foreground)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  formatter={(value) => [formatCurrency(Number(value))]}
                />
                <Legend 
                  iconType="circle" 
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} 
                  formatter={(value) => <span className="text-foreground font-medium">{value}</span>}
                />
                <Bar dataKey="Receitas" fill="var(--success)" radius={[8, 8, 0, 0]} maxBarSize={32} />
                <Bar dataKey="Despesas" fill="var(--destructive)" radius={[8, 8, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lado Direito: Top Categorias & Destaques (1/3 da tela) */}
        <div className="flex flex-col gap-8">
          
          {/* Top Categorias */}
          <div className="bg-card border border-border rounded-[2.5rem] p-6 shadow-premium dark:shadow-premium-dark flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-foreground">Top Categorias</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Maiores fontes de despesas nos últimos 30 dias</p>
            </div>

            {topCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <span className="text-xs">Nenhum gasto nos últimos 30 dias.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-2">
                {topCategories.map((cat, index) => {
                  const maxVal = topCategories[0].value || 1;
                  const relativePercentage = (cat.value / maxVal) * 100;
                  
                  return (
                    <div key={cat.name} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">{cat.name}</span>
                        <span className="font-bold text-foreground">{formatCurrency(cat.value)}</span>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${relativePercentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Destaques e Insights Rápidos */}
          <div className="bg-card border border-border rounded-[2.5rem] p-6 shadow-premium dark:shadow-premium-dark flex flex-col gap-4">
            <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Insights Analíticos
            </h3>

            <div className="flex flex-col gap-4 text-xs">
              <div className="p-3 bg-muted/30 border border-border/50 rounded-2xl flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Maior Gasto Único</span>
                <span className="text-sm font-bold text-foreground">{formatCurrency(stats.maxExpense)}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">maior débito avulso registrado</span>
              </div>

              <div className="p-3 bg-muted/30 border border-border/50 rounded-2xl flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Média Diária de Saídas</span>
                <span className="text-sm font-bold text-foreground">{formatCurrency(stats.dailyExpenseAverage)}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">com base nos últimos 30 dias de uso</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
