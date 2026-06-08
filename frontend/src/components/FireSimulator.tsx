import React, { useState, useMemo } from 'react';
import { Compass, Calendar, ShieldCheck } from 'lucide-react';

export const FireSimulator: React.FC = () => {
  const [monthlyCost, setMonthlyCost] = useState(3000);
  const [monthlyInvest, setMonthlyInvest] = useState(500);
  const [currentSavings, setCurrentSavings] = useState(10000);

  const fireCalculations = useMemo(() => {
    // 1. Regra dos 4%: Patrimônio FIRE = Custo Mensal * 12 * 25
    const targetFIRE = monthlyCost * 12 * 25;

    // 2. Simulação de Projeção em Loop (Juros Compostos Reais de 6% a.a. ou ~0.487% a.m. acima da inflação)
    const monthlyRate = 0.00487;
    let months = 0;
    let balance = currentSavings;

    if (monthlyInvest > 0 && balance < targetFIRE) {
      while (balance < targetFIRE && months < 600) { // Limite de 50 anos (600 meses)
        balance = balance * (1 + monthlyRate) + monthlyInvest;
        months++;
      }
    }

    const years = months / 12;
    const progressPct = Math.min((currentSavings / targetFIRE) * 100, 100);

    return {
      targetFIRE,
      years: balance >= targetFIRE ? years.toFixed(1) : '50+',
      progressPct,
    };
  }, [monthlyCost, monthlyInvest, currentSavings]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex flex-col bg-card border border-border rounded-[2.5rem] p-6 shadow-premium dark:shadow-premium-dark transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold font-sans tracking-tight text-foreground">Simulador Liberdade (FIRE)</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
        Descubra quando você poderá viver de renda passiva com base na **Regra dos 4%** (custo anual multiplicado por 25).
      </p>

      {/* Sliders Interativos */}
      <div className="flex flex-col gap-5 mb-6">
        {/* Custo de Vida Mensal Desejado */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Custo de Vida Ideal</span>
            <span className="text-foreground">{formatCurrency(monthlyCost)}/mês</span>
          </div>
          <input
            type="range"
            min="1000"
            max="20000"
            step="500"
            value={monthlyCost}
            onChange={(e) => setMonthlyCost(Number(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Investimento Mensal */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Aporte Mensal Previsto</span>
            <span className="text-foreground">{formatCurrency(monthlyInvest)}/mês</span>
          </div>
          <input
            type="range"
            min="50"
            max="10000"
            step="50"
            value={monthlyInvest}
            onChange={(e) => setMonthlyInvest(Number(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Patrimônio Atual */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Patrimônio Salvo</span>
            <span className="text-foreground">{formatCurrency(currentSavings)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="500000"
            step="1000"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(Number(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>

      {/* Estatísticas de Progresso e Resultados */}
      <div className="flex flex-col gap-4 border border-border p-4 rounded-2xl bg-muted/20">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Seu Alvo de Aposentadoria:</span>
          <span className="font-bold text-foreground">{formatCurrency(fireCalculations.targetFIRE)}</span>
        </div>

        {/* Barra de Progresso FIRE */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
            <span>PROGRESsO ATUAL</span>
            <span>{fireCalculations.progressPct.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
              style={{ width: `${fireCalculations.progressPct}%` }}
            />
          </div>
        </div>

        <div className="h-px bg-border my-1" />

        {/* Anos Faltantes */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Tempo Estimado</span>
            <span className="text-sm font-extrabold text-foreground flex items-center gap-1 leading-tight">
              {fireCalculations.years} anos
              <span className="text-[10px] text-muted-foreground font-medium lowercase">restantes</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground bg-primary/5 p-2.5 rounded-xl border border-primary/10">
        <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
        <span>Assume juros de 6% ao ano reais (acima da inflação), mantendo o poder de compra intacto!</span>
      </div>
    </div>
  );
};
