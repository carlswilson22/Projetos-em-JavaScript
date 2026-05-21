import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useTransactions } from '../context/TransactionContext';

const COLORS = [
  '#3b82f6', // Azul
  '#8b5cf6', // Roxo
  '#10b981', // Verde
  '#f97316', // Laranja
  '#ec4899', // Rosa
  '#06b6d4', // Ciano
  '#eab308', // Amarelo
];

export const CategoryDistributionChart: React.FC = () => {
  const { transactions } = useTransactions();

  const chartData = useMemo(() => {
    // Filtrar apenas despesas
    const expenses = transactions.filter((t) => t.type === 'expense');

    // Agrupar por categoria
    const grouped = expenses.reduce((acc: Record<string, number>, curr) => {
      const category = curr.category || 'Geral';
      acc[category] = (acc[category] || 0) + curr.amount;
      return acc;
    }, {});

    const total = Object.values(grouped).reduce((sum, val) => sum + val, 0);

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value); // Ordena pelo maior gasto
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col bg-white border border-border rounded-3xl p-6 h-[340px] justify-center items-center text-center">
        <h3 className="text-lg font-bold font-sans tracking-tight mb-2">Despesas por Categoria</h3>
        <p className="text-sm text-muted-foreground max-w-[200px]">
          Nenhuma despesa registrada para exibir análise de categorias.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white border border-border rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-bold font-sans tracking-tight mb-6">Distribuição de Despesas</h3>

      <div className="relative w-full h-[180px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none transition-all duration-300 hover:opacity-80" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => formatCurrency(Number(value))}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                fontSize: '12px',
                fontFamily: 'sans-serif',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Total no Centro do Donut */}
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Pago</span>
          <span className="text-base font-bold text-foreground font-sans tracking-tight">
            {formatCurrency(totalExpense)}
          </span>
        </div>
      </div>

      {/* Legenda Lateral com Percentual */}
      <div className="flex flex-col gap-2 mt-4 overflow-y-auto max-h-[120px] pr-2">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-muted-foreground truncate max-w-[120px] font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{formatCurrency(item.value)}</span>
              <span className="text-[10px] text-muted-foreground font-mono bg-muted py-0.5 px-1.5 rounded-md">
                {item.percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
