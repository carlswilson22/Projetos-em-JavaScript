import { useState, useMemo } from 'react';
import { DashboardSummary } from '../components/DashboardSummary';
import { FinanceChart } from '../components/FinanceChart';
import { TransactionsList } from '../components/TransactionsList';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { CategoryDistributionChart } from '../components/CategoryDistributionChart';
import { BudgetManager } from '../components/BudgetManager';
import { GoalsWidget } from '../components/GoalsWidget';
import { FinancialInsights } from '../components/FinancialInsights';
import { FireSimulator } from '../components/FireSimulator';
import { CurrencyExchangeWidget } from '../components/CurrencyExchangeWidget';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../context/TransactionContext';

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { transactions } = useTransactions();
  
  // Estado da aba de moedas ativa
  const [activeTab, setActiveTab] = useState<'all' | 'BRL' | 'USD' | 'BIT'>('all');

  const firstName = user?.name ? user.name.split(' ')[0] : 'Usuário';
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  // Filtra as transações com base na carteira/moeda selecionada
  const filteredTransactions = useMemo(() => {
    if (activeTab === 'all') return transactions;
    if (activeTab === 'BRL') {
      return transactions.filter(t => !t.currency || t.currency === 'BRL');
    }
    return transactions.filter(t => t.currency === activeTab);
  }, [transactions, activeTab]);

  return (
    <>
      <header className="flex items-center justify-between w-full mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex md:hidden items-center justify-center font-bold font-sans text-xl overflow-hidden shadow-sm border border-border">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center">
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

      {/* Seletor de Abas de Moedas */}
      <div className="flex gap-2.5 mb-8 bg-muted/45 p-1.5 rounded-2xl w-fit border border-border/40 flex-wrap">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${activeTab === 'all' ? 'bg-card shadow-sm text-foreground border border-border/20 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Geral (Patrimônio)
        </button>
        <button
          onClick={() => setActiveTab('BRL')}
          className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${activeTab === 'BRL' ? 'bg-card shadow-sm text-foreground border border-border/20 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Carteira BRL
        </button>
        <button
          onClick={() => setActiveTab('USD')}
          className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${activeTab === 'USD' ? 'bg-card shadow-sm text-foreground border border-border/20 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Carteira USD
        </button>
        <button
          onClick={() => setActiveTab('BIT')}
          className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${activeTab === 'BIT' ? 'bg-card shadow-sm text-foreground border border-border/20 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Carteira BIT
        </button>
      </div>

      <DashboardSummary overrideTransactions={filteredTransactions} overrideCurrency={activeTab} />
      
      {/* Grid Principal do Topo: Gráfico de Finanças (2/3) + Cotações/Carteiras (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 items-start w-full">
        <div className="lg:col-span-2 w-full">
          <FinanceChart overrideTransactions={filteredTransactions} overrideCurrency={activeTab} />
        </div>
        <div className="w-full">
          <CurrencyExchangeWidget />
        </div>
      </div>

      <div className="mt-8">
        <FinancialInsights />
      </div>

      {/* Grid Intermediário: Transações (2/3) + Gráfico de Pizza (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 items-start w-full">
        <div className="lg:col-span-2 w-full">
          <TransactionsList overrideTransactions={filteredTransactions} />
        </div>
        <div className="w-full">
          <CategoryDistributionChart overrideTransactions={filteredTransactions} overrideCurrency={activeTab} />
        </div>
      </div>

      {/* Grid Inferior Horizontal: Orçamentos (1/3) + Metas (1/3) + FIRE (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 items-start w-full">
        <BudgetManager />
        <GoalsWidget />
        <FireSimulator />
      </div>
      
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
