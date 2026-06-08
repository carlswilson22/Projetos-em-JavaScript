import React, { useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { BrainCircuit, TrendingUp, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

interface Insight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const FinancialInsights: React.FC = () => {
  const { transactions } = useTransactions();

  const insights = useMemo((): Insight[] => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const incomes = transactions.filter((t) => t.type === 'income');

    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);

    const resultList: Insight[] = [];

    if (transactions.length === 0) {
      return [
        {
          type: 'info',
          title: 'Primeiros Passos 🚀',
          description: 'Cadastre suas primeiras receitas e despesas para ativar o Assistente Inteligente e receber insights financeiros personalizados sob medida.',
          icon: <BrainCircuit className="w-5 h-5 text-primary" />,
        },
      ];
    }

    // 1. Análise de Balanço & Saúde Financeira
    if (totalExpense > totalIncome) {
      const deficitPct = totalIncome > 0 ? ((totalExpense - totalIncome) / totalIncome) * 100 : 100;
      resultList.push({
        type: 'warning',
        title: 'Balanço no Vermelho! ⚠️',
        description: `Suas despesas superaram suas receitas em ${deficitPct.toFixed(0)}% este mês. Recomendamos cortar gastos supérfluos imediatamente e pausar depósitos em metas de poupança não urgentes até reequilibrar o orçamento.`,
        icon: <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />,
      });
    } else {
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
      if (savingsRate >= 20) {
        resultList.push({
          type: 'success',
          title: 'Excelente Taxa de Poupança! 🎉',
          description: `Você economizou ${savingsRate.toFixed(0)}% das suas receitas este mês! Isso é maravilhoso e está acima da recomendação padrão do mercado (15%). Considere aplicar este excedente nas suas Metas de Economia.`,
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        });
      } else if (savingsRate > 0) {
        resultList.push({
          type: 'info',
          title: 'Economia Saudável 👍',
          description: `Você conseguiu guardar ${savingsRate.toFixed(0)}% das receitas. Uma boa dica é tentar reduzir despesas fixas em 5% no próximo mês para se aproximar da meta ideal recomendada por especialistas (20%).`,
          icon: <TrendingUp className="w-5 h-5 text-primary" />,
        });
      }
    }

    // 2. Análise de Gargalo por Categoria (Maior Categoria de Gasto)
    if (expenses.length > 0) {
      const categoryTotals = expenses.reduce((acc: Record<string, number>, curr) => {
        const cat = curr.category || 'Geral';
        acc[cat] = (acc[cat] || 0) + curr.amount;
        return acc;
      }, {});

      const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
      const [topCategory, topAmount] = sortedCategories[0];
      const topPct = totalExpense > 0 ? (topAmount / totalExpense) * 100 : 0;

      if (topPct > 25) {
        resultList.push({
          type: 'warning',
          title: `Gargalo em ${topCategory} 🛍️`,
          description: `Os gastos com "${topCategory}" representam ${topPct.toFixed(0)}% de todas as suas despesas. Tente estabelecer um teto limite para esta categoria na próxima semana para reaver o fôlego do seu saldo.`,
          icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        });
      }
    }

    // 3. Dica Geral Clássica (Regra do Pague-se Primeiro)
    resultList.push({
      type: 'info',
      title: 'Regra do "Pague-se Primeiro" 💡',
      description: 'Crie o hábito saudável de investir pelo menos 10% de toda receita recebida diretamente nas suas Metas de Economia no mesmo dia em que o dinheiro entrar na conta, antes de planejar o pagamento de contas.',
      icon: <Lightbulb className="w-5 h-5 text-primary" />,
    });

    return resultList.slice(0, 3); // Limita em até 3 insights principais
  }, [transactions]);

  return (
    <div className="bg-gradient-to-br from-primary/5 via-transparent to-primary/5 border border-primary/20 rounded-3xl p-6 shadow-sm w-full">
      <div className="flex items-center gap-2 mb-6">
        <BrainCircuit className="w-5 h-5 text-primary animate-pulse" />
        <h3 className="text-lg font-bold font-sans tracking-tight text-foreground flex items-center gap-1.5">
          Assistente Inteligente
          <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md uppercase tracking-wider font-mono">IA Beta</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`flex gap-3.5 p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] bg-card ${
              insight.type === 'warning'
                ? 'border-destructive/20 hover:border-destructive/30 shadow-sm'
                : insight.type === 'success'
                ? 'border-success/20 hover:border-success/30 shadow-sm'
                : 'border-border hover:border-primary/10 shadow-sm'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">{insight.icon}</div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-xs text-foreground font-sans leading-snug">{insight.title}</span>
              <p className="text-[11px] leading-relaxed text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
