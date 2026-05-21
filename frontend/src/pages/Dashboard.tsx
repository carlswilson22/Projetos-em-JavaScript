import { useState } from 'react';
import { DashboardSummary } from '../components/DashboardSummary';
import { FinanceChart } from '../components/FinanceChart';
import { TransactionsList } from '../components/TransactionsList';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { CategoryDistributionChart } from '../components/CategoryDistributionChart';
import { GoalsWidget } from '../components/GoalsWidget';
import { FinancialInsights } from '../components/FinancialInsights';
import { FireSimulator } from '../components/FireSimulator';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const firstName = user?.name ? user.name.split(' ')[0] : 'Usuário';
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <header className="flex items-center justify-between w-full mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex md:hidden items-center justify-center font-bold font-sans text-xl overflow-hidden shadow-sm">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-foreground text-background flex items-center justify-center">
                {initial}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight">Olá, {firstName}! 👋</h2>
            <p className="text-sm text-muted-foreground hidden sm:block">Acompanhamento e evolução mensal de suas finanças</p>
          </div>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-sm whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Nova transação
        </Button>
      </header>

      <DashboardSummary />
      
      <div className="mt-8">
        <FinanceChart />
      </div>

      <div className="mt-8">
        <FinancialInsights />
      </div>

      {/* Grid Premium Multi-colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 items-start w-full">
        {/* Lado Esquerdo (2/3 da tela): Lista de Transações */}
        <div className="lg:col-span-2 w-full">
          <TransactionsList />
        </div>

        {/* Lado Direito (1/3 da tela): Análise Gráfica, Metas & Simulador */}
        <div className="flex flex-col gap-8 w-full">
          <CategoryDistributionChart />
          <GoalsWidget />
          <FireSimulator />
        </div>
      </div>
      
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

