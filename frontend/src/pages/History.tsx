import { useState, useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { SmartFilters } from '../components/SmartFilters';
import { formatCurrency, formatDate } from '../lib/format';
import { ArrowDownRight, ArrowUpRight, Trash2 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../context/ToastContext';

export function History() {
  const { transactions, deleteTransaction, isLoading } = useTransactions();
  const { addToast } = useToast();
  
  // States para os filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  
  // State para deleção
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || selectedCategory !== '' || selectedType !== 'all' || selectedPeriod !== 'all';
  }, [searchTerm, selectedCategory, selectedType, selectedPeriod]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedType('all');
    setSelectedPeriod('all');
  };

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    
    return transactions
      // Filtro de Busca (Descrição ou Categoria)
      .filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      // Filtro de Categoria
      .filter(t => selectedCategory === '' || t.category === selectedCategory)
      // Filtro de Tipo
      .filter(t => {
        if (selectedType === 'all') return true;
        return t.type === selectedType;
      })
      // Filtro de Período
      .filter(t => {
        if (selectedPeriod === 'all') return true;
        
        const transactionDate = new Date(t.date);
        
        if (selectedPeriod === '7days') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          return transactionDate >= sevenDaysAgo;
        }
        
        if (selectedPeriod === '30days') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          return transactionDate >= thirtyDaysAgo;
        }
        
        if (selectedPeriod === 'month') {
          return transactionDate.getMonth() === now.getMonth() && 
                 transactionDate.getFullYear() === now.getFullYear();
        }
        
        if (selectedPeriod === 'year') {
          return transactionDate.getFullYear() === now.getFullYear();
        }
        
        return true;
      })
      // Ordena por data (mais recente primeiro)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, selectedCategory, selectedType, selectedPeriod]);

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;
    try {
      await deleteTransaction(transactionToDelete);
      addToast('Transação excluída com sucesso!', 'success');
    } catch (error) {
      addToast('Erro ao excluir transação.', 'error');
    } finally {
      setTransactionToDelete(null);
    }
  };

  return (
    <>
      <header className="flex flex-col w-full mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Extrato Completo</h2>
        <p className="text-sm text-muted-foreground mt-1">Busque e filtre todo o seu histórico financeiro.</p>
      </header>

      <SmartFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <section className="flex flex-col gap-2 w-full max-w-4xl">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 mt-4 text-center bg-card/50 border border-dashed border-border rounded-[2rem] min-h-[200px]">
            <span className="text-muted-foreground font-medium">Nenhuma transação encontrada com estes filtros.</span>
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const isIncome = transaction.type === 'income';
            const defaultCurrency = localStorage.getItem('@FinanceApp:currency') || 'BRL';
            const hasDifferentCurrency = transaction.currency && transaction.currency !== defaultCurrency;
            const originalValue = hasDifferentCurrency && transaction.exchangeRate
              ? transaction.amount / transaction.exchangeRate
              : transaction.amount;

            return (
              <div 
                key={transaction.id} 
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 px-5 rounded-2xl bg-card border border-border hover:shadow-sm hover:border-accent transition-all duration-200"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${isIncome ? 'bg-success/5 text-success' : 'bg-destructive/5 text-destructive'}`}>
                    {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex flex-col flex-1 gap-1">
                    <div className="flex justify-between items-start w-full">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{transaction.description}</span>
                        {hasDifferentCurrency && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground uppercase tracking-wide shrink-0">
                            {transaction.currency}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`font-semibold tabular-nums ${isIncome ? 'text-success' : 'text-foreground'}`}>
                          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                        {hasDifferentCurrency && (
                          <span className="text-[10px] text-muted-foreground font-medium mt-0.5" title={`Câmbio: 1 ${transaction.currency} = ${transaction.exchangeRate} ${defaultCurrency}`}>
                            {isIncome ? '+' : '-'}{formatCurrency(originalValue, transaction.currency)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-medium">
                        {transaction.category}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setTransactionToDelete(transaction.id)}
                  disabled={isLoading}
                  className="opacity-0 group-hover:opacity-100 sm:ml-4 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all self-end sm:self-auto disabled:opacity-50 mt-2 sm:mt-0"
                  aria-label="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
        
        {isLoading && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 px-5 rounded-2xl bg-card border border-border opacity-50 mt-2">
             <div className="flex items-center gap-4 w-full">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex flex-col flex-1 gap-2">
                   <div className="flex justify-between w-full">
                      <Skeleton className="w-32 h-5" />
                      <Skeleton className="w-24 h-5" />
                   </div>
                   <Skeleton className="w-20 h-4" />
                </div>
             </div>
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={transactionToDelete !== null}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Transação"
        message="Deseja realmente remover esta transação? Essa operação não pode ser revertida."
        confirmText="Excluir"
        cancelText="Cancelar"
        isDestructive={true}
      />
    </>
  );
}
